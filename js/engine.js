/**
 * PTE Speaking Module - Core Engine
 * Audio Recording, Speech Recognition, Timer, and Scoring
 */

window.PTE = window.PTE || {};

// ── Audio Recorder ─────────────────────────────────────────────

PTE.AudioRecorder = {
  mediaRecorder: null,
  audioChunks: [],
  audioBlob: null,
  audioUrl: null,
  stream: null,
  audioContext: null,
  analyser: null,
  dataArray: null,
  isRecording: false,
  animationId: null,

  async init() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      source.connect(this.analyser);
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      return true;
    } catch (err) {
      console.error('Microphone access denied:', err);
      return false;
    }
  },

  start() {
    if (!this.stream) return false;
    this.audioChunks = [];
    this.audioBlob = null;
    this.audioUrl = null;
    this.mediaRecorder = new MediaRecorder(this.stream);
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.audioChunks.push(e.data);
    };
    this.mediaRecorder.onstop = () => {
      this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      this.audioUrl = URL.createObjectURL(this.audioBlob);
    };
    this.mediaRecorder.start(100);
    this.isRecording = true;
    return true;
  },

  stop() {
    return new Promise((resolve) => {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          this.audioUrl = URL.createObjectURL(this.audioBlob);
          this.isRecording = false;
          resolve(this.audioUrl);
        };
        this.mediaRecorder.stop();
      } else {
        this.isRecording = false;
        resolve(null);
      }
    });
  },

  getFrequencyData() {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.dataArray);
      return this.dataArray;
    }
    return null;
  },

  getTimeDomainData() {
    if (this.analyser) {
      const timeData = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteTimeDomainData(timeData);
      return timeData;
    }
    return null;
  },

  /**
   * Soft reset: clears recording state but KEEPS the mic stream alive.
   * Use this between questions (Try Again / Next Question).
   */
  reset() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.animationId = null;
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try { this.mediaRecorder.stop(); } catch(e) {}
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioBlob = null;
    if (this.audioUrl) {
      try { URL.revokeObjectURL(this.audioUrl); } catch(e) {}
    }
    this.audioUrl = null;
    this.isRecording = false;
  },

  /**
   * Full cleanup: stops mic stream and closes AudioContext.
   * Only use when navigating AWAY from practice entirely.
   */
  cleanup() {
    this.reset();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try { this.audioContext.close(); } catch(e) {}
    }
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
    }
    this.stream = null;
    this.audioContext = null;
    this.analyser = null;
  },

  /**
   * Check if the mic stream is still alive and usable.
   */
  isStreamActive() {
    return this.stream && this.stream.getTracks().some(t => t.readyState === 'live');
  }
};

// ── Speech Recognition ─────────────────────────────────────────

PTE.SpeechRecognizer = {
  recognition: null,
  transcript: '',
  interimTranscript: '',
  confidence: 0,
  confidenceScores: [],
  isListening: false,
  onResult: null,
  onEnd: null,
  wordTimestamps: [],
  silenceCount: 0,

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported');
      return false;
    }
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
          this.confidenceScores.push(result[0].confidence);
        } else {
          interim += result[0].transcript;
        }
      }
      if (final) {
        this.transcript += final;
        this.wordTimestamps.push({ time: Date.now(), words: final.trim().split(/\s+/).length });
      }
      this.interimTranscript = interim;
      if (this.onResult) {
        this.onResult(this.transcript, this.interimTranscript);
      }
    };

    this.recognition.onerror = (event) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('Speech recognition error:', event.error);
      }
    };

    this.recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      if (this.isListening) {
        try { this.recognition.start(); } catch(e) { /* ignore */ }
      } else if (this.onEnd) {
        this.onEnd(this.transcript, this.getAverageConfidence());
      }
    };

    return true;
  },

  start() {
    this.transcript = '';
    this.interimTranscript = '';
    this.confidence = 0;
    this.confidenceScores = [];
    this.wordTimestamps = [];
    this.silenceCount = 0;
    this.isListening = true;

    // On mobile, re-create the recognition instance for a clean start
    // (some browsers can't restart a stopped recognition)
    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.warn('[Speech] Restart failed, re-initializing...', e.message);
      // Re-create the instance and try again
      try {
        this.init();
        this.isListening = true;
        this.recognition.start();
        return true;
      } catch (e2) {
        console.error('[Speech] Failed to start recognition:', e2);
        this.isListening = false;
        return false;
      }
    }
  },

  stop() {
    this.isListening = false;
    if (this.recognition) {
      try { this.recognition.stop(); } catch(e) { /* ignore */ }
    }
    return {
      transcript: this.transcript.trim(),
      confidence: this.getAverageConfidence(),
      wordTimestamps: this.wordTimestamps
    };
  },

  getAverageConfidence() {
    if (this.confidenceScores.length === 0) return 0;
    return this.confidenceScores.reduce((a, b) => a + b, 0) / this.confidenceScores.length;
  }
};

