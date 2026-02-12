/**
 * PTE Speaking Module - AI Feedback Engine
 * Generates detailed, actionable feedback with specific improvement strategies
 */

window.PTE = window.PTE || {};

PTE.AIFeedback = {
  /**
   * Generate comprehensive AI feedback for a practice session
   * @param {object} params
   * @param {string} params.type - Question type ID
   * @param {string} params.transcript - Recognized speech
   * @param {string} params.expected - Expected/original text
   * @param {string[]} params.keywords - Expected keywords
   * @param {object} params.scores - Content, pronunciation, fluency scores
   * @param {number} params.confidence - Speech recognition confidence
   * @param {object} params.toneResults - Tone analyzer results
   * @param {number} params.duration - Recording duration in seconds
   * @param {number} params.maxDuration - Max recording time in seconds
   * @returns {object} Detailed feedback object
   */
  generate(params) {
    const { type, transcript, expected, keywords, scores, confidence, toneResults, duration, maxDuration } = params;

    const feedback = {
      overallSummary: '',
      strengths: [],
      improvements: [],
      contentAnalysis: null,
      pronunciationAnalysis: null,
      fluencyAnalysis: null,
      toneAnalysis: null,
      wordAnalysis: null,
      pteStrategies: [],
      practiceExercises: [],
      modelAnswer: null,
      scoreExplanation: ''
    };

    // Word-by-word analysis for content types
    if (expected && transcript) {
      feedback.wordAnalysis = this._wordByWordAnalysis(transcript, expected);
      feedback.contentAnalysis = this._contentAnalysis(transcript, expected, keywords);
    }

    // Pronunciation analysis
    if (scores.pronunciation !== undefined) {
      feedback.pronunciationAnalysis = this._pronunciationAnalysis(scores.pronunciation, confidence, transcript);
    }

    // Fluency analysis
    if (scores.fluency !== undefined) {
      feedback.fluencyAnalysis = this._fluencyAnalysis(scores.fluency, transcript, duration, maxDuration);
    }

    // Tone-specific analysis
    if (toneResults && toneResults.hasPitchData) {
      feedback.toneAnalysis = toneResults.analysis;
    }

    // Generate strengths and improvements
    this._generateStrengthsAndImprovements(feedback, scores, toneResults);

    // Type-specific strategies
    feedback.pteStrategies = this._getStrategies(type, scores);

    // Practice exercises
    feedback.practiceExercises = this._getExercises(type, scores, toneResults);

    // Model answer
    feedback.modelAnswer = this._getModelAnswer(type, expected, keywords);

    // Overall summary
    feedback.overallSummary = this._generateSummary(scores, type, toneResults);

    // Score explanation
    feedback.scoreExplanation = this._explainScores(scores, type);

    return feedback;
  },

  _wordByWordAnalysis(transcript, expected) {
    const recWords = transcript.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w);
    const expWords = expected.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w);

    const matched = [];
    const missed = [];
    const extra = [];

    const expSet = new Set(expWords);
    const recSet = new Set(recWords);

    // Find matched and missed words
    for (const word of expWords) {
      if (recSet.has(word)) {
        if (!matched.includes(word)) matched.push(word);
      } else {
        missed.push(word);
      }
    }

    // Find extra words (not in expected)
    for (const word of recWords) {
      if (!expSet.has(word) && !extra.includes(word)) {
        extra.push(word);
      }
    }

    const accuracy = expWords.length > 0 ? (matched.length / new Set(expWords).length) * 100 : 0;

    return {
      totalExpected: new Set(expWords).size,
      totalRecognized: recWords.length,
      matched: matched.length,
      missed: [...new Set(missed)].slice(0, 15),
      extra: extra.slice(0, 10),
      accuracy: Math.round(accuracy),
      recWords,
      expWords
    };
  },

  _contentAnalysis(transcript, expected, keywords) {
    const recLower = transcript.toLowerCase();
    const keywordResults = keywords ? keywords.map(kw => ({
      keyword: kw,
      found: recLower.includes(kw.toLowerCase()),
      important: true
    })) : [];

    const found = keywordResults.filter(k => k.found).length;
    const total = keywordResults.length;
    const coverage = total > 0 ? Math.round((found / total) * 100) : 0;

    let assessment = '';
    if (coverage >= 80) {
      assessment = 'Excellent content coverage. You captured most of the key points accurately.';
    } else if (coverage >= 60) {
      assessment = 'Good content coverage, but some important keywords were missed. Focus on capturing the main ideas.';
    } else if (coverage >= 40) {
      assessment = 'Moderate content coverage. Several key points were missed. Try to focus on understanding and reproducing the core message.';
    } else {
      assessment = 'Low content coverage. Most key points were missed. Practice active listening and note-taking strategies.';
    }

    return {
      keywordResults,
      found,
      total,
      coverage,
      assessment
    };
  },

  _pronunciationAnalysis(score, confidence, transcript) {
    const wordCount = transcript ? transcript.split(/\s+/).length : 0;

    let level, detail, tips;

    if (score >= 70) {
      level = 'excellent';
      detail = 'Your pronunciation is clear and intelligible. The speech recognition system captured your words accurately.';
      tips = [
        'Continue practicing to maintain this level',
        'Focus on stress patterns in multi-syllable words',
        'Record yourself and compare with native speakers'
      ];
    } else if (score >= 50) {
      level = 'good';
      detail = 'Your pronunciation is generally clear, but some words may not have been captured accurately.';
      tips = [
        'Practice problematic sounds (th, r, l, v, w) with tongue placement exercises',
        'Use shadowing technique: listen and speak simultaneously with native audio',
        'Focus on word endings — don\'t drop final consonants',
        'Record yourself and listen back to identify specific problem sounds'
      ];
    } else if (score >= 30) {
      level = 'developing';
      detail = 'Several words were not recognized correctly, suggesting pronunciation needs improvement.';
      tips = [
        'Start with minimal pair practice (ship/sheep, bit/beat, fan/van)',
        'Practice with speech-to-text apps to see which words get misrecognized',
        'Focus on vowel sounds — English has many vowel distinctions',
        'Practice word stress: PHOtograph vs phoTOGraphy vs photoGRAphic',
        'Slow down slightly to enunciate clearly'
      ];
    } else {
      level = 'needs-work';
      detail = 'Many words were not recognized, indicating significant pronunciation challenges.';
      tips = [
        'Begin with individual sound practice using IPA (International Phonetic Alphabet)',
        'Use apps like ELSA Speak for targeted pronunciation drills',
        'Practice speaking slowly and clearly, gradually increasing speed',
        'Focus on the most common English sounds first',
        'Listen to English podcasts/news daily for 30+ minutes',
        'Consider working with a pronunciation tutor'
      ];
    }

    return { level, score, detail, tips, confidence: Math.round(confidence * 100) };
  },

  _fluencyAnalysis(score, transcript, duration, maxDuration) {
    const wordCount = transcript ? transcript.split(/\s+/).length : 0;
    const wpm = duration > 0 ? Math.round((wordCount / duration) * 60) : 0;
    const timeUsed = maxDuration > 0 ? Math.round((duration / maxDuration) * 100) : 0;

    let paceAssessment, fluencyLevel, tips;

    // Assess pace
    if (wpm >= 120 && wpm <= 160) {
      paceAssessment = `Your pace of ${wpm} words per minute is ideal for PTE (target: 120-160 WPM).`;
    } else if (wpm >= 100 && wpm < 120) {
      paceAssessment = `Your pace of ${wpm} WPM is slightly slow. Try to speak a bit faster (target: 120-160 WPM).`;
    } else if (wpm > 160 && wpm <= 190) {
      paceAssessment = `Your pace of ${wpm} WPM is slightly fast. Slow down a bit for better clarity (target: 120-160 WPM).`;
    } else if (wpm < 100) {
      paceAssessment = `Your pace of ${wpm} WPM is too slow. This affects your fluency score significantly.`;
    } else {
      paceAssessment = `Your pace of ${wpm} WPM is too fast. Slow down to ensure clarity and accuracy.`;
    }

    if (score >= 70) {
      fluencyLevel = 'excellent';
      tips = [
        'Excellent fluency! Maintain this smooth, natural delivery.',
        'Continue to vary your pace slightly for emphasis on key points.'
      ];
    } else if (score >= 50) {
      fluencyLevel = 'good';
      tips = [
        'Practice reading aloud for 10 minutes daily to build speaking stamina',
        'Avoid "um", "uh", and long pauses — replace with brief natural pauses',
        'Use linking words (however, moreover, therefore) to connect ideas smoothly',
        'Practice speaking in complete sentences without restarting'
      ];
    } else if (score >= 30) {
      fluencyLevel = 'developing';
      tips = [
        'Read aloud from English texts for 15-20 minutes daily',
        'Record yourself and count hesitations — aim to reduce them each time',
        'Practice "chunking" — speak in meaningful phrases rather than word by word',
        'Shadow native speakers: listen and speak along simultaneously',
        'Use the full recording time — silence hurts your score'
      ];
    } else {
      fluencyLevel = 'needs-work';
      tips = [
        'Start with short passages (2-3 sentences) and build up gradually',
        'Practice speed reading aloud to build comfort with continuous speech',
        'Record daily reading and track improvement over time',
        'Focus on not going back to correct mistakes — keep moving forward',
        'Practice tongue twisters to improve articulatory fluency',
        'Always use the full recording time, even if you need to repeat content'
      ];
    }

    return {
      fluencyLevel,
      wordCount,
      wpm,
      duration: Math.round(duration),
      maxDuration,
      timeUsed,
      paceAssessment,
      tips
    };
  },

  _generateStrengthsAndImprovements(feedback, scores, toneResults) {
    // Strengths
    if (scores.content >= 60) feedback.strengths.push('Strong content recall — you captured the key information effectively.');
    if (scores.pronunciation >= 60) feedback.strengths.push('Clear pronunciation — your speech is easy to understand.');
    if (scores.fluency >= 60) feedback.strengths.push('Good fluency — smooth delivery with natural pacing.');
    if (scores.vocabulary >= 60) feedback.strengths.push('Correct vocabulary — you identified the right answer.');
    if (toneResults && toneResults.hasPitchData && toneResults.intonationScore >= 60) {
      feedback.strengths.push('Natural intonation — your voice has good pitch variation and expression.');
    }

    // Improvements
    if (scores.content !== undefined && scores.content < 50) {
      feedback.improvements.push('Content accuracy needs work — focus on capturing more key words and phrases.');
    }
    if (scores.pronunciation !== undefined && scores.pronunciation < 50) {
      feedback.improvements.push('Pronunciation clarity needs improvement — practice enunciation and common English sounds.');
    }
    if (scores.fluency !== undefined && scores.fluency < 50) {
      feedback.improvements.push('Fluency needs work — reduce pauses, hesitations, and aim for continuous speech.');
    }
    if (toneResults && toneResults.hasPitchData) {
      if (toneResults.intonationScore < 50) {
        feedback.improvements.push('Intonation is too flat — practice varying your pitch to sound more natural and engaging.');
      }
      if (toneResults.volumeConsistency < 50) {
        feedback.improvements.push('Volume consistency needs work — maintain steady volume and avoid trailing off at sentence ends.');
      }
    }
  },

  _getStrategies(type, scores) {
    const strategies = [];

    switch (type) {
      case 'read-aloud':
        strategies.push(
          { title: 'Use Preparation Time Wisely', detail: 'Silently read the entire passage once, then identify difficult words and practice their pronunciation in your head.' },
          { title: 'Chunk the Text', detail: 'Break the passage into meaningful phrases (3-5 words). Pause briefly between chunks rather than between individual words.' },
          { title: 'Mark Stress Words', detail: 'Mentally identify content words (nouns, verbs, adjectives) to stress. Function words (the, a, of) should be spoken quickly.' }
        );
        if (scores.content < 60) {
          strategies.push({ title: 'Don\'t Skip Words', detail: 'If you stumble on a word, make your best attempt and keep going. Skipping words hurts content score more than mispronouncing them.' });
        }
        break;

      case 'repeat-sentence':
        strategies.push(
          { title: 'APEUni Method 258', detail: 'Remember: first 2 words, middle 5 words, last 8 sounds. This helps capture the sentence structure even when memory is partial.' },
          { title: 'Focus on Structure', detail: 'Listen for the sentence structure (subject-verb-object) rather than individual words. Understanding the grammar helps recall.' },
          { title: 'Start Speaking Immediately', detail: 'Begin speaking as soon as the audio ends. Delay causes you to forget. Even if you only remember part, say what you can.' }
        );
        break;

      case 'describe-image':
        strategies.push(
          { title: 'Use a Template', detail: 'Start with: "This [chart type] shows/illustrates [topic]." Then: "The highest/largest is... The lowest/smallest is..." End with: "Overall/In conclusion..."' },
          { title: 'Mention Numbers', detail: 'Always include specific data points. "China had the highest value at approximately eleven thousand" is better than "China was the highest."' },
          { title: 'Cover All Elements', detail: 'Mention: title, axes labels, highest value, lowest value, any notable trends or patterns.' }
        );
        break;

      case 'retell-lecture':
        strategies.push(
          { title: 'Note-Taking Strategy', detail: 'Write 5-7 key phrases while listening. Use symbols and abbreviations. Focus on: topic, main argument, examples, conclusion.' },
          { title: 'Use the Template', detail: '"The speaker/lecturer discussed [topic]. The main point was [key idea]. They mentioned that [detail 1] and [detail 2]. In conclusion, [summary]."' },
          { title: 'Speak for Full 40 Seconds', detail: 'Even if you run out of main points, elaborate on what you remember. Silence is more damaging than repetition.' }
        );
        break;

      case 'answer-short-question':
        strategies.push(
          { title: 'Answer Immediately', detail: 'Give your answer within 1-3 seconds. Don\'t overthink or explain — just give the word or phrase.' },
          { title: 'Build General Knowledge', detail: 'Study common categories: geography (capitals, continents), science (basic facts), language (grammar terms), daily life (objects, professions).' },
          { title: 'If Unsure, Guess', detail: 'Always attempt an answer. Silence scores zero, but a guess might be right or partially credited.' }
        );
        break;

      case 'summarize-group-discussion':
        strategies.push(
          { title: 'Track Each Speaker', detail: 'Note the main point of each speaker. Use labels (A said..., B argued..., C suggested...).' },
          { title: 'Identify Agreement/Disagreement', detail: 'Note where speakers agree and disagree. This shows comprehension.' },
          { title: 'Use Academic Language', detail: 'Use formal vocabulary: "discussed", "argued", "suggested", "concluded", "agreed", "disagreed".' }
        );
        break;

      case 'respond-to-situation':
        strategies.push(
          { title: 'Read Scenario Carefully', detail: 'Identify: Who are you? Who are you talking to? What is the issue? What should you do?' },
          { title: 'Match the Tone', detail: 'Use appropriate formality. Formal for professors/managers, semi-formal for colleagues, polite but firm for complaints.' },
          { title: 'Address All Parts', detail: 'Make sure your response covers the complete situation — acknowledge the issue, explain your position, and suggest a solution.' }
        );
        break;
    }

    return strategies;
  },

  _getExercises(type, scores, toneResults) {
    const exercises = [];

    // Universal exercises
    if (scores.pronunciation !== undefined && scores.pronunciation < 60) {
      exercises.push({
        title: 'Tongue Twisters (5 min/day)',
        description: 'Practice: "She sells seashells by the seashore" — start slow, increase speed. This builds articulatory precision.',
        difficulty: 'easy'
      });
      exercises.push({
        title: 'Minimal Pair Practice (10 min/day)',
        description: 'Practice word pairs: ship/sheep, bat/bet, sit/set, cap/cup. Focus on hearing and producing the difference.',
        difficulty: 'medium'
      });
    }

    if (scores.fluency !== undefined && scores.fluency < 60) {
      exercises.push({
        title: 'Read Aloud Daily (15 min)',
        description: 'Read newspaper articles or book passages aloud. Time yourself and aim to read smoothly without stopping.',
        difficulty: 'easy'
      });
      exercises.push({
        title: 'Shadowing Exercise (10 min)',
        description: 'Play a TED talk or news clip. Speak along with the speaker simultaneously. This builds natural pacing and rhythm.',
        difficulty: 'medium'
      });
    }

    if (toneResults && toneResults.hasPitchData && toneResults.intonationScore < 60) {
      exercises.push({
        title: 'Intonation Drill (5 min)',
        description: 'Read statements with falling intonation and questions with rising intonation. Exaggerate at first, then normalize.',
        difficulty: 'easy'
      });
      exercises.push({
        title: 'Stress Pattern Practice (10 min)',
        description: 'Practice sentence stress: "I didn\'t say HE stole the money" vs "I didn\'t say he STOLE the money." Different stress = different meaning.',
        difficulty: 'medium'
      });
    }

    if (scores.content !== undefined && scores.content < 60) {
      exercises.push({
        title: 'Active Listening Practice (15 min)',
        description: 'Listen to 1-minute audio clips. Immediately write down key words. Compare with transcript. Repeat daily.',
        difficulty: 'medium'
      });
      exercises.push({
        title: 'Keyword Spotting Drill',
        description: 'While reading a paragraph, identify the 5-7 most important words. Practice reproducing them from memory.',
        difficulty: 'easy'
      });
    }

    return exercises;
  },

  _getModelAnswer(type, expected, keywords) {
    if (!expected && !keywords) return null;

    switch (type) {
      case 'read-aloud':
        return {
          label: 'Target Text',
          text: expected || '',
          note: 'Your goal is to read this text exactly as written, with clear pronunciation and natural intonation.'
        };
      case 'repeat-sentence':
        return {
          label: 'Target Sentence',
          text: expected || '',
          note: 'You should repeat this sentence as closely as possible. Even a partial repeat scores points.'
        };
      case 'describe-image':
        return {
          label: 'Suggested Structure',
          text: `"This [chart type] shows [topic]. The most notable feature is [highest/main trend]. [Second observation with data]. [Third observation]. Overall, [summary/conclusion]."`,
          note: 'Aim to cover: type, topic, main trend, 2-3 specific data points, conclusion.'
        };
      case 'retell-lecture':
        return {
          label: 'Key Points to Cover',
          text: keywords ? keywords.slice(0, 10).join(', ') : '',
          note: 'Try to include these key terms in your retelling. Structure: topic → main idea → details → conclusion.'
        };
      case 'answer-short-question':
        return null; // Don't reveal answer before attempt
      default:
        return keywords ? {
          label: 'Key Terms',
          text: keywords.slice(0, 12).join(', '),
          note: 'Try to incorporate these key terms in your response.'
        } : null;
    }
  },

  _generateSummary(scores, type, toneResults) {
    const overallScore = PTE.Scoring.calculateOverall(scores, type);
    const band = PTE.Scoring.getBand(overallScore);

    let summary = `Your overall performance is at the "${band.label}" level (${overallScore}/90). `;

    const best = Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a), ['', 0]);
    const worst = Object.entries(scores).reduce((a, b) => (b[1] < a[1] ? b : a), ['', 90]);

    if (best[0] && worst[0] && best[0] !== worst[0]) {
      summary += `Your strongest area is ${best[0]} (${best[1]}/90), while ${worst[0]} (${worst[1]}/90) needs the most attention. `;
    }

    if (toneResults && toneResults.hasPitchData) {
      if (toneResults.intonationScore >= 60) {
        summary += 'Your vocal delivery is expressive and engaging. ';
      } else {
        summary += 'Work on making your speech more expressive with varied pitch and intonation. ';
      }
    }

    if (overallScore >= 65) {
      summary += 'Keep up the great work and focus on maintaining consistency.';
    } else if (overallScore >= 45) {
      summary += 'You\'re making progress. Focus on the improvement areas identified below.';
    } else {
      summary += 'Regular daily practice will help you improve significantly. Follow the exercises below.';
    }

    return summary;
  },

  _explainScores(scores, type) {
    const parts = [];
    if (scores.content !== undefined) {
      parts.push(`Content (${scores.content}/90): Measures how much of the expected information you included — key words, phrases, and ideas.`);
    }
    if (scores.pronunciation !== undefined) {
      parts.push(`Pronunciation (${scores.pronunciation}/90): Based on how accurately the speech recognition system captured your words. Higher recognition = clearer pronunciation.`);
    }
    if (scores.fluency !== undefined) {
      parts.push(`Fluency (${scores.fluency}/90): Evaluates your speaking pace, continuity, and smoothness. Natural rhythm without long pauses scores highest.`);
    }
    if (scores.vocabulary !== undefined) {
      parts.push(`Vocabulary (${scores.vocabulary}/90): Whether you provided the correct answer word(s).`);
    }
    return parts.join('\n');
  }
};
