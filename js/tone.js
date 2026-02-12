/**
 * PTE Speaking Module - Tone & Pitch Analyzer
 * Real-time pitch detection using autocorrelation algorithm
 * Analyzes: fundamental frequency, pitch variation, volume, intonation
 */

window.PTE = window.PTE || {};

PTE.ToneAnalyzer = {
  audioContext: null,
  analyser: null,
  sourceNode: null,
  pitchHistory: [],      // Array of {time, pitch, volume} over time
  volumeHistory: [],
  sampleRate: 0,
  bufferLength: 0,
  isAnalyzing: false,
  animFrameId: null,
  startTime: 0,

  /**
   * Initialize with an existing audio stream
   */
  init(stream) {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.sampleRate = this.audioContext.sampleRate;
      this.sourceNode = this.audioContext.createMediaStreamSource(stream);
      
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;
      this.bufferLength = this.analyser.fftSize;
      
      this.sourceNode.connect(this.analyser);
      
      this.pitchHistory = [];
      this.volumeHistory = [];
      
      return true;
    } catch (e) {
      console.error('ToneAnalyzer init failed:', e);
      return false;
    }
  },

  /**
   * Start continuous pitch analysis
   */
  start() {
    this.isAnalyzing = true;
    this.startTime = Date.now();
    this.pitchHistory = [];
    this.volumeHistory = [];
    this._analyze();
  },

  _analyze() {
    if (!this.isAnalyzing) return;

    const buffer = new Float32Array(this.bufferLength);
    this.analyser.getFloatTimeDomainData(buffer);

    // Calculate RMS volume
    let rms = 0;
    for (let i = 0; i < buffer.length; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / buffer.length);
    const volumeDb = 20 * Math.log10(Math.max(rms, 0.00001));

    // Detect pitch using autocorrelation
    const pitch = this._detectPitch(buffer);

    const elapsed = (Date.now() - this.startTime) / 1000;

    if (pitch > 0) {
      this.pitchHistory.push({ time: elapsed, pitch: pitch, volume: volumeDb });
    }
    this.volumeHistory.push({ time: elapsed, volume: volumeDb, pitch: pitch || 0 });

    this.animFrameId = requestAnimationFrame(() => this._analyze());
  },

  /**
   * Autocorrelation-based pitch detection
   * Returns fundamental frequency in Hz, or 0 if not detected
   */
  _detectPitch(buffer) {
    const SIZE = buffer.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);

    // Check if there's enough signal
    let rms = 0;
    for (let i = 0; i < SIZE; i++) rms += buffer[i] * buffer[i];
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return 0; // Too quiet

    // Trim leading/trailing silence
    let r1 = 0, r2 = SIZE - 1;
    const threshold = 0.2;
    for (let i = 0; i < MAX_SAMPLES; i++) {
      if (Math.abs(buffer[i]) > threshold) { r1 = i; break; }
    }
    for (let i = SIZE - 1; i >= MAX_SAMPLES; i--) {
      if (Math.abs(buffer[i]) > threshold) { r2 = i; break; }
    }

    const trimmedBuffer = buffer.slice(r1, r2 + 1);
    const trimmedSize = trimmedBuffer.length;

    // Autocorrelation
    const correlations = new Float32Array(trimmedSize);
    for (let lag = 0; lag < trimmedSize; lag++) {
      let sum = 0;
      for (let i = 0; i < trimmedSize - lag; i++) {
        sum += trimmedBuffer[i] * trimmedBuffer[i + lag];
      }
      correlations[lag] = sum;
    }

    // Find first dip then peak
    let d = 0;
    while (correlations[d] > correlations[d + 1] && d < trimmedSize - 1) d++;

    let maxVal = -1;
    let maxPos = -1;
    for (let i = d; i < trimmedSize; i++) {
      if (correlations[i] > maxVal) {
        maxVal = correlations[i];
        maxPos = i;
      }
    }

    if (maxPos < 1 || maxVal < correlations[0] * 0.3) return 0;

    // Parabolic interpolation for better accuracy
    const y1 = correlations[maxPos - 1] || 0;
    const y2 = correlations[maxPos];
    const y3 = correlations[maxPos + 1] || 0;
    const shift = (y3 - y1) / (2 * (2 * y2 - y1 - y3));
    const refinedPos = maxPos + (isNaN(shift) ? 0 : shift);

    const frequency = this.sampleRate / refinedPos;

    // Voice range filter: 75 Hz (deep male) to 500 Hz (high female)
    if (frequency < 75 || frequency > 500) return 0;

    return Math.round(frequency * 10) / 10;
  },

  /**
   * Stop analysis and return results
   */
  stop() {
    this.isAnalyzing = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    return this.getResults();
  },

  /**
   * Get comprehensive analysis results
   */
  getResults() {
    const pitches = this.pitchHistory.filter(p => p.pitch > 0);
    const volumes = this.volumeHistory;

    if (pitches.length < 3) {
      return {
        hasPitchData: false,
        avgPitch: 0,
        pitchRange: 0,
        pitchVariation: 0,
        intonationScore: 0,
        volumeConsistency: 0,
        pitchHistory: [],
        volumeHistory: [],
        analysis: this._emptyAnalysis()
      };
    }

    const pitchValues = pitches.map(p => p.pitch);
    const avgPitch = pitchValues.reduce((a, b) => a + b, 0) / pitchValues.length;
    const minPitch = Math.min(...pitchValues);
    const maxPitch = Math.max(...pitchValues);
    const pitchRange = maxPitch - minPitch;

    // Standard deviation for pitch variation
    const pitchStdDev = Math.sqrt(
      pitchValues.reduce((sum, p) => sum + Math.pow(p - avgPitch, 2), 0) / pitchValues.length
    );
    const pitchVariation = pitchStdDev / avgPitch; // Coefficient of variation

    // Volume analysis
    const volValues = volumes.map(v => v.volume).filter(v => v > -60);
    const avgVol = volValues.length > 0 ? volValues.reduce((a, b) => a + b, 0) / volValues.length : -40;
    const volStdDev = volValues.length > 0 ? Math.sqrt(
      volValues.reduce((sum, v) => sum + Math.pow(v - avgVol, 2), 0) / volValues.length
    ) : 0;

    // Intonation patterns - check for rising/falling/flat patterns
    const intonationAnalysis = this._analyzeIntonation(pitches);

    // Scores (0-100)
    const intonationScore = this._scoreIntonation(pitchVariation, intonationAnalysis);
    const volumeConsistency = this._scoreVolume(volStdDev, avgVol);

    return {
      hasPitchData: true,
      avgPitch: Math.round(avgPitch),
      minPitch: Math.round(minPitch),
      maxPitch: Math.round(maxPitch),
      pitchRange: Math.round(pitchRange),
      pitchVariation: Math.round(pitchVariation * 100) / 100,
      pitchStdDev: Math.round(pitchStdDev),
      avgVolume: Math.round(avgVol),
      volumeStdDev: Math.round(volStdDev * 10) / 10,
      intonationScore,
      volumeConsistency,
      intonationPattern: intonationAnalysis.pattern,
      pitchHistory: this.pitchHistory,
      volumeHistory: this.volumeHistory,
      analysis: this._generateAnalysis(avgPitch, pitchVariation, intonationAnalysis, volumeConsistency, avgVol)
    };
  },

  _analyzeIntonation(pitches) {
    if (pitches.length < 4) return { pattern: 'insufficient', segments: [] };

    // Divide into segments (quarters)
    const segLen = Math.floor(pitches.length / 4);
    const segments = [];
    for (let i = 0; i < 4; i++) {
      const start = i * segLen;
      const end = i === 3 ? pitches.length : (i + 1) * segLen;
      const segPitches = pitches.slice(start, end).map(p => p.pitch);
      const avg = segPitches.reduce((a, b) => a + b, 0) / segPitches.length;
      segments.push(avg);
    }

    // Determine overall pattern
    const rising = segments[3] > segments[0] * 1.05;
    const falling = segments[3] < segments[0] * 0.95;
    const varied = Math.max(...segments) / Math.min(...segments) > 1.1;

    let pattern = 'flat';
    if (rising && varied) pattern = 'rising-varied';
    else if (falling && varied) pattern = 'falling-varied';
    else if (rising) pattern = 'rising';
    else if (falling) pattern = 'falling';
    else if (varied) pattern = 'varied';

    return { pattern, segments };
  },

  _scoreIntonation(pitchVariation, intonation) {
    let score = 50;

    // Ideal pitch variation for speech: 0.05 - 0.25
    if (pitchVariation >= 0.05 && pitchVariation <= 0.25) {
      score += 30;
    } else if (pitchVariation >= 0.03 && pitchVariation <= 0.35) {
      score += 15;
    } else if (pitchVariation < 0.03) {
      score -= 15; // Too monotone
    } else {
      score -= 10; // Too erratic
    }

    // Varied intonation is better
    if (['varied', 'falling-varied', 'rising-varied'].includes(intonation.pattern)) {
      score += 20;
    } else if (['rising', 'falling'].includes(intonation.pattern)) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  },

  _scoreVolume(stdDev, avgVol) {
    let score = 50;

    // Good volume (not too quiet)
    if (avgVol > -25) score += 20;
    else if (avgVol > -35) score += 10;
    else score -= 10;

    // Consistent volume (moderate variation is good)
    if (stdDev >= 2 && stdDev <= 8) score += 30;
    else if (stdDev >= 1 && stdDev <= 12) score += 15;
    else if (stdDev < 1) score -= 5; // Too flat
    else score -= 10; // Too inconsistent

    return Math.max(0, Math.min(100, score));
  },

  _generateAnalysis(avgPitch, pitchVariation, intonation, volumeScore, avgVol) {
    const analysis = {
      pitch: { rating: '', detail: '', suggestion: '' },
      intonation: { rating: '', detail: '', suggestion: '' },
      volume: { rating: '', detail: '', suggestion: '' },
      overall: { rating: '', summary: '' }
    };

    // Pitch classification
    if (avgPitch < 120) {
      analysis.pitch.detail = `Your average pitch is ${Math.round(avgPitch)} Hz (low range).`;
    } else if (avgPitch < 200) {
      analysis.pitch.detail = `Your average pitch is ${Math.round(avgPitch)} Hz (mid range).`;
    } else {
      analysis.pitch.detail = `Your average pitch is ${Math.round(avgPitch)} Hz (high range).`;
    }

    // Pitch variation
    if (pitchVariation < 0.03) {
      analysis.pitch.rating = 'needs-work';
      analysis.pitch.suggestion = 'Your speech sounds monotone. Try varying your pitch more — emphasize key words by raising your pitch slightly, and lower it for less important words.';
    } else if (pitchVariation <= 0.25) {
      analysis.pitch.rating = 'good';
      analysis.pitch.suggestion = 'Good pitch variation! Your speech sounds natural and engaging.';
    } else {
      analysis.pitch.rating = 'caution';
      analysis.pitch.suggestion = 'Your pitch varies quite a lot. Try to maintain a more controlled range while still emphasizing key words.';
    }

    // Intonation
    const patternNames = {
      'flat': 'Flat (monotone)',
      'rising': 'Rising',
      'falling': 'Falling (natural)',
      'varied': 'Varied (natural)',
      'rising-varied': 'Rising with variation (engaging)',
      'falling-varied': 'Falling with variation (natural)',
      'insufficient': 'Not enough data'
    };
    analysis.intonation.detail = `Your intonation pattern: ${patternNames[intonation.pattern] || intonation.pattern}`;

    if (['varied', 'falling-varied', 'rising-varied'].includes(intonation.pattern)) {
      analysis.intonation.rating = 'good';
      analysis.intonation.suggestion = 'Excellent intonation! Your speech has natural rises and falls, making it easy to follow.';
    } else if (intonation.pattern === 'flat') {
      analysis.intonation.rating = 'needs-work';
      analysis.intonation.suggestion = 'Your intonation is flat. Practice reading with expression — raise pitch for questions, lower for statements, and stress important words.';
    } else {
      analysis.intonation.rating = 'ok';
      analysis.intonation.suggestion = 'Your intonation is acceptable but could be more varied. Try practicing with news readers or TED talks as models.';
    }

    // Volume
    if (avgVol > -25) {
      analysis.volume.rating = 'good';
      analysis.volume.detail = 'Good volume — your voice is clear and audible.';
    } else if (avgVol > -35) {
      analysis.volume.rating = 'ok';
      analysis.volume.detail = 'Moderate volume. Speak a bit louder for better clarity.';
    } else {
      analysis.volume.rating = 'needs-work';
      analysis.volume.detail = 'Your volume is too low. Speak louder and closer to the microphone.';
    }
    analysis.volume.suggestion = volumeScore >= 70 ? 'Your volume consistency is good — keep it up.' : 'Try to maintain a consistent volume level throughout. Avoid trailing off at the end of sentences.';

    // Overall
    const ratings = [analysis.pitch.rating, analysis.intonation.rating, analysis.volume.rating];
    const goodCount = ratings.filter(r => r === 'good').length;
    if (goodCount >= 2) {
      analysis.overall.rating = 'good';
      analysis.overall.summary = 'Your vocal delivery is strong. Natural pitch variation, clear volume, and expressive intonation.';
    } else if (goodCount >= 1) {
      analysis.overall.rating = 'ok';
      analysis.overall.summary = 'Your vocal delivery is adequate but has room for improvement. Focus on the areas marked for attention.';
    } else {
      analysis.overall.rating = 'needs-work';
      analysis.overall.summary = 'Your vocal delivery needs significant improvement. Practice reading aloud daily with focus on expressiveness and clarity.';
    }

    return analysis;
  },

  _emptyAnalysis() {
    return {
      pitch: { rating: 'unknown', detail: 'Not enough speech detected for pitch analysis.', suggestion: 'Make sure you speak clearly and for a sufficient duration.' },
      intonation: { rating: 'unknown', detail: 'Not enough data.', suggestion: '' },
      volume: { rating: 'unknown', detail: 'Not enough data.', suggestion: 'Speak clearly into the microphone.' },
      overall: { rating: 'unknown', summary: 'Not enough speech was detected. Try speaking more clearly and loudly.' }
    };
  },

  cleanup() {
    this.stop();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try { this.audioContext.close(); } catch(e) {}
    }
    this.audioContext = null;
    this.analyser = null;
    this.sourceNode = null;
  }
};
