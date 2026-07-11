/**
 * PTE Academic — Reading Practice Engine
 * Handles MCQ, drag-and-drop reorder, fill-in-the-blanks, and scoring
 */

window.PTE = window.PTE || {};

PTE.ReadingEngine = {
  currentType: null,
  currentQuestion: null,
  examMode: false,
  onExamSubmit: null,

  _examDone(overall, summary) {
    const cb = this.onExamSubmit;
    this.examMode = false;
    this.onExamSubmit = null;
    if (cb) cb({ overall, summary, typeId: this.currentType.id, questionId: this.currentQuestion.id });
  },

  render(typeId, question, containerId) {
    this.currentType = PTE.READING_TYPES[Object.keys(PTE.READING_TYPES).find(k => PTE.READING_TYPES[k].id === typeId)];
    this.currentQuestion = question;
    if (!this.currentType) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    switch (typeId) {
      case 'rw-fib': this._renderRWFIB(container, question); break;
      case 'r-mcma': this._renderMCMA(container, question); break;
      case 'reorder': this._renderReorder(container, question); break;
      case 'r-fib': this._renderRFIB(container, question); break;
      case 'r-mcsa': this._renderMCSA(container, question); break;
    }
  },

  _renderRWFIB(container, q) {
    let passageHTML = q.passage;
    q.blanks.forEach((blank, i) => {
      const options = blank.options.map((opt, j) =>
        `<option value="${j}">${opt}</option>`
      ).join('');
      passageHTML = passageHTML.replace(`{${i}}`,
        `<select id="rwfib-blank-${i}" class="reading-dropdown"><option value="">— select —</option>${options}</select>`
      );
    });

    container.innerHTML = `
      <div class="card rounded-xl p-5 mb-5">
        <p class="text-sm text-zinc-300 leading-loose">${passageHTML}</p>
      </div>
      <button class="btn-primary" onclick="PTE.ReadingEngine.submitRWFIB()">Check Answer</button>
      <div id="reading-score-area" class="mt-5"></div>`;
  },

  submitRWFIB() {
    const q = this.currentQuestion;
    let correct = 0;
    const total = q.blanks.length;
    q.blanks.forEach((blank, i) => {
      const el = document.getElementById(`rwfib-blank-${i}`);
      if (!el) return;
      const selected = parseInt(el.value);
      if (selected === blank.correct) {
        el.classList.add('reading-dropdown-correct');
        correct++;
      } else {
        el.classList.add('reading-dropdown-wrong');
      }
      el.disabled = true;
    });
    const overall = total > 0 ? Math.round((correct / total) * 90) : 0;
    if (this.examMode) return this._examDone(overall, `${correct}/${total} blanks correct`);
    this._showScore(correct, total, overall);
    this._saveSession(overall, `${correct}/${total} blanks correct`);
  },

  _renderMCMA(container, q) {
    const optionsHTML = q.options.map((opt, i) => `
      <label class="mcq-option" id="mcq-opt-${i}">
        <input type="checkbox" name="mcma" value="${i}" class="mcq-checkbox">
        <span class="text-sm text-zinc-300">${opt.text}</span>
      </label>`).join('');

    container.innerHTML = `
      <div class="card rounded-xl p-5 mb-5">
        <p class="text-sm text-zinc-300 leading-relaxed mb-4">${q.passage}</p>
        <p class="text-sm font-medium text-zinc-200 mb-3">${q.question}</p>
        <div class="space-y-2">${optionsHTML}</div>
      </div>
      <button class="btn-primary" onclick="PTE.ReadingEngine.submitMCMA()">Check Answer</button>
      <div id="reading-score-area" class="mt-5"></div>`;
  },

  submitMCMA() {
    const q = this.currentQuestion;
    const checkboxes = document.querySelectorAll('input[name="mcma"]');
    let score = 0;
    checkboxes.forEach((cb, i) => {
      const isSelected = cb.checked;
      const isCorrect = q.options[i].correct;
      const label = document.getElementById(`mcq-opt-${i}`);
      cb.disabled = true;

      if (isCorrect) {
        label.classList.add('mcq-correct');
        if (isSelected) score++;
      }
      if (isSelected && !isCorrect) {
        label.classList.add('mcq-wrong');
        score--;
      }
    });
    score = Math.max(0, score);
    const maxScore = q.options.filter(o => o.correct).length;
    const overall = maxScore > 0 ? Math.round((score / maxScore) * 90) : 0;
    if (this.examMode) return this._examDone(overall, `${score}/${maxScore} points`);
    this._showScore(score, maxScore, overall);
    this._saveSession(overall, `${score}/${maxScore} points`);
  },

  _renderReorder(container, q) {
    const shuffled = [...q.paragraphs].sort(() => Math.random() - 0.5);
    const itemsHTML = shuffled.map((p, i) => `
      <div class="drag-item" draggable="true" data-id="${p.id}" id="drag-${p.id}">
        <div class="drag-handle">
          <svg class="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/></svg>
        </div>
        <p class="text-sm text-zinc-300 flex-1">${p.text}</p>
      </div>`).join('');

    container.innerHTML = `
      <div class="mb-3"><p class="text-sm text-zinc-500">Drag and drop the text boxes into the correct order.</p></div>
      <div id="reorder-list" class="reorder-list space-y-2 mb-5">${itemsHTML}</div>
      <button class="btn-primary" onclick="PTE.ReadingEngine.submitReorder()">Check Answer</button>
      <div id="reading-score-area" class="mt-5"></div>`;

    this._initDragDrop();
  },

  _initDragDrop() {
    const list = document.getElementById('reorder-list');
    if (!list) return;
    let draggedEl = null;

    list.addEventListener('dragstart', e => {
      draggedEl = e.target.closest('.drag-item');
      if (draggedEl) {
        draggedEl.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      }
    });

    list.addEventListener('dragend', e => {
      const el = e.target.closest('.drag-item');
      if (el) el.classList.remove('dragging');
      draggedEl = null;
    });

    list.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const afterEl = this._getDragAfterElement(list, e.clientY);
      if (draggedEl) {
        if (afterEl) list.insertBefore(draggedEl, afterEl);
        else list.appendChild(draggedEl);
      }
    });
  },

  _getDragAfterElement(container, y) {
    const items = [...container.querySelectorAll('.drag-item:not(.dragging)')];
    return items.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) return { offset, element: child };
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  },

  submitReorder() {
    const q = this.currentQuestion;
    const items = document.querySelectorAll('#reorder-list .drag-item');
    const userOrder = [...items].map(el => el.dataset.id);
    const correct = q.correctOrder;

    let pairsCorrect = 0;
    const totalPairs = correct.length - 1;
    for (let i = 0; i < totalPairs; i++) {
      const userIdx1 = userOrder.indexOf(correct[i]);
      const userIdx2 = userOrder.indexOf(correct[i + 1]);
      if (userIdx2 === userIdx1 + 1) pairsCorrect++;
    }

    items.forEach(el => {
      el.setAttribute('draggable', 'false');
      const id = el.dataset.id;
      const correctIdx = correct.indexOf(id);
      const userIdx = userOrder.indexOf(id);
      if (correctIdx === userIdx) el.classList.add('drag-correct');
      else el.classList.add('drag-wrong');
    });

    const overall = totalPairs > 0 ? Math.round((pairsCorrect / totalPairs) * 90) : 0;
    if (this.examMode) return this._examDone(overall, `${pairsCorrect}/${totalPairs} pairs`);
    this._showScore(pairsCorrect, totalPairs, overall, 'correct pairs');
    this._saveSession(overall, `${pairsCorrect}/${totalPairs} pairs`);
  },

  _renderRFIB(container, q) {
    let passageHTML = q.passage;
    q.blanks.forEach((answer, i) => {
      passageHTML = passageHTML.replace(`{${i}}`,
        `<span class="drop-zone" id="rfib-drop-${i}" data-index="${i}" ondrop="PTE.ReadingEngine._dropWord(event)" ondragover="event.preventDefault();this.classList.add('drop-zone-active')" ondragleave="this.classList.remove('drop-zone-active')"><span class="text-zinc-600 text-xs">drop here</span></span>`
      );
    });

    const bankHTML = [...q.blanks, ...q.distractors].sort(() => Math.random() - 0.5).map(word =>
      `<span class="drag-word" draggable="true" ondragstart="event.dataTransfer.setData('text',this.textContent);this.classList.add('drag-word-dragging')" ondragend="this.classList.remove('drag-word-dragging')">${word}</span>`
    ).join('');

    container.innerHTML = `
      <div class="card rounded-xl p-5 mb-5">
        <p class="text-sm text-zinc-300 leading-loose">${passageHTML}</p>
      </div>
      <div class="mb-5">
        <p class="text-xs text-zinc-500 mb-2">Word Bank — drag words into the blanks above:</p>
        <div class="flex flex-wrap gap-2">${bankHTML}</div>
      </div>
      <button class="btn-primary" onclick="PTE.ReadingEngine.submitRFIB()">Check Answer</button>
      <div id="reading-score-area" class="mt-5"></div>`;
  },

  _dropWord(e) {
    e.preventDefault();
    const word = e.dataTransfer.getData('text');
    const zone = e.target.closest('.drop-zone');
    if (zone) {
      zone.innerHTML = `<span class="text-sm text-zinc-200">${word}</span>`;
      zone.classList.remove('drop-zone-active');
      zone.dataset.value = word;
    }
  },

  submitRFIB() {
    const q = this.currentQuestion;
    let correct = 0;
    q.blanks.forEach((answer, i) => {
      const zone = document.getElementById(`rfib-drop-${i}`);
      if (!zone) return;
      const placed = (zone.dataset.value || '').trim().toLowerCase();
      if (placed === answer.toLowerCase()) {
        zone.classList.add('drop-zone-correct');
        correct++;
      } else {
        zone.classList.add('drop-zone-wrong');
      }
    });
    const total = q.blanks.length;
    const overall = total > 0 ? Math.round((correct / total) * 90) : 0;
    if (this.examMode) return this._examDone(overall, `${correct}/${total} blanks correct`);
    this._showScore(correct, total, overall);
    this._saveSession(overall, `${correct}/${total} blanks correct`);
  },

  _renderMCSA(container, q) {
    const optionsHTML = q.options.map((opt, i) => `
      <label class="mcq-option" id="mcsa-opt-${i}">
        <input type="radio" name="mcsa" value="${i}" class="mcq-radio">
        <span class="text-sm text-zinc-300">${opt}</span>
      </label>`).join('');

    container.innerHTML = `
      <div class="card rounded-xl p-5 mb-5">
        <p class="text-sm text-zinc-300 leading-relaxed mb-4">${q.passage}</p>
        <p class="text-sm font-medium text-zinc-200 mb-3">${q.question}</p>
        <div class="space-y-2">${optionsHTML}</div>
      </div>
      <button class="btn-primary" onclick="PTE.ReadingEngine.submitMCSA()">Check Answer</button>
      <div id="reading-score-area" class="mt-5"></div>`;
  },

  submitMCSA() {
    const q = this.currentQuestion;
    const radios = document.querySelectorAll('input[name="mcsa"]');
    let selectedIdx = -1;
    radios.forEach((r, i) => {
      r.disabled = true;
      if (r.checked) selectedIdx = i;
    });

    const correctLabel = document.getElementById(`mcsa-opt-${q.correctIndex}`);
    if (correctLabel) correctLabel.classList.add('mcq-correct');

    if (selectedIdx >= 0 && selectedIdx !== q.correctIndex) {
      const wrongLabel = document.getElementById(`mcsa-opt-${selectedIdx}`);
      if (wrongLabel) wrongLabel.classList.add('mcq-wrong');
    }

    const isCorrect = selectedIdx === q.correctIndex;
    const overall = isCorrect ? 90 : 0;
    if (this.examMode) return this._examDone(overall, isCorrect ? 'Correct' : 'Incorrect');
    this._showScore(isCorrect ? 1 : 0, 1, overall);
    this._saveSession(overall, isCorrect ? 'Correct' : 'Incorrect');
  },

  _showScore(correct, total, overall, unit = 'correct') {
    const area = document.getElementById('reading-score-area');
    if (!area) return;
    const band = PTE.Scoring.getBand(overall);
    area.innerHTML = `
    <div class="card-elevated rounded-xl p-5 max-w-sm mx-auto text-center animate-fadeIn">
      <div class="text-3xl font-bold font-mono mb-1" style="color:${band.color}">${overall}<span class="text-base text-zinc-600">/90</span></div>
      <p class="text-sm text-zinc-400">${correct}/${total} ${unit}</p>
      <div class="inline-flex items-center gap-1.5 mt-2 bg-white/[0.04] px-3 py-1 rounded-full">
        <span class="text-xs">${band.emoji}</span>
        <span class="text-xs font-medium text-zinc-300">${band.label}</span>
      </div>
    </div>`;
  },

  _saveSession(overall, summary) {
    if (!PTE.Store) return;
    PTE.Store.addSession({
      timestamp: Date.now(),
      date: new Date().toLocaleDateString(),
      type: this.currentType.id,
      questionId: this.currentQuestion.id,
      overallScore: overall,
      scores: { overall },
      transcript: summary,
      duration: this.currentType.answerTime || 120
    });
    if (PTE.Gamify) PTE.Gamify.addXP(overall >= 60 ? 20 : 8, this.currentType.id);
    if (PTE.Spaced) PTE.Spaced.trackResult(this.currentQuestion.id, this.currentType.id, overall);
    if (PTE.App && PTE.App._notifyModeCompletion) PTE.App._notifyModeCompletion(this.currentType.id, overall);
  }
};
