/**
 * Crack PTE - Accent Detection & Pronunciation Coach
 * Identifies accent patterns from speech recognition mismatches,
 * tracks problem sounds per user, and provides targeted coaching.
 */
window.PTE = window.PTE || {};

PTE.AccentAnalyzer = {
  STORAGE_KEY: 'crackpte_accent',

  // ══════════════════════════════════════════════════
  // ACCENT PATTERN DATABASE
  // Maps each accent to its common sound substitutions.
  // Each pattern: { from, to, description, examples, tip }
  // ══════════════════════════════════════════════════

  ACCENTS: {
    indian: {
      name: 'Indian',
      flag: '🇮🇳',
      patterns: [
        { id:'th_t', from:/\bth/gi, to:['t','d'], sound:'th', desc:'"th" pronounced as "t" or "d"', examples:['think→tink','the→de','that→dat','three→tree','with→wit'], tip:'Place your tongue between your upper and lower teeth and blow air gently. Practice: the, this, that, think, three.' },
        { id:'v_w', from:/\bv/gi, to:['w'], sound:'v/w', desc:'"v" pronounced as "w"', examples:['very→wery','voice→woice','vine→wine','village→willage'], tip:'Bite your lower lip gently with upper teeth, then vibrate. Practice: very, voice, vine, value, van.' },
        { id:'w_v', from:/\bw/gi, to:['v'], sound:'w/v', desc:'"w" pronounced as "v"', examples:['water→vater','was→vas','work→vork','well→vell'], tip:'Round your lips into an "oo" shape without touching teeth. Practice: water, well, work, wait, win.' },
        { id:'z_j', from:/\bz/gi, to:['j','zh'], sound:'z', desc:'"z" sounds shifted', examples:['zero→jero','zone→jone'], tip:'Place tongue behind upper teeth and vibrate. Practice: zero, zone, zip, zoo.' },
        { id:'r_hard', from:/r/gi, to:['r','d'], sound:'r', desc:'Retroflex "r" (tongue curled back)', examples:['right→right(retroflex)','red→red(hard)'], tip:'Keep tongue relaxed in the middle of mouth, do not curl it back. Practice: red, run, rain, write.' },
        { id:'a_e', from:/[ae]/gi, to:['e','a'], sound:'a/e', desc:'Vowel "a" and "e" confusion', examples:['bad→bed','man→men','sat→set'], tip:'For "a" as in "cat", open your mouth wide. For "e" as in "bed", keep it half open. Practice pairs: bad/bed, man/men, sat/set.' },
        { id:'p_aspirated', from:/\bp/gi, to:['p','ph','b'], sound:'p', desc:'Over-aspirated "p"', examples:['park→phark','put→phut'], tip:'Release "p" with a light puff of air, not a heavy burst. Practice: park, put, pen, pull.' },
      ]
    },
    chinese: {
      name: 'Chinese (Mandarin)',
      flag: '🇨🇳',
      patterns: [
        { id:'r_l', from:/\br/gi, to:['l'], sound:'r/l', desc:'"r" pronounced as "l"', examples:['right→light','rain→lain','read→lead','rice→lice'], tip:'Curl your tongue tip back slightly without touching the roof. The tongue should NOT touch anything. Practice: right, run, red, rain.' },
        { id:'l_r', from:/\bl/gi, to:['r','n'], sound:'l/r', desc:'"l" pronounced as "r"', examples:['light→right','long→rong','lead→read'], tip:'Press your tongue tip firmly against the ridge behind upper teeth. Practice: light, long, lead, late, low.' },
        { id:'th_s', from:/\bth/gi, to:['s','z','f'], sound:'th', desc:'"th" pronounced as "s" or "z"', examples:['think→sink','the→ze','three→sree','them→zem'], tip:'Put your tongue between your teeth — it must be visible. Blow air over the tongue. Practice: think, the, this, three.' },
        { id:'final_drop', from:/[bdgkpt]$/gi, to:[''], sound:'final consonant', desc:'Final consonants dropped or swallowed', examples:['good→goo','bad→ba','big→bi','stop→sto'], tip:'Exaggerate the final sound. Hold it for a moment. Practice: good, bad, big, stop, kept, build.' },
        { id:'ing_in', from:/ing\b/gi, to:['in','een'], sound:'-ing', desc:'"-ing" pronounced as "-in"', examples:['running→runnin','going→goin','speaking→speakin'], tip:'Hold the back of your tongue against the soft palate for the "ng" sound. Practice: running, going, speaking, thinking.' },
        { id:'v_w2', from:/\bv/gi, to:['w'], sound:'v', desc:'"v" pronounced as "w"', examples:['very→wery','voice→woice','value→walue'], tip:'Bite your lower lip lightly and vibrate your vocal cords. Practice: very, voice, value, view, van.' },
        { id:'n_l', from:/\bn/gi, to:['l'], sound:'n/l', desc:'"n" and "l" confusion', examples:['night→light','nine→line','no→lo'], tip:'For "n", press tongue to ridge and let air flow through nose. For "l", let air flow around tongue sides. Practice: night/light, nine/line.' },
      ]
    },
    korean: {
      name: 'Korean',
      flag: '🇰🇷',
      patterns: [
        { id:'r_l_kr', from:/[rl]/gi, to:['l','r'], sound:'r/l', desc:'"r" and "l" interchanged', examples:['right→light','light→right','real→leal','lead→read'], tip:'For "r": tongue floats in the middle, curled slightly. For "l": tongue presses the ridge behind teeth. Practice pairs: right/light, read/lead.' },
        { id:'f_p', from:/\bf/gi, to:['p','h'], sound:'f', desc:'"f" pronounced as "p"', examples:['food→pood','fine→pine','fish→pish','fun→pun'], tip:'Bite your lower lip with upper teeth and blow. Do NOT close both lips (that makes "p"). Practice: food, fine, fish, fun, five.' },
        { id:'v_b', from:/\bv/gi, to:['b'], sound:'v', desc:'"v" pronounced as "b"', examples:['very→berry','voice→boice','van→ban','value→balue'], tip:'Use lower lip + upper teeth (not both lips). Vibrate your voice. Practice: very, voice, van, vine.' },
        { id:'z_j2', from:/\bz/gi, to:['j','ch'], sound:'z', desc:'"z" pronounced as "j"', examples:['zero→jero','zoo→joo','zone→jone'], tip:'Keep tongue behind upper teeth and add voice vibration. Practice: zero, zoo, zone, zip.' },
        { id:'th_d_kr', from:/\bth/gi, to:['d','s'], sound:'th', desc:'"th" pronounced as "d" or "s"', examples:['the→de','think→sink','this→dis'], tip:'Place tongue between teeth for "th". Practice: the, this, think, that, there.' },
        { id:'p_b', from:/\bp/gi, to:['b'], sound:'p/b', desc:'"p" and "b" confusion', examples:['park→bark','pull→bull','pen→ben'], tip:'For "p": release a puff of air from closed lips (voiceless). For "b": vibrate vocal cords (voiced). Practice pairs: park/bark, pen/ben.' },
      ]
    },
    japanese: {
      name: 'Japanese',
      flag: '🇯🇵',
      patterns: [
        { id:'r_l_jp', from:/[rl]/gi, to:['l','r'], sound:'r/l', desc:'"r" and "l" merged into a single flap sound', examples:['right→light','lead→read','really→leally','roll→loll'], tip:'English "r": tongue floats, curled back slightly. English "l": tongue tip touches ridge firmly. These are very different — practice minimal pairs: right/light, read/lead.' },
        { id:'th_s_jp', from:/\bth/gi, to:['s','z'], sound:'th', desc:'"th" pronounced as "s" or "z"', examples:['think→sink','the→ze','three→sree'], tip:'Your tongue MUST go between your teeth for "th". Practice: think, the, this, three, that.' },
        { id:'si_shi', from:/si/gi, to:['shi','shee'], sound:'si/shi', desc:'"si" pronounced as "shi"', examples:['six→shix','sit→shit','simple→shimple'], tip:'For "s", keep your tongue behind teeth with a narrow gap. Do NOT let it become "sh". Practice: sit, six, simple, sister.' },
        { id:'hu_fu', from:/\bhu/gi, to:['fu'], sound:'hu/fu', desc:'"hu" pronounced as "fu"', examples:['human→fuman','huge→fuge','humor→fumor'], tip:'For "h", mouth is open and relaxed. For "f", lip touches teeth. Practice: human, huge, humor, who.' },
        { id:'vowel_insert', from:/[bcdfgkpst][rl]/gi, to:[], sound:'clusters', desc:'Vowel inserted in consonant clusters', examples:['string→sturing','play→pulay','dream→duream'], tip:'Blend consonants smoothly without adding vowels between them. Practice slowly: string, play, dream, class, spring.' },
        { id:'final_u', from:/[tdkgp]$/gi, to:[], sound:'final sounds', desc:'Extra "u" or "o" added after final consonants', examples:['good→goodo','cat→cato','stop→stopu'], tip:'Stop the airflow sharply at the end. Do NOT add a vowel. Practice: good, cat, stop, kept, big.' },
      ]
    },
    vietnamese: {
      name: 'Vietnamese',
      flag: '🇻🇳',
      patterns: [
        { id:'final_drop_vn', from:/[bdgkpts]$/gi, to:[''], sound:'final consonant', desc:'Final consonants dropped', examples:['good→goo','bad→ba','stop→sto','big→bi','kept→kep'], tip:'Hold the final consonant — exaggerate it at first. Practice: good, bad, stop, kept, build, watched.' },
        { id:'th_t_vn', from:/\bth/gi, to:['t','d','z'], sound:'th', desc:'"th" pronounced as "t" or "d"', examples:['think→tink','the→de','there→dere'], tip:'Place tongue between teeth for "th". Practice daily: the, this, think, that, there, those.' },
        { id:'r_z_vn', from:/\br/gi, to:['z','y'], sound:'r', desc:'"r" pronounced as "z" or "y"', examples:['right→zight','red→zed','run→zun'], tip:'Curl tongue back slightly, keep it floating. Practice: right, red, run, rain, real.' },
        { id:'s_sh_vn', from:/\bsh/gi, to:['s'], sound:'sh/s', desc:'"sh" and "s" confusion', examples:['she→se','ship→sip','show→so','shop→sop'], tip:'For "sh", round your lips and push them forward. For "s", spread lips. Practice pairs: she/see, ship/sip, show/so.' },
        { id:'ch_tr_vn', from:/\bch/gi, to:['tr','j'], sound:'ch', desc:'"ch" and "tr" confusion', examples:['church→trurch','chair→trair','child→trild'], tip:'For "ch": tongue tip presses behind upper teeth, release quickly. Practice: church, chair, child, change, cheap.' },
        { id:'clusters_vn', from:/[bcdfgkpst][rl]/gi, to:[], sound:'clusters', desc:'Consonant clusters simplified', examples:['string→sting','spring→sping','three→tree'], tip:'Practice blending: string, spring, three, strong, class, plan.' },
      ]
    },
    arabic: {
      name: 'Arabic',
      flag: '🇸🇦',
      patterns: [
        { id:'p_b_ar', from:/\bp/gi, to:['b'], sound:'p/b', desc:'"p" pronounced as "b"', examples:['park→bark','pen→ben','people→beople','put→but'], tip:'For "p": close both lips, release with a puff of air but NO voice vibration. For "b": same position but vibrate. Practice: park, pen, people, pull, paper.' },
        { id:'v_f_ar', from:/\bv/gi, to:['f'], sound:'v/f', desc:'"v" pronounced as "f"', examples:['very→ferry','voice→foice','van→fan','value→falue'], tip:'For "v": lower lip + upper teeth with vibration. For "f": same position, no vibration. Practice: very, voice, van, vine.' },
        { id:'th_ar', from:/\bth/gi, to:['z','s','d'], sound:'th', desc:'"th" confusion with similar Arabic sounds', examples:['think→zink','the→ze','three→sree'], tip:'English "th" is different from Arabic ث/ذ. Tongue must go between teeth. Practice: think, the, this, three.' },
        { id:'e_i_ar', from:/[ei]/gi, to:['i','e'], sound:'e/i', desc:'Short vowels "e" and "i" confused', examples:['bed→bid','set→sit','pen→pin','men→min'], tip:'For "e" as in "bed": mouth half-open, relaxed. For "i" as in "bit": mouth slightly more closed. Practice pairs: bed/bid, set/sit, pen/pin.' },
        { id:'ng_ar', from:/ng\b/gi, to:['n','nk'], sound:'ng', desc:'The "ng" sound not produced correctly', examples:['sing→sin','ring→rin','thing→thin','going→goin'], tip:'Press the back of your tongue against your soft palate. The air goes through your nose. Practice: sing, ring, thing, going, running.' },
        { id:'vowel_length', from:/[aeiou]{2}/gi, to:[], sound:'vowels', desc:'Vowel length confusion (short vs long)', examples:['ship→sheep','bit→beat','full→fool','pull→pool'], tip:'English has distinct short and long vowels. Practice pairs: ship/sheep, bit/beat, full/fool, pull/pool, hit/heat.' },
      ]
    }
  },

  // ══════════════════════════════════════════════════
  // COMMON PROBLEM WORDS (known PTE mark-losers)
  // Words that frequently cause accent-based recognition errors
  // ══════════════════════════════════════════════════

  PROBLEM_WORDS: {
    'th': ['the','this','that','these','those','there','their','they','think','through','three','thought','theory','therefore','thousand','thus','though','throughout','third','threat','theme','thesis','therapy','thermal','thick','thin','thrive','throne','throw','thunder'],
    'r/l': ['right','light','really','long','rain','lead','read','write','learn','real','rural','parallel','regularly','literally','rarely','rivalry','relatively','correlation'],
    'v/w': ['very','voice','value','various','view','vine','wine','work','water','well','wave','village','van','version','volume','vast','vital','vulnerable','vivid'],
    'final': ['good','bad','big','stop','kept','built','helped','walked','talked','watched','reached','asked','finished','developed','produced','increased','advanced'],
    'clusters': ['strength','string','spring','three','through','straight','stream','strategy','structure','strictly','stretch','struggle','strange','strong','strict'],
  },

  // ══════════════════════════════════════════════════
  // MINIMAL PAIR DRILLS
  // ══════════════════════════════════════════════════

  DRILLS: {
    'th': [
      { word1:'think', word2:'tink', correct:'think', sound:'th vs t' },
      { word1:'three', word2:'tree', correct:'three', sound:'th vs t' },
      { word1:'the', word2:'de', correct:'the', sound:'th vs d' },
      { word1:'bath', word2:'bat', correct:'bath', sound:'th vs t' },
      { word1:'with', word2:'wit', correct:'with', sound:'th vs t' },
      { word1:'math', word2:'mat', correct:'math', sound:'th vs t' },
      { word1:'mouth', word2:'mout', correct:'mouth', sound:'th vs t' },
    ],
    'r/l': [
      { word1:'right', word2:'light', correct:'both', sound:'r vs l' },
      { word1:'read', word2:'lead', correct:'both', sound:'r vs l' },
      { word1:'rain', word2:'lane', correct:'both', sound:'r vs l' },
      { word1:'rock', word2:'lock', correct:'both', sound:'r vs l' },
      { word1:'row', word2:'low', correct:'both', sound:'r vs l' },
      { word1:'rip', word2:'lip', correct:'both', sound:'r vs l' },
    ],
    'v/w': [
      { word1:'vine', word2:'wine', correct:'both', sound:'v vs w' },
      { word1:'very', word2:'wary', correct:'both', sound:'v vs w' },
      { word1:'van', word2:'wan', correct:'both', sound:'v vs w' },
      { word1:'vet', word2:'wet', correct:'both', sound:'v vs w' },
      { word1:'vest', word2:'west', correct:'both', sound:'v vs w' },
    ],
    'p/b': [
      { word1:'park', word2:'bark', correct:'both', sound:'p vs b' },
      { word1:'pen', word2:'ben', correct:'both', sound:'p vs b' },
      { word1:'pull', word2:'bull', correct:'both', sound:'p vs b' },
      { word1:'pie', word2:'buy', correct:'both', sound:'p vs b' },
      { word1:'pat', word2:'bat', correct:'both', sound:'p vs b' },
    ],
    'f/p': [
      { word1:'food', word2:'pood', correct:'food', sound:'f vs p' },
      { word1:'fine', word2:'pine', correct:'both', sound:'f vs p' },
      { word1:'fan', word2:'pan', correct:'both', sound:'f vs p' },
      { word1:'feel', word2:'peel', correct:'both', sound:'f vs p' },
    ],
    'v/f': [
      { word1:'vine', word2:'fine', correct:'both', sound:'v vs f' },
      { word1:'van', word2:'fan', correct:'both', sound:'v vs f' },
      { word1:'very', word2:'ferry', correct:'both', sound:'v vs f' },
    ],
    'final consonant': [
      { word1:'good', word2:'goo', correct:'good', sound:'final d' },
      { word1:'bad', word2:'ba', correct:'bad', sound:'final d' },
      { word1:'stop', word2:'sto', correct:'stop', sound:'final p' },
      { word1:'kept', word2:'kep', correct:'kept', sound:'final t' },
      { word1:'big', word2:'bi', correct:'big', sound:'final g' },
    ],
    '-ing': [
      { word1:'running', word2:'runnin', correct:'running', sound:'ng vs n' },
      { word1:'going', word2:'goin', correct:'going', sound:'ng vs n' },
      { word1:'speaking', word2:'speakin', correct:'speaking', sound:'ng vs n' },
    ],
  },

  // ══════════════════════════════════════════════════
  // ANALYSIS ENGINE
  // ══════════════════════════════════════════════════

  /**
   * Main analysis: compare expected vs recognized, detect accent patterns.
   * Returns { detectedAccent, accentScores, problemWords, problemSounds, tips }
   */
  analyze(expected, recognized) {
    if (!expected || !recognized) return null;

    const expWords = expected.toLowerCase().replace(/[^\w\s'-]/g, '').split(/\s+/).filter(w => w);
    const recWords = recognized.toLowerCase().replace(/[^\w\s'-]/g, '').split(/\s+/).filter(w => w);

    if (expWords.length === 0) return null;

    // Find mismatched words (expected but not recognized, or recognized differently)
    const recSet = new Set(recWords);
    const expSet = new Set(expWords);
    const missed = expWords.filter(w => !recSet.has(w));
    const extra = recWords.filter(w => !expSet.has(w));

    if (missed.length === 0) {
      // Perfect match — no accent issues detected this time
      return { detectedAccent: null, accentScores: {}, problemWords: [], problemSounds: [], tips: [], perfect: true };
    }

    // For each missed word, try to find the closest match in 'extra' (what was heard instead)
    const substitutions = this._findSubstitutions(missed, extra);

    // Score each accent based on how many patterns match
    const accentScores = {};
    const allMatches = []; // { accentId, patternId, sound, expected, heard, desc, tip }

    for (const [accentId, accent] of Object.entries(this.ACCENTS)) {
      let score = 0;
      for (const sub of substitutions) {
        for (const pattern of accent.patterns) {
          if (this._matchesPattern(sub.expected, sub.heard, pattern)) {
            score++;
            allMatches.push({
              accentId,
              patternId: pattern.id,
              sound: pattern.sound,
              expected: sub.expected,
              heard: sub.heard,
              desc: pattern.desc,
              tip: pattern.tip,
              examples: pattern.examples,
            });
          }
        }
      }
      // Also check missed words against problem patterns even without a clear substitution
      for (const word of missed) {
        for (const pattern of accent.patterns) {
          if (pattern.from.test(word)) {
            score += 0.3; // partial score for potential match
          }
          pattern.from.lastIndex = 0; // reset regex
        }
      }
      if (score > 0) accentScores[accentId] = Math.round(score * 10) / 10;
    }

    // Determine detected accent
    const sorted = Object.entries(accentScores).sort((a, b) => b[1] - a[1]);
    const detectedAccent = sorted.length > 0 ? sorted[0][0] : null;
    const totalScore = sorted.length > 0 ? sorted[0][1] : 0;

    // Compute confidence percentage (rough — based on matches vs missed words)
    const confidence = missed.length > 0 ? Math.min(95, Math.round((totalScore / missed.length) * 60 + 20)) : 0;

    // Unique problem sounds
    const soundFreq = {};
    allMatches.filter(m => m.accentId === detectedAccent).forEach(m => {
      soundFreq[m.sound] = (soundFreq[m.sound] || 0) + 1;
    });
    const problemSounds = Object.entries(soundFreq).sort((a, b) => b[1] - a[1]).map(([sound, count]) => ({ sound, count }));

    // Problem words with what was heard
    const problemWords = substitutions.map(s => {
      const match = allMatches.find(m => m.expected === s.expected && m.accentId === detectedAccent);
      return {
        expected: s.expected,
        heard: s.heard,
        sound: match ? match.sound : 'unknown',
        desc: match ? match.desc : 'Pronunciation mismatch',
        tip: match ? match.tip : 'Practice this word with native audio.'
      };
    });

    // Unique tips for the detected accent
    const tipSet = new Set();
    const tips = [];
    allMatches.filter(m => m.accentId === detectedAccent).forEach(m => {
      if (!tipSet.has(m.sound)) {
        tipSet.add(m.sound);
        tips.push({ sound: m.sound, tip: m.tip, examples: m.examples });
      }
    });

    // Save to history
    if (detectedAccent) {
      this._saveAnalysis({ detectedAccent, confidence, problemSounds, problemWords, timestamp: Date.now() });
    }

    return {
      detectedAccent,
      accentName: detectedAccent ? this.ACCENTS[detectedAccent].name : null,
      accentFlag: detectedAccent ? this.ACCENTS[detectedAccent].flag : null,
      confidence,
      accentScores,
      problemWords,
      problemSounds,
      tips,
      missed,
      perfect: false
    };
  },

  /**
   * Try to match missed words with extra words (substitutions).
   * Uses edit distance to find the closest match.
   */
  _findSubstitutions(missed, extra) {
    const subs = [];
    const usedExtra = new Set();

    for (const exp of missed) {
      let bestMatch = null;
      let bestDist = Infinity;

      for (const rec of extra) {
        if (usedExtra.has(rec)) continue;
        const dist = this._editDistance(exp, rec);
        // Only match if they're somewhat similar (distance < half the word length)
        if (dist < Math.max(exp.length, rec.length) * 0.6 && dist < bestDist) {
          bestDist = dist;
          bestMatch = rec;
        }
      }

      if (bestMatch) {
        subs.push({ expected: exp, heard: bestMatch, distance: bestDist });
        usedExtra.add(bestMatch);
      } else {
        // No close match — word was dropped entirely
        subs.push({ expected: exp, heard: '(dropped)', distance: exp.length });
      }
    }
    return subs;
  },

  /**
   * Check if a substitution (expected → heard) matches an accent pattern.
   */
  _matchesPattern(expected, heard, pattern) {
    if (heard === '(dropped)') {
      // Check if this is a final consonant drop pattern
      if (pattern.id.includes('final') || pattern.id.includes('drop')) {
        return pattern.from.test(expected);
      }
      pattern.from.lastIndex = 0;
      return false;
    }

    // Check if the expected word contains the pattern's "from" sound
    pattern.from.lastIndex = 0;
    if (!pattern.from.test(expected)) {
      pattern.from.lastIndex = 0;
      return false;
    }
    pattern.from.lastIndex = 0;

    // Check if the difference between expected and heard aligns with the pattern
    // Simple check: does the heard word differ in a way consistent with the substitution?
    for (const toSound of pattern.to) {
      if (toSound === '') {
        // Deletion pattern (e.g., final consonant dropped)
        if (heard.length < expected.length) return true;
      } else {
        // Substitution pattern: replace the "from" sound in expected with "to" and see if it matches heard
        pattern.from.lastIndex = 0;
        const modified = expected.replace(pattern.from, toSound);
        if (this._editDistance(modified, heard) <= 1) return true;
        // Also check if heard contains the "to" sound where expected has "from"
        if (heard.includes(toSound) && !expected.includes(toSound)) return true;
      }
    }
    return false;
  },

  /**
   * Levenshtein edit distance between two strings.
   */
  _editDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = b[i - 1] === a[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[b.length][a.length];
  },

  // ══════════════════════════════════════════════════
  // PERSISTENT STORAGE (per-user)
  // ══════════════════════════════════════════════════

  getData() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : { history: [], soundCounts: {}, totalAnalyses: 0 };
    } catch (e) { return { history: [], soundCounts: {}, totalAnalyses: 0 }; }
  },

  save(data) {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  },

  _saveAnalysis(result) {
    const data = this.getData();
    data.history.unshift(result);
    if (data.history.length > 100) data.history = data.history.slice(0, 100);
    data.totalAnalyses = (data.totalAnalyses || 0) + 1;

    // Aggregate sound counts
    if (!data.soundCounts) data.soundCounts = {};
    result.problemSounds.forEach(ps => {
      data.soundCounts[ps.sound] = (data.soundCounts[ps.sound] || 0) + ps.count;
    });

    // Track accent votes
    if (!data.accentVotes) data.accentVotes = {};
    if (result.detectedAccent) {
      data.accentVotes[result.detectedAccent] = (data.accentVotes[result.detectedAccent] || 0) + 1;
    }

    this.save(data);
  },

  /**
   * Get the user's overall accent profile from accumulated data.
   */
  getProfile() {
    const data = this.getData();
    if (!data.history || data.history.length === 0) return null;

    // Most voted accent
    const votes = data.accentVotes || {};
    const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
    const topAccent = sorted.length > 0 ? sorted[0][0] : null;
    const totalVotes = Object.values(votes).reduce((s, v) => s + v, 0);
    const topConfidence = topAccent && totalVotes > 0 ? Math.round((sorted[0][1] / totalVotes) * 100) : 0;

    // Top problem sounds
    const sounds = Object.entries(data.soundCounts || {}).sort((a, b) => b[1] - a[1]);

    // Recent problem words
    const recentWords = [];
    const seenWords = new Set();
    for (const h of data.history.slice(0, 20)) {
      for (const pw of (h.problemWords || [])) {
        if (!seenWords.has(pw.expected)) {
          seenWords.add(pw.expected);
          recentWords.push(pw);
        }
        if (recentWords.length >= 15) break;
      }
      if (recentWords.length >= 15) break;
    }

    return {
      detectedAccent: topAccent,
      accentName: topAccent ? this.ACCENTS[topAccent].name : 'Unknown',
      accentFlag: topAccent ? this.ACCENTS[topAccent].flag : '🌍',
      confidence: topConfidence,
      totalAnalyses: data.totalAnalyses || 0,
      topSounds: sounds.slice(0, 8).map(([sound, count]) => ({ sound, count })),
      recentProblemWords: recentWords,
      accentVotes: votes,
      history: data.history.slice(0, 10),
    };
  },

  // ══════════════════════════════════════════════════
  // UI RENDERING HELPERS
  // ══════════════════════════════════════════════════

  /**
   * Render the accent analysis card for the evaluation results page.
   */
  renderResultCard(result) {
    if (!result || result.perfect) return '';

    const accent = result.accentName ? `${result.accentFlag} ${result.accentName}` : 'Analyzing...';

    let problemWordsHtml = '';
    if (result.problemWords && result.problemWords.length > 0) {
      problemWordsHtml = result.problemWords.slice(0, 6).map(pw => {
        const safeWord = pw.expected.replace(/'/g, "\\'");
        return `
        <div class="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
          <div class="flex items-center gap-2">
            <span class="text-red-400 font-mono text-sm">"${pw.expected}"</span>
            <svg class="w-3 h-3 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            <span class="text-amber-400 font-mono text-sm">"${pw.heard}"</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20">${pw.sound}</span>
            <button onclick="PTE.pronounceWord('${safeWord}')" class="text-[var(--accent-light)] hover:text-[var(--accent)]" title="Hear correct pronunciation">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
            </button>
          </div>
        </div>`;
      }).join('');
    }

    let tipsHtml = '';
    if (result.tips && result.tips.length > 0) {
      tipsHtml = result.tips.slice(0, 3).map(t => `
        <div class="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/15">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">${t.sound}</span>
          </div>
          <p class="text-xs text-emerald-300/80">${t.tip}</p>
        </div>
      `).join('');
    }

    let soundBadges = '';
    if (result.problemSounds && result.problemSounds.length > 0) {
      soundBadges = result.problemSounds.slice(0, 5).map(ps =>
        `<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20">${ps.sound}</span>`
      ).join('');
    }

    return `
    <div class="mt-6 card-elevated rounded-xl overflow-hidden max-w-lg mx-auto animate-fadeIn">
      <div class="bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 p-4 text-center">
        <h3 class="text-zinc-100 font-semibold text-sm flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
          Accent Coach
        </h3>
      </div>
      <div class="p-5">
        ${result.detectedAccent ? `
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-[10px] text-zinc-500 uppercase tracking-wide font-semibold">Detected Pattern</p>
            <p class="text-lg font-semibold text-zinc-100">${accent}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] text-zinc-500">Confidence</p>
            <p class="text-2xl font-extrabold font-mono text-rose-400">${result.confidence}%</p>
          </div>
        </div>
        ` : ''}

        ${soundBadges ? `
        <div class="mb-4">
          <p class="text-[10px] text-zinc-500 uppercase tracking-wide font-semibold mb-2">Problem Sounds</p>
          <div class="flex flex-wrap gap-2">${soundBadges}</div>
        </div>
        ` : ''}

        ${problemWordsHtml ? `
        <div class="mb-4">
          <p class="text-[10px] text-zinc-500 uppercase tracking-wide font-semibold mb-2">Words That Cost You Marks</p>
          <div class="card rounded-xl p-3">${problemWordsHtml}</div>
        </div>
        ` : ''}

        ${tipsHtml ? `
        <details open>
          <summary class="text-xs text-emerald-400 uppercase tracking-wide font-bold cursor-pointer mb-2">Pronunciation Tips</summary>
          <div class="space-y-2">${tipsHtml}</div>
        </details>
        ` : ''}

        <div class="mt-4 pt-3 border-t border-[var(--border)] text-center">
          <a href="#/accent" class="text-xs text-[var(--accent-light)] font-semibold hover:text-[var(--accent)] transition-colors">View Full Accent Profile &rarr;</a>
        </div>
      </div>
    </div>`;
  },

  /**
   * Render the full accent profile dashboard page.
   */
  renderPage() {
    const profile = this.getProfile();

    if (!profile) {
      return `${PTE.UI.navbar('accent')}
      <main class="min-h-screen py-10 px-4">
        <div class="max-w-3xl mx-auto text-center py-20">
          <span class="text-6xl mb-4 block">🗣️</span>
          <h2 class="text-2xl font-semibold text-zinc-100 mb-3">Accent Coach</h2>
          <p class="text-zinc-500 mb-6 max-w-md mx-auto">Practice some speaking questions first. After a few attempts, we'll analyze your accent patterns and show you exactly which sounds to work on.</p>
          <a href="#/practice" class="btn-primary">Start Practicing</a>
        </div>
      </main>`;
    }

    const accent = profile.accentName ? `${profile.accentFlag} ${profile.accentName}` : '🌍 Analyzing...';

    // Sound frequency bars
    const maxCount = profile.topSounds.length > 0 ? profile.topSounds[0].count : 1;
    const soundBars = profile.topSounds.map(s => {
      const pct = Math.round((s.count / maxCount) * 100);
      return `
      <div class="flex items-center gap-3">
        <span class="w-24 text-sm font-semibold text-zinc-300 text-right">${s.sound}</span>
        <div class="flex-1 h-3 bg-white/[0.02] rounded-full overflow-hidden">
          <div class="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-700" style="width:${pct}%"></div>
        </div>
        <span class="text-xs text-zinc-500 font-mono w-8">${s.count}x</span>
      </div>`;
    }).join('');

    // Recent problem words
    const recentWords = profile.recentProblemWords.map(pw => {
      const safeWord = pw.expected.replace(/'/g, "\\'");
      return `
      <div class="flex items-center justify-between py-2.5 border-b border-[var(--border)]">
        <div class="flex items-center gap-3">
          <button onclick="PTE.pronounceWord('${safeWord}')" class="w-8 h-8 rounded-lg bg-[var(--accent-surface)] flex items-center justify-center text-[var(--accent-light)] hover:bg-[rgba(109,92,255,0.15)] transition-colors flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
          </button>
          <div>
            <span class="text-sm font-medium text-zinc-100">${pw.expected}</span>
            <span class="text-zinc-600 mx-1">→</span>
            <span class="text-sm text-red-400">${pw.heard}</span>
          </div>
        </div>
        <span class="text-xs px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400">${pw.sound}</span>
      </div>`;
    }).join('');

    // Drill section for top problem sound
    let drillSection = '';
    if (profile.topSounds.length > 0) {
      const topSound = profile.topSounds[0].sound;
      const drills = this.DRILLS[topSound] || [];
      if (drills.length > 0) {
        drillSection = `
        <div class="card-elevated rounded-xl p-6 mb-6">
          <h3 class="text-lg font-semibold text-zinc-100 mb-1">Practice Drills: "${topSound}" Sound</h3>
          <p class="text-xs text-zinc-500 mb-4">Click each word to hear its correct pronunciation. Practice saying them clearly.</p>
          <div class="grid grid-cols-2 gap-3">
            ${drills.slice(0, 6).map(d => `
            <div class="card rounded-xl p-3 text-center">
              <div class="flex items-center justify-center gap-3 mb-2">
                <button onclick="PTE.pronounceWord('${d.word1}')" class="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-sm font-bold hover:bg-emerald-500/25 transition-colors">${d.word1}</button>
                <span class="text-zinc-600 text-xs">vs</span>
                <button onclick="PTE.pronounceWord('${d.word2}')" class="px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/20 text-rose-400 text-sm font-bold hover:bg-rose-500/25 transition-colors">${d.word2}</button>
              </div>
              <p class="text-xs text-zinc-500">${d.sound}</p>
            </div>
            `).join('')}
          </div>
        </div>`;
      }
    }

    // Accent tips for detected accent
    let accentTips = '';
    if (profile.detectedAccent && this.ACCENTS[profile.detectedAccent]) {
      const patterns = this.ACCENTS[profile.detectedAccent].patterns;
      accentTips = `
      <div class="card rounded-xl p-6 mb-6">
        <h3 class="text-lg font-semibold text-zinc-100 mb-4">Common ${profile.accentName} Accent Patterns</h3>
        <div class="space-y-3">
          ${patterns.map(p => `
          <details class="group">
            <summary class="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div class="flex items-center gap-3">
                <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20">${p.sound}</span>
                <span class="text-sm text-zinc-300">${p.desc}</span>
              </div>
              <svg class="w-4 h-4 text-zinc-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </summary>
            <div class="mt-2 ml-3 p-3 border-l-2 border-rose-500/20">
              <p class="text-xs text-zinc-400 mb-2">${p.tip}</p>
              <div class="flex flex-wrap gap-1.5">
                ${p.examples.slice(0, 4).map(ex => `<span class="text-xs px-2 py-0.5 rounded bg-white/[0.02] text-zinc-400">${ex}</span>`).join('')}
              </div>
            </div>
          </details>
          `).join('')}
        </div>
      </div>`;
    }

    return `${PTE.UI.navbar('accent')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-3xl mx-auto">

        <!-- Header -->
        <div class="text-center mb-8">
          <span class="text-5xl mb-3 block">🗣️</span>
          <h1 class="text-3xl font-semibold text-zinc-100 mb-2">Accent Coach</h1>
          <p class="text-zinc-500">Your personalized pronunciation profile based on ${profile.totalAnalyses} practice attempts.</p>
        </div>

        <!-- Accent Profile Card -->
        <div class="card-elevated rounded-xl p-6 mb-8 animate-fadeIn">
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-fuchsia-600 flex items-center justify-center text-4xl shadow-xl">${profile.accentFlag}</div>
            <div class="flex-1 text-center sm:text-left">
              <p class="text-[10px] text-zinc-500 uppercase tracking-wide font-semibold mb-1">Detected Accent Pattern</p>
              <h2 class="text-2xl font-extrabold text-zinc-100 mb-2">${accent}</h2>
              <div class="flex items-center justify-center sm:justify-start gap-3">
                <span class="badge" style="background:rgba(244,63,94,0.15);color:#fb7185;border:1px solid rgba(244,63,94,0.25)">${profile.confidence}% match</span>
                <span class="text-xs text-zinc-500 font-mono">${profile.totalAnalyses} analyses</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Problem Sounds -->
        ${soundBars ? `
        <div class="card rounded-xl p-6 mb-6">
          <h3 class="text-lg font-semibold text-zinc-100 mb-4">Problem Sounds (Most Frequent)</h3>
          <div class="space-y-3">${soundBars}</div>
        </div>` : ''}

        <!-- Drills -->
        ${drillSection}

        <!-- Recent Problem Words -->
        ${recentWords ? `
        <div class="card rounded-xl p-6 mb-6">
          <h3 class="text-lg font-semibold text-zinc-100 mb-1">Words That Cost You Marks</h3>
          <p class="text-xs text-zinc-500 mb-4">Click the speaker icon to hear the correct pronunciation.</p>
          <div>${recentWords}</div>
        </div>` : ''}

        <!-- Accent-specific tips -->
        ${accentTips}

        <!-- Note -->
        <div class="text-center py-4">
          <p class="text-xs text-zinc-600 max-w-md mx-auto">This analysis is based on speech recognition patterns. Keep practicing to improve accuracy. Accent is not a flaw — this tool helps you optimize for PTE scoring.</p>
        </div>

      </div>
    </main>`;
  }
};