// ── Text-to-Speech (for audio prompts) ─────────────────────────

PTE.TTS = {
  synth: window.speechSynthesis || null,
  speaking: false,
  voice: null,
  _unlocked: false,
  _resumeInterval: null,

  init() {
    return new Promise((resolve) => {
      if (!this.synth) {
        console.warn('[TTS] speechSynthesis not available');
        resolve(false);
        return;
      }

      const loadVoices = () => {
        const voices = this.synth.getVoices();
        // Prefer a natural English voice
        this.voice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
                     voices.find(v => v.lang.startsWith('en') && v.name.includes('Natural')) ||
                     voices.find(v => v.lang.startsWith('en') && v.name.includes('Samantha')) ||
                     voices.find(v => v.lang.startsWith('en-') && !v.localService) ||
                     voices.find(v => v.lang.startsWith('en')) ||
                     voices[0] || null;
        console.log('[TTS] Voice selected:', this.voice ? this.voice.name : 'none', '| Total voices:', voices.length);
        resolve(true);
      };

      if (this.synth.getVoices().length > 0) {
        loadVoices();
      } else {
        this.synth.onvoiceschanged = loadVoices;
        // Longer fallback for mobile (voices load slowly on iOS/Android)
        setTimeout(loadVoices, 2000);
      }
    });
  },

  /**
   * Unlock TTS on mobile. Must be called inside a user gesture (click/tap).
   * Plays a silent utterance to satisfy iOS/Android audio restrictions.
   */
  unlock() {
    if (this._unlocked || !this.synth) return;
    try {
      const u = new SpeechSynthesisUtterance('');
      u.volume = 0;
      u.rate = 1;
      this.synth.speak(u);
      this._unlocked = true;
      console.log('[TTS] Unlocked for mobile');
    } catch (e) {
      console.warn('[TTS] Unlock failed:', e);
    }
  },

  /**
   * Re-init voices if none were found initially.
   */
  _ensureVoice() {
    if (this.voice) return;
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    this.voice = voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  },

  speak(text, rate = 0.95) {
    return new Promise((resolve) => {
      if (!this.synth) {
        console.warn('[TTS] speechSynthesis not available, skipping');
        resolve();
        return;
      }

      if (!text || text.trim().length === 0) {
        resolve();
        return;
      }

      // Re-check voices (mobile may load them late)
      this._ensureVoice();

      // Cancel any ongoing speech
      if (this.synth.speaking) {
        this.synth.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.voice) utterance.voice = this.voice;
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = 'en-US';

      // Safety timeout: resolve even if TTS hangs (mobile issue)
      // Estimate duration: ~6 words/sec at rate 0.95
      const wordCount = text.trim().split(/\s+/).length;
      const estimatedMs = Math.max(5000, (wordCount / 5) * 1000 * (1 / rate) + 3000);
      let resolved = false;
      const safetyTimer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          this.speaking = false;
          this._stopResumeHack();
          console.warn('[TTS] Safety timeout after', estimatedMs, 'ms');
          try { this.synth.cancel(); } catch(e) {}
          resolve();
        }
      }, estimatedMs);

      utterance.onend = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(safetyTimer);
          this.speaking = false;
          this._stopResumeHack();
          resolve();
        }
      };
      utterance.onerror = (e) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(safetyTimer);
          this.speaking = false;
          this._stopResumeHack();
          console.warn('[TTS] Speech error:', e.error || e);
          resolve();
        }
      };

      this.speaking = true;

      // Chrome bug workaround: Chrome pauses speechSynthesis after ~15 sec.
      // Periodically call resume() to keep it going.
      this._startResumeHack();

      this.synth.speak(utterance);
    });
  },

  /**
   * Chrome resume hack: Chrome pauses TTS after ~15 seconds.
   * Calling resume() periodically prevents this.
   */
  _startResumeHack() {
    this._stopResumeHack();
    this._resumeInterval = setInterval(() => {
      if (this.synth && this.synth.speaking) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 10000);
  },

  _stopResumeHack() {
    if (this._resumeInterval) {
      clearInterval(this._resumeInterval);
      this._resumeInterval = null;
    }
  },

  stop() {
    if (this.synth && this.synth.speaking) this.synth.cancel();
    this.speaking = false;
    this._stopResumeHack();
  }
};

