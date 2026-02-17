/**
 * PTE Speaking Module - Progress Store
 * Manages localStorage for progress tracking and statistics
 */

window.PTE = window.PTE || {};

PTE.Store = {
  STORAGE_KEY: 'pte_speaking_progress',

  getAll() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : { sessions: [], stats: {} };
    } catch (e) {
      return { sessions: [], stats: {} };
    }
  },

  save(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  },

  addSession(session) {
    const data = this.getAll();
    session.timestamp = Date.now();
    session.date = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
    data.sessions.unshift(session);

    // Keep only last 200 sessions
    if (data.sessions.length > 200) {
      data.sessions = data.sessions.slice(0, 200);
    }

    // Update stats
    this.updateStats(data);
    this.save(data);
  },

  updateStats(data) {
    const stats = {};
    const types = Object.values(PTE.QUESTION_TYPES);

    types.forEach(type => {
      const typeSessions = data.sessions.filter(s => s.type === type.id);
      if (typeSessions.length > 0) {
        const scores = typeSessions.map(s => s.overallScore);
        stats[type.id] = {
          totalAttempts: typeSessions.length,
          averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
          bestScore: Math.max(...scores),
          recentScores: scores.slice(0, 10),
          lastAttempt: typeSessions[0].date
        };
      }
    });

    // Overall stats
    if (data.sessions.length > 0) {
      const allScores = data.sessions.map(s => s.overallScore);
      stats.overall = {
        totalAttempts: data.sessions.length,
        averageScore: Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length),
        bestScore: Math.max(...allScores),
        totalPracticeTime: data.sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
        streak: this.calculateStreak(data.sessions)
      };
    }

    data.stats = stats;
  },

  calculateStreak(sessions) {
    if (sessions.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dates = [...new Set(sessions.map(s => {
      const d = new Date(s.timestamp);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }))].sort((a, b) => b - a);

    let streak = 0;
    let checkDate = today.getTime();
    const oneDay = 86400000;

    for (const date of dates) {
      if (date === checkDate || date === checkDate - oneDay) {
        streak++;
        checkDate = date;
      } else {
        break;
      }
    }

    return streak;
  },

  getStats() {
    return this.getAll().stats;
  },

  getSessionsByType(typeId) {
    return this.getAll().sessions.filter(s => s.type === typeId);
  },

  getRecentSessions(limit = 20) {
    return this.getAll().sessions.slice(0, limit);
  },

  /**
   * Get all sessions for a specific question by its ID.
   * Returns array sorted by most recent first.
   */
  getSessionsByQuestion(questionId) {
    return this.getAll().sessions.filter(s => s.questionId === questionId);
  },

  /**
   * Get the best (highest score) session for a specific question.
   * Returns null if never attempted.
   */
  getBestSession(questionId) {
    const sessions = this.getSessionsByQuestion(questionId);
    if (sessions.length === 0) return null;
    return sessions.reduce((best, s) => s.overallScore > best.overallScore ? s : best);
  },

  /**
   * Get the most recent session for a specific question.
   * Returns null if never attempted.
   */
  getLatestSession(questionId) {
    const sessions = this.getSessionsByQuestion(questionId);
    return sessions.length > 0 ? sessions[0] : null;
  },

  /**
   * Build a map of questionId → { attempts, bestScore, latestScore, latestSession }
   * for all questions of a given type. Useful for showing completion status.
   */
  getCompletionMap(typeId) {
    const sessions = this.getSessionsByType(typeId);
    const map = {};
    for (const s of sessions) {
      if (!s.questionId) continue;
      if (!map[s.questionId]) {
        map[s.questionId] = {
          attempts: 0,
          bestScore: 0,
          latestScore: 0,
          latestSession: null
        };
      }
      const entry = map[s.questionId];
      entry.attempts++;
      if (s.overallScore > entry.bestScore) entry.bestScore = s.overallScore;
      // First occurrence is the latest (sessions are sorted newest-first)
      if (!entry.latestSession) {
        entry.latestScore = s.overallScore;
        entry.latestSession = s;
      }
    }
    return map;
  },

  /**
   * Get weak questions for the Mistake Notebook.
   * Groups by questionId and keeps latest + best attempt metadata.
   */
  getMistakeQuestions(threshold = 55, limit = 50) {
    const sessions = this.getAll().sessions || [];
    const grouped = {};

    for (const s of sessions) {
      if (!s || !s.questionId || !s.type) continue;
      if (s.type === 'mock-test') continue;
      if (typeof s.overallScore !== 'number') continue;
      if (s.overallScore >= threshold) continue;

      const key = `${s.type}::${s.questionId}`;
      if (!grouped[key]) {
        grouped[key] = {
          type: s.type,
          questionId: s.questionId,
          attempts: 0,
          bestScore: 0,
          latestScore: s.overallScore,
          latestDate: s.date || '',
          latestTimestamp: s.timestamp || 0,
          latestTranscript: s.transcript || ''
        };
      }

      const item = grouped[key];
      item.attempts++;
      if (s.overallScore > item.bestScore) item.bestScore = s.overallScore;
      if ((s.timestamp || 0) > item.latestTimestamp) {
        item.latestScore = s.overallScore;
        item.latestDate = s.date || '';
        item.latestTimestamp = s.timestamp || 0;
        item.latestTranscript = s.transcript || '';
      }
    }

    return Object.values(grouped)
      .sort((a, b) => {
        if (a.latestScore !== b.latestScore) return a.latestScore - b.latestScore;
        return b.latestTimestamp - a.latestTimestamp;
      })
      .slice(0, Math.max(1, limit));
  },

  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
};
