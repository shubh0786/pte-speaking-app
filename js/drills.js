/**
 * PTEverse - Pronunciation Drill Mode
 * Word-by-word pronunciation practice with TTS comparison
 */
window.PTE = window.PTE || {};

PTE.Drills = {
  STORAGE_KEY: 'crackpte_drills',
  currentIndex: 0,
  category: 'all',
  isRecording: false,

  WORDS: [
    {w:'phenomenon',cat:'Academic',ipa:'/fɪˈnɒmɪnən/'},
    {w:'reimbursement',cat:'Academic',ipa:'/ˌriːɪmˈbɜːsmənt/'},
    {w:'archaeological',cat:'Academic',ipa:'/ˌɑːkiəˈlɒdʒɪkəl/'},
    {w:'simultaneously',cat:'Academic',ipa:'/ˌsɪmlˈteɪniəsli/'},
    {w:'unprecedented',cat:'Academic',ipa:'/ʌnˈpresɪdentɪd/'},
    {w:'infrastructure',cat:'Academic',ipa:'/ˈɪnfrəstrʌktʃə/'},
    {w:'sustainability',cat:'Science',ipa:'/səˌsteɪnəˈbɪləti/'},
    {w:'biodiversity',cat:'Science',ipa:'/ˌbaɪəʊdaɪˈvɜːsəti/'},
    {w:'photosynthesis',cat:'Science',ipa:'/ˌfəʊtəʊˈsɪnθəsɪs/'},
    {w:'electromagnetic',cat:'Science',ipa:'/ɪˌlektrəʊmæɡˈnetɪk/'},
    {w:'cardiovascular',cat:'Medical',ipa:'/ˌkɑːdiəʊˈvæskjʊlə/'},
    {w:'pharmaceutical',cat:'Medical',ipa:'/ˌfɑːməˈsjuːtɪkəl/'},
    {w:'neuroplasticity',cat:'Medical',ipa:'/ˌnjʊərəʊplæˈstɪsəti/'},
    {w:'immunocompromised',cat:'Medical',ipa:'/ˌɪmjʊnəʊˈkɒmprəmaɪzd/'},
    {w:'Mediterranean',cat:'Geography',ipa:'/ˌmedɪtəˈreɪniən/'},
    {w:'archipelago',cat:'Geography',ipa:'/ˌɑːkɪˈpeləɡəʊ/'},
    {w:'entrepreneurship',cat:'Business',ipa:'/ˌɒntrəprəˈnɜːʃɪp/'},
    {w:'bureaucracy',cat:'Business',ipa:'/bjʊəˈrɒkrəsi/'},
    {w:'hypothesis',cat:'Academic',ipa:'/haɪˈpɒθəsɪs/'},
    {w:'catastrophe',cat:'Academic',ipa:'/kəˈtæstrəfi/'},
    {w:'preliminary',cat:'Academic',ipa:'/prɪˈlɪmɪnəri/'},
    {w:'characteristic',cat:'Academic',ipa:'/ˌkærəktəˈrɪstɪk/'},
    {w:'deterioration',cat:'Academic',ipa:'/dɪˌtɪəriəˈreɪʃən/'},
    {w:'anthropology',cat:'Academic',ipa:'/ˌænθrəˈpɒlədʒi/'},
    {w:'chronological',cat:'Academic',ipa:'/ˌkrɒnəˈlɒdʒɪkəl/'},
    {w:'philosophical',cat:'Academic',ipa:'/ˌfɪləˈsɒfɪkəl/'},
    {w:'pronunciation',cat:'Academic',ipa:'/prəˌnʌnsiˈeɪʃən/'},
    {w:'environmental',cat:'Science',ipa:'/ɪnˌvaɪrənˈmentəl/'},
    {w:'metamorphosis',cat:'Science',ipa:'/ˌmetəˈmɔːfəsɪs/'},
    {w:'thermodynamics',cat:'Science',ipa:'/ˌθɜːməʊdaɪˈnæmɪks/'},
    {w:'desertification',cat:'Geography',ipa:'/dɪˌzɜːtɪfɪˈkeɪʃən/'},
    {w:'demographic',cat:'Academic',ipa:'/ˌdeməˈɡræfɪk/'},
    {w:'cryptocurrency',cat:'Business',ipa:'/ˈkrɪptəʊˌkʌrənsi/'},
    {w:'algorithm',cat:'Science',ipa:'/ˈælɡərɪðəm/'},
    {w:'psychology',cat:'Academic',ipa:'/saɪˈkɒlədʒi/'},
    {w:'archaeology',cat:'Academic',ipa:'/ˌɑːkiˈɒlədʒi/'},
    {w:'Renaissance',cat:'Academic',ipa:'/rɪˈneɪsəns/'},
    {w:'tuberculosis',cat:'Medical',ipa:'/tjuːˌbɜːkjuˈləʊsɪs/'},
    {w:'schizophrenia',cat:'Medical',ipa:'/ˌskɪtsəˈfriːniə/'},
    {w:'stethoscope',cat:'Medical',ipa:'/ˈsteθəskəʊp/'},
    {w:'miscellaneous',cat:'Academic',ipa:'/ˌmɪsəˈleɪniəs/'},
    {w:'conscience',cat:'Academic',ipa:'/ˈkɒnʃəns/'},
    {w:'entrepreneur',cat:'Business',ipa:'/ˌɒntrəprəˈnɜː/'},
    {w:'aesthetic',cat:'Academic',ipa:'/iːsˈθetɪk/'},
    {w:'paradigm',cat:'Academic',ipa:'/ˈpærədaɪm/'},
    {w:'hierarchy',cat:'Business',ipa:'/ˈhaɪərɑːki/'},
    {w:'omnivore',cat:'Science',ipa:'/ˈɒmnɪvɔː/'},
    {w:'seismology',cat:'Science',ipa:'/saɪzˈmɒlədʒi/'},
    {w:'indigenous',cat:'Geography',ipa:'/ɪnˈdɪdʒɪnəs/'},
    {w:'volatile',cat:'Business',ipa:'/ˈvɒlətaɪl/'},
  ],

  getData() { try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {}; } catch(e) { return {}; } },
  save(data) { try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); } catch(e) {} },

  getFiltered() {
    const words = this.category === 'all' ? this.WORDS : this.WORDS.filter(w => w.cat === this.category);
    const data = this.getData();
    return words.map(w => ({ ...w, accuracy: data[w.w] ? Math.round((data[w.w].correct / data[w.w].attempts) * 100) : null, attempts: data[w.w] ? data[w.w].attempts : 0 }));
  },

  getCategories() { return ['all', ...new Set(this.WORDS.map(w => w.cat))]; },

  recordAttempt(word, success) {
    const data = this.getData();
    if (!data[word]) data[word] = { attempts: 0, correct: 0 };
    data[word].attempts++;
    if (success) data[word].correct++;
    this.save(data);
  },

  renderPage() {
    const words = this.getFiltered();
    const cats = this.getCategories();
    this.currentIndex = Math.min(this.currentIndex, words.length - 1);
    const word = words[this.currentIndex];
    if (!word) return `${PTE.UI.navbar('drills')}<main class="min-h-screen py-10 px-4"><div class="max-w-2xl mx-auto text-center py-20"><p class="text-zinc-500">No words found.</p></div></main>`;

    const safeW = word.w.replace(/'/g, "\\'");

    return `
    ${PTE.UI.navbar('drills')}
    <main class="min-h-screen py-8 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-semibold text-zinc-100">Pronunciation Drills</h1>
            <p class="text-sm text-zinc-500">${words.length} words</p>
          </div>
          <div class="flex gap-1 flex-wrap justify-end">
            ${cats.map(c => `<button onclick="PTE.Drills.category='${c}';PTE.Drills.currentIndex=0;PTE.App.renderPage('drills')" class="text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${this.category===c ? 'bg-[var(--accent-surface)] text-[var(--accent-light)] border border-[rgba(109,92,255,0.12)]' : 'text-zinc-500 hover:bg-white/[0.02]'}">${c==='all'?'All':c}</button>`).join('')}
          </div>
        </div>

        <p class="text-center text-sm text-zinc-500 mb-4 font-mono">${this.currentIndex + 1} / ${words.length}</p>

        <!-- Word Card -->
        <div class="card-elevated rounded-xl p-8 text-center mb-6">
          <span class="badge badge-level mb-3">${word.cat}</span>
          <h2 class="text-4xl font-extrabold text-zinc-100 mb-2">${word.w}</h2>
          <p class="text-sm text-zinc-500 mb-6 font-mono">${word.ipa}</p>
          <div class="flex justify-center gap-3 flex-wrap">
            <button onclick="PTE.pronounceWord('${safeW}')" class="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 bg-cyan-500/10 px-5 py-2.5 rounded-xl border border-cyan-500/20 hover:bg-cyan-500/20 transition-all">
              🔊 Listen Native
            </button>
            <button onclick="PTE.Drills.recordSelf('${safeW}')" id="drill-record-btn" class="inline-flex items-center gap-2 text-sm font-medium text-rose-400 bg-rose-500/10 px-5 py-2.5 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 transition-all">
              🎙️ Record Yourself
            </button>
          </div>
          <div id="drill-result" class="mt-4 hidden"></div>
          ${word.accuracy !== null ? `<p class="text-xs text-zinc-600 mt-4">Past accuracy: <span class="font-mono">${word.accuracy}%</span> (${word.attempts} attempts)</p>` : ''}
        </div>

        <!-- Navigation -->
        <div class="flex gap-3 justify-center">
          <button onclick="PTE.Drills.prev()" class="px-6 py-3 card rounded-xl text-zinc-400 hover:text-zinc-100 transition-colors font-medium text-sm">← Previous</button>
          <button onclick="PTE.Drills.next()" class="px-6 py-3 bg-[var(--accent-surface)] border border-[rgba(109,92,255,0.12)] rounded-xl text-[var(--accent-light)] hover:bg-[var(--accent-surface)] transition-colors font-medium text-sm">Next →</button>
        </div>
      </div>
    </main>`;
  },

  prev() { const w = this.getFiltered(); this.currentIndex = (this.currentIndex - 1 + w.length) % w.length; PTE.App.renderPage('drills'); },
  next() { const w = this.getFiltered(); this.currentIndex = (this.currentIndex + 1) % w.length; PTE.App.renderPage('drills'); },

  async recordSelf(word) {
    const btn = document.getElementById('drill-record-btn');
    const result = document.getElementById('drill-result');
    if (this.isRecording) return;
    this.isRecording = true;
    btn.innerHTML = '⏺️ Recording...';
    btn.classList.add('animate-pulse');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) { result.innerHTML = '<p class="text-amber-400 text-sm">Speech recognition not supported in this browser.</p>'; result.classList.remove('hidden'); this.isRecording = false; btn.innerHTML = '🎙️ Record Yourself'; btn.classList.remove('animate-pulse'); stream.getTracks().forEach(t=>t.stop()); return; }
      const rec = new SpeechRecognition();
      rec.continuous = false; rec.interimResults = false; rec.lang = 'en-US';
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript.trim().toLowerCase();
        const confidence = e.results[0][0].confidence;
        const match = transcript.includes(word.toLowerCase()) || this._similar(transcript, word.toLowerCase());
        this.recordAttempt(word, match);
        result.innerHTML = `
          <div class="p-3 rounded-lg ${match ? 'bg-emerald-500/15 border border-emerald-500/20' : 'bg-rose-500/15 border border-rose-500/20'}">
            <p class="text-sm font-semibold ${match ? 'text-emerald-400' : 'text-rose-400'}">${match ? '✅ Great pronunciation!' : '❌ Try again'}</p>
            <p class="text-xs text-zinc-500 mt-1">Heard: "${transcript}" (<span class="font-mono">${Math.round(confidence*100)}%</span> confidence)</p>
          </div>`;
        result.classList.remove('hidden');
        if (match && PTE.Gamify) PTE.Gamify.awardXP(70, 'pronunciation-drill', false, false);
      };
      rec.onerror = () => { result.innerHTML = '<p class="text-amber-400 text-sm">Could not recognize speech. Try again.</p>'; result.classList.remove('hidden'); };
      rec.onend = () => { this.isRecording = false; btn.innerHTML = '🎙️ Record Yourself'; btn.classList.remove('animate-pulse'); stream.getTracks().forEach(t=>t.stop()); };
      rec.start();
      setTimeout(() => { try { rec.stop(); } catch(e){} }, 4000);
    } catch(e) { this.isRecording = false; btn.innerHTML = '🎙️ Record Yourself'; btn.classList.remove('animate-pulse'); alert('Microphone access required.'); }
  },

  _similar(a, b) {
    if (a === b) return true;
    const words = a.split(/\s+/);
    return words.some(w => { let d = 0; const s = w.length > b.length ? w : b; const t = w.length > b.length ? b : w; for (let i = 0; i < s.length; i++) { if (s[i] !== t[i]) d++; } return d <= 2; });
  }
};
