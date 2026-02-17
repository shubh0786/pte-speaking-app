/**
 * PTE Speaking Module - Voice Accent System
 * Provides different English accents for practice with authentic pronunciation
 * Builds on top of the existing TTS system with accent-specific voice selection
 */

window.PTE = window.PTE || {};

PTE.Accents = {
  // ── Available Accents ────────────────────────────────────────────────────

  ACCENTS: {
    american: {
      id: 'american',
      name: 'American English',
      flag: '🇺🇸',
      region: 'North America',
      description: 'General American accent with neutral pronunciation',
      voicePriority: [
        'Google US English',
        'Microsoft Zira Desktop',
        'Microsoft David Desktop',
        'en-US'
      ],
      characteristics: {
        rate: 0.95,
        pitch: 1.0,
        pronunciationTips: [
          'Use "r" sounds in words like "car", "bird", "water"',
          'Pronounce "t" as "d" in words like "butter", "better"',
          'Short "a" sound in "cat", "man", "hat"'
        ]
      }
    },

    british: {
      id: 'british',
      name: 'British English (RP)',
      flag: '🇬🇧',
      region: 'United Kingdom',
      description: 'Received Pronunciation - formal British accent',
      voicePriority: [
        'Google UK English Female',
        'Google UK English Male',
        'Microsoft Hazel Desktop',
        'Microsoft George Desktop',
        'en-GB'
      ],
      characteristics: {
        rate: 0.9,
        pitch: 1.1,
        pronunciationTips: [
          'Silent "r" in words like "car", "bird", "water"',
          'Long "a" sound in "bath", "dance", "plant"',
          'Use "t" clearly in words like "butter", "better"',
          'Different vowel sounds: "cloth" vs "lot"'
        ]
      }
    },

    australian: {
      id: 'australian',
      name: 'Australian English',
      flag: '🇦🇺',
      region: 'Australia',
      description: 'Australian accent with unique vowel sounds',
      voicePriority: [
        'Microsoft Catherine',
        'Google Australian English',
        'en-AU'
      ],
      characteristics: {
        rate: 1.0,
        pitch: 1.05,
        pronunciationTips: [
          'Broad "a" sound in "dance", "chance", "plant"',
          'Distinctive vowel sounds: "no" sounds like "nigh"',
          'Use "r" in words ending with "r" like "car", "far"',
          'Rising intonation at end of statements'
        ]
      }
    },

    indian: {
      id: 'indian',
      name: 'Indian English',
      flag: '🇮🇳',
      region: 'India',
      description: 'Indian accent common in PTE exam centers',
      voicePriority: [
        'Google हिन्दी',  // Hindi voices are often used for Indian English
        'Microsoft Ravi Desktop',
        'Microsoft Heera Desktop',
        'en-IN'
      ],
      characteristics: {
        rate: 0.85,
        pitch: 1.0,
        pronunciationTips: [
          'Pronounce all consonants clearly',
          'Use "v" instead of "w" in words like "very", "vine"',
          'Longer vowel sounds in stressed syllables',
          'Different "th" pronunciation (dental vs interdental)',
          'Rhythm may be syllable-timed rather than stress-timed'
        ]
      }
    },

    canadian: {
      id: 'canadian',
      name: 'Canadian English',
      flag: '🇨🇦',
      region: 'Canada',
      description: 'Canadian accent with some British and American influences',
      voicePriority: [
        'Microsoft Linda',
        'Microsoft Richard',
        'en-CA'
      ],
      characteristics: {
        rate: 0.95,
        pitch: 1.02,
        pronunciationTips: [
          'Similar to American but with some British influences',
          'Use "eh" question tag at end of statements',
          'Pronounce "about" as "aboot"',
          'Different vowel sounds in "out", "house"'
        ]
      }
    }
  },

  // ── Current Settings ─────────────────────────────────────────────────────

  currentAccent: 'american',
  availableVoices: [],

  // ── Initialization ───────────────────────────────────────────────────────

  init() {
    this.currentAccent = this.getStoredAccent() || 'american';
    this._loadAvailableVoices();
    console.log('[Accents] Initialized with accent:', this.currentAccent);
  },

  _loadAvailableVoices() {
    if (!PTE.TTS || !PTE.TTS.synth) return;

    const voices = PTE.TTS.synth.getVoices();
    this.availableVoices = voices;

    // Log available voices for debugging
    console.log('[Accents] Available voices:', voices.map(v => `${v.name} (${v.lang})`));
  },

  // ── Accent Management ────────────────────────────────────────────────────

  getStoredAccent() {
    try {
      return localStorage.getItem('pte_accent_preference') || 'american';
    } catch (e) {
      return 'american';
    }
  },

  setAccent(accentId) {
    if (!this.ACCENTS[accentId]) {
      console.warn('[Accents] Invalid accent ID:', accentId);
      return false;
    }

    this.currentAccent = accentId;

    try {
      localStorage.setItem('pte_accent_preference', accentId);
    } catch (e) {
      console.warn('[Accents] Failed to save accent preference');
    }

    // Update TTS voice for new accent
    this._selectVoiceForAccent(accentId);

    console.log('[Accents] Changed to accent:', accentId);
    return true;
  },

  getCurrentAccent() {
    return this.ACCENTS[this.currentAccent] || this.ACCENTS.american;
  },

  getAllAccents() {
    return Object.values(this.ACCENTS);
  },

  // ── Voice Selection Logic ────────────────────────────────────────────────

  _selectVoiceForAccent(accentId) {
    if (!PTE.TTS || !PTE.TTS.synth) return;

    const accent = this.ACCENTS[accentId];
    if (!accent) return;

    const voices = this.availableVoices;
    let selectedVoice = null;

    // Try each voice in priority order
    for (const voiceName of accent.voicePriority) {
      selectedVoice = voices.find(v =>
        v.name.includes(voiceName) ||
        v.lang.includes(voiceName) ||
        (voiceName === 'en-US' && v.lang === 'en-US') ||
        (voiceName === 'en-GB' && v.lang === 'en-GB') ||
        (voiceName === 'en-AU' && v.lang === 'en-AU') ||
        (voiceName === 'en-IN' && v.lang === 'en-IN') ||
        (voiceName === 'en-CA' && v.lang === 'en-CA')
      );
      if (selectedVoice) break;
    }

    // Fallback: any voice matching the accent's language
    if (!selectedVoice) {
      const accentLangMap = {
        american: 'en-US',
        british: 'en-GB',
        australian: 'en-AU',
        indian: 'en-IN',
        canadian: 'en-CA'
      };

      const targetLang = accentLangMap[accentId];
      selectedVoice = voices.find(v => v.lang === targetLang);
    }

    // Final fallback: any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('en'));
    }

    // Apply the voice and characteristics
    if (selectedVoice) {
      PTE.TTS.voice = selectedVoice;
      console.log(`[Accents] Selected voice for ${accentId}:`, selectedVoice.name, `(${selectedVoice.lang})`);
    } else {
      console.warn(`[Accents] No suitable voice found for accent: ${accentId}`);
    }
  },

  // ── Enhanced TTS Methods ─────────────────────────────────────────────────

  speakWithAccent(text, options = {}) {
    const accent = this.getCurrentAccent();
    const rate = options.rate || accent.characteristics.rate;
    const pitch = options.pitch || accent.characteristics.pitch;

    // Store original TTS settings
    const originalVoice = PTE.TTS.voice;
    const originalRate = PTE.TTS.rate;
    const originalPitch = PTE.TTS.pitch;

    // Apply accent-specific settings
    this._selectVoiceForAccent(this.currentAccent);

    // Override utterance properties for this accent
    const originalSpeakChunk = PTE.TTS._speakChunk;
    PTE.TTS._speakChunk = function(text, rate) {
      return new Promise((resolve) => {
        if (!text || text.trim().length === 0) { resolve(); return; }

        const utterance = new SpeechSynthesisUtterance(text);
        if (PTE.TTS.voice) utterance.voice = PTE.TTS.voice;
        utterance.rate = rate;
        utterance.pitch = pitch;  // Apply accent pitch
        utterance.volume = 1;
        utterance.lang = PTE.TTS.voice ? PTE.TTS.voice.lang : 'en-US';

        utterance.onend = () => resolve();
        utterance.onerror = (e) => {
          console.warn('[TTS] Accent utterance error:', e);
          resolve();
        };

        PTE.TTS.synth.speak(utterance);
      });
    };

    // Speak with accent
    return PTE.TTS.speak(text, rate).finally(() => {
      // Restore original method
      PTE.TTS._speakChunk = originalSpeakChunk;
    });
  },

  // ── UI Integration ───────────────────────────────────────────────────────

  renderAccentSelector(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const accents = this.getAllAccents();
    const currentAccent = this.getCurrentAccent();

    container.innerHTML = `
      <div class="accent-selector">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${accents.map(accent => `
            <div class="accent-card glass rounded-xl p-4 cursor-pointer transition-all hover:border-indigo-500/30 ${
              accent.id === this.currentAccent ? 'border-indigo-500/50 bg-indigo-500/10 ring-2 ring-indigo-500/20' : 'border-white/10'
            }"
                 onclick="PTE.Accents.selectAccent('${accent.id}')">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl">${accent.flag}</span>
                <div class="flex-1">
                  <h4 class="font-semibold text-white">${accent.name}</h4>
                  <p class="text-xs text-gray-400">${accent.region}</p>
                </div>
                ${accent.id === this.currentAccent ? '<span class="text-indigo-400">✓</span>' : ''}
              </div>
              <p class="text-sm text-gray-300 mb-3">${accent.description}</p>
              <div class="text-xs text-indigo-400 mb-3">
                <strong>Pronunciation tips:</strong>
                <ul class="mt-1 space-y-1">
                  ${accent.characteristics.pronunciationTips.slice(0, 2).map(tip => `<li>• ${tip}</li>`).join('')}
                </ul>
              </div>
              <button onclick="event.stopPropagation(); PTE.Accents.testAccent('${accent.id}')"
                      class="w-full mt-2 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs rounded-lg transition-colors">
                🎵 Test Voice
              </button>
            </div>
          `).join('')}
        </div>
        <div class="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p class="text-sm text-amber-300">
            💡 <strong>Pro tip:</strong> Practice with different accents to improve your listening and speaking skills for various PTE exam centers worldwide.
          </p>
        </div>
      </div>
    `;
  },

  selectAccent(accentId) {
    this.setAccent(accentId);
    // Re-render the selector to show the new selection
    const container = document.querySelector('.accent-selector');
    if (container && container.parentElement) {
      const containerId = container.parentElement.id;
      if (containerId) {
        this.renderAccentSelector(containerId);
      }
    }
  },

  // ── Test Voice Function ──────────────────────────────────────────────────

  testAccent(accentId) {
    const accent = this.ACCENTS[accentId];
    if (!accent) return;

    const testText = `Hello! This is a sample of ${accent.name}. The PTE speaking test requires clear pronunciation and natural intonation. Practice makes perfect!`;

    this.speakWithAccent(testText);
  }
};

// Initialize accents when app loads
document.addEventListener('DOMContentLoaded', () => {
  if (PTE.Accents) {
    PTE.Accents.init();
  }
});