// ── Timer ──────────────────────────────────────────────────────

PTE.Timer = {
  interval: null,
  remaining: 0,
  total: 0,
  onTick: null,
  onComplete: null,
  isPaused: false,

  start(seconds, onTick, onComplete) {
    this.stop();
    this.remaining = seconds;
    this.total = seconds;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.isPaused = false;

    if (this.onTick) this.onTick(this.remaining, this.total);

    this.interval = setInterval(() => {
      if (!this.isPaused) {
        this.remaining--;
        if (this.onTick) this.onTick(this.remaining, this.total);
        if (this.remaining <= 0) {
          this.stop();
          if (this.onComplete) this.onComplete();
        }
      }
    }, 1000);
  },

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  },

  pause() {
    this.isPaused = true;
  },

  resume() {
    this.isPaused = false;
  },

  getProgress() {
    if (this.total === 0) return 0;
    return 1 - (this.remaining / this.total);
  }
};

// ── Scoring Engine ─────────────────────────────────────────────

PTE.Scoring = {
  /**
   * Calculate content score by comparing recognized text with expected
   * @param {string} recognized - Speech-to-text output
   * @param {string} expected - Original text or expected content
   * @param {string[]} keywords - Important keywords
   * @returns {number} Score 0-90
   */
  contentScore(recognized, expected, keywords) {
    if (!recognized || recognized.trim().length === 0) return 0;

    const recWords = this.normalizeText(recognized).split(/\s+/);
    const expWords = expected ? this.normalizeText(expected).split(/\s+/) : [];
    const kwWords = keywords ? keywords.map(k => k.toLowerCase()) : [];

    let score = 0;

    // Word overlap with expected text (if available)
    if (expWords.length > 0) {
      const matchCount = recWords.filter(w => expWords.includes(w)).length;
      const overlapRatio = matchCount / Math.max(expWords.length, 1);
      score = overlapRatio * 60; // Max 60 from direct overlap
    }

    // Keyword matching (bonus points)
    if (kwWords.length > 0) {
      const recLower = recognized.toLowerCase();
      const kwMatches = kwWords.filter(kw => recLower.includes(kw)).length;
      const kwRatio = kwMatches / kwWords.length;
      score += kwRatio * 30; // Max 30 from keywords
    }

    // Length penalty/bonus
    const expectedLen = expWords.length || 20;
    const lenRatio = recWords.length / expectedLen;
    if (lenRatio < 0.3) score *= 0.5;
    else if (lenRatio < 0.5) score *= 0.7;
    else if (lenRatio > 0.3 && lenRatio <= 1.3) score *= 1;
    else if (lenRatio > 1.5) score *= 0.9;

    return Math.min(90, Math.round(score));
  },

  /**
   * Calculate pronunciation score based on recognition confidence
   * @param {number} confidence - Average recognition confidence (0-1)
   * @param {string} recognized - Recognized text
   * @returns {number} Score 0-90
   */
  pronunciationScore(confidence, recognized) {
    if (!recognized || recognized.trim().length === 0) return 0;

    // Base score from confidence
    let score = confidence * 80;

    // Bonus for longer recognized text (more data = more reliable)
    const wordCount = recognized.trim().split(/\s+/).length;
    if (wordCount >= 10) score += 5;
    if (wordCount >= 20) score += 5;

    // Minimum score if something was recognized
    if (wordCount > 0 && score < 15) score = 15;

    return Math.min(90, Math.round(score));
  },

  /**
   * Calculate fluency score based on speech patterns
   * @param {object[]} wordTimestamps - Timestamps of word recognition events
   * @param {number} totalTime - Total recording time in seconds
   * @param {string} recognized - Recognized text
   * @returns {number} Score 0-90
   */
  fluencyScore(wordTimestamps, totalTime, recognized) {
    if (!recognized || recognized.trim().length === 0) return 0;

    const wordCount = recognized.trim().split(/\s+/).length;
    
    // Words per minute (ideal: 120-160 for PTE)
    const wpm = (wordCount / totalTime) * 60;
    let wpmScore;
    if (wpm >= 100 && wpm <= 180) wpmScore = 40; // Good pace
    else if (wpm >= 80 && wpm < 100) wpmScore = 30;
    else if (wpm > 180 && wpm <= 200) wpmScore = 30;
    else if (wpm >= 60 && wpm < 80) wpmScore = 20;
    else wpmScore = 10;

    // Continuity (fewer recognition events = smoother speech)
    let continuityScore = 20;
    if (wordTimestamps.length > 0 && totalTime > 5) {
      const eventsPerSecond = wordTimestamps.length / totalTime;
      if (eventsPerSecond > 0.1 && eventsPerSecond < 1) continuityScore = 30;
      else if (eventsPerSecond >= 1) continuityScore = 20;
      else continuityScore = 10;
    }

    // Length utilization (using available time)
    const utilization = totalTime > 0 ? Math.min(1, wordCount / (totalTime * 2)) : 0;
    const utilizationScore = utilization * 20;

    const total = wpmScore + continuityScore + utilizationScore;
    return Math.min(90, Math.round(total));
  },

  /**
   * Calculate overall score for a question
   */
  calculateOverall(scores, type) {
    const typeConfig = Object.values(PTE.QUESTION_TYPES).find(t => t.id === type);
    if (!typeConfig) return 0;

    const criteria = typeConfig.scoring;
    
    if (criteria.includes('vocabulary')) {
      // Answer Short Question: just vocabulary
      return scores.vocabulary || 0;
    }

    let total = 0;
    let weights = 0;

    if (criteria.includes('content')) {
      total += (scores.content || 0) * 0.4;
      weights += 0.4;
    }
    if (criteria.includes('pronunciation')) {
      total += (scores.pronunciation || 0) * 0.3;
      weights += 0.3;
    }
    if (criteria.includes('fluency')) {
      total += (scores.fluency || 0) * 0.3;
      weights += 0.3;
    }

    return weights > 0 ? Math.round(total / weights) : 0;
  },

  /**
   * Vocabulary score for short answer questions
   */
  vocabularyScore(recognized, correctAnswers) {
    if (!recognized || recognized.trim().length === 0) return 0;
    const recNorm = this.normalizeText(recognized);
    for (const answer of correctAnswers) {
      if (recNorm.includes(answer.toLowerCase())) {
        return 90;
      }
    }
    // Partial match using Levenshtein
    const recWords = recNorm.split(/\s+/);
    for (const answer of correctAnswers) {
      for (const word of recWords) {
        if (this.levenshtein(word, answer.toLowerCase()) <= 2) {
          return 60;
        }
      }
    }
    return 0;
  },

  normalizeText(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  },

  levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  },

  /**
   * Get score band description
   */
  getBand(score) {
    if (score >= 79) return { label: 'Expert', color: '#10b981', emoji: '🌟' };
    if (score >= 65) return { label: 'Proficient', color: '#6366f1', emoji: '✨' };
    if (score >= 50) return { label: 'Competent', color: '#3b82f6', emoji: '👍' };
    if (score >= 36) return { label: 'Developing', color: '#f59e0b', emoji: '📈' };
    return { label: 'Needs Practice', color: '#ef4444', emoji: '💪' };
  },

  /**
   * Get feedback messages based on scores
   */
  getFeedback(scores, type) {
    const feedback = [];
    
    if (scores.content !== undefined) {
      if (scores.content >= 70) feedback.push('Great content coverage! You captured the key points well.');
      else if (scores.content >= 50) feedback.push('Good attempt at covering the content. Try to include more key details.');
      else if (scores.content >= 30) feedback.push('You missed several important points. Focus on capturing the main ideas.');
      else feedback.push('Content needs significant improvement. Practice identifying and repeating key information.');
    }

    if (scores.pronunciation !== undefined) {
      if (scores.pronunciation >= 70) feedback.push('Excellent pronunciation! Your speech was clear and easy to understand.');
      else if (scores.pronunciation >= 50) feedback.push('Good pronunciation overall. Work on clarity for some words.');
      else if (scores.pronunciation >= 30) feedback.push('Pronunciation needs work. Practice speaking clearly and enunciating each word.');
      else feedback.push('Focus on improving pronunciation. Speak slowly and clearly.');
    }

    if (scores.fluency !== undefined) {
      if (scores.fluency >= 70) feedback.push('Smooth and natural delivery! Great pacing and flow.');
      else if (scores.fluency >= 50) feedback.push('Decent fluency. Try to reduce pauses and maintain a steady pace.');
      else if (scores.fluency >= 30) feedback.push('Work on fluency. Practice speaking without long pauses or hesitations.');
      else feedback.push('Fluency needs improvement. Practice reading aloud to build confidence and flow.');
    }

    if (scores.vocabulary !== undefined) {
      if (scores.vocabulary >= 79) feedback.push('Correct answer! Well done.');
      else if (scores.vocabulary >= 50) feedback.push('Close answer. The exact answer was expected.');
      else feedback.push('Incorrect answer. Review the correct answer and try again.');
    }

    return feedback;
  }
};
