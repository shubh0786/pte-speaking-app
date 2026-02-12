/**
 * Crack PTE - Leaderboard (Local)
 * Rankings by XP with display names
 */
window.PTE = window.PTE || {};

PTE.Leaderboard = {
  STORAGE_KEY: 'crackpte_leaderboard',

  getData() { try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || { players:[], myName:'' }; } catch(e) { return { players:[], myName:'' }; } },
  save(data) { try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); } catch(e) {} },

  getMyName() { return this.getData().myName || ''; },

  setMyName(name) {
    const data = this.getData();
    data.myName = name.trim();
    this.save(data);
  },

  updateScore() {
    const data = this.getData();
    const name = data.myName || 'You';
    const gp = PTE.Gamify ? PTE.Gamify.getProgress() : null;
    if (!gp) return;

    let existing = data.players.find(p => p.isMe);
    if (existing) {
      existing.name = name;
      existing.xp = gp.xp;
      existing.level = gp.level.level;
      existing.levelIcon = gp.level.icon;
      existing.score = gp.bestScore;
      existing.streak = gp.streak;
    } else {
      data.players.push({ name, xp: gp.xp, level: gp.level.level, levelIcon: gp.level.icon, score: gp.bestScore, streak: gp.streak, isMe: true });
    }

    // Sort by XP descending
    data.players.sort((a, b) => b.xp - a.xp);
    this.save(data);
  },

  renderPage() {
    this.updateScore();
    const data = this.getData();
    const myName = data.myName;

    // Prompt for name if not set
    if (!myName) {
      return `
      ${PTE.UI.navbar('leaderboard')}
      <main class="min-h-screen py-10 px-4">
        <div class="max-w-md mx-auto text-center">
          <span class="text-5xl mb-4 block animate-float">🏆</span>
          <h1 class="text-3xl font-bold text-white mb-2">Leaderboard</h1>
          <p class="text-gray-500 mb-8">Enter your display name to join the leaderboard.</p>
          <div class="glass rounded-2xl p-6 neon-border">
            <input id="lb-name-input" type="text" placeholder="Your display name" maxlength="20" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none mb-4">
            <button onclick="const n=document.getElementById('lb-name-input').value;if(n.trim()){PTE.Leaderboard.setMyName(n);PTE.App.renderPage('leaderboard')}" class="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:opacity-90 transition-all">Join Leaderboard</button>
          </div>
        </div>
      </main>`;
    }

    const players = data.players || [];
    const rankIcons = ['🥇','🥈','🥉'];

    const rows = players.map((p, i) => `
      <div class="flex items-center gap-4 py-3 ${i < players.length - 1 ? 'border-b border-white/5' : ''} ${p.isMe ? 'bg-indigo-500/10 -mx-4 px-4 rounded-lg' : ''}">
        <span class="w-8 text-center font-bold ${i < 3 ? 'text-2xl' : 'text-gray-500 text-sm'}">${i < 3 ? rankIcons[i] : i + 1}</span>
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg ${p.isMe ? 'bg-indigo-500/20' : 'bg-white/5'}">${p.levelIcon || '🌱'}</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold ${p.isMe ? 'text-indigo-400' : 'text-white'} truncate">${p.name} ${p.isMe ? '(You)' : ''}</p>
          <p class="text-xs text-gray-600">Level ${p.level} • Best: ${p.score}/90 ${p.streak > 0 ? '• 🔥' + p.streak : ''}</p>
        </div>
        <div class="text-right">
          <p class="text-sm font-extrabold text-indigo-400">${(p.xp||0).toLocaleString()}</p>
          <p class="text-xs text-gray-600">XP</p>
        </div>
      </div>
    `).join('');

    return `
    ${PTE.UI.navbar('leaderboard')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-8">
          <span class="text-5xl mb-3 block">🏆</span>
          <h1 class="text-3xl font-bold text-white mb-2">Leaderboard</h1>
          <p class="text-gray-500">Ranked by total XP earned</p>
        </div>
        <div class="glass neon-border rounded-2xl p-4 sm:p-6">
          ${rows || '<p class="text-gray-500 text-center py-8">No players yet. Start practicing to appear here!</p>'}
        </div>
        <p class="text-center text-xs text-gray-600 mt-4">Practice more to climb the rankings!</p>
      </div>
    </main>`;
  }
};
