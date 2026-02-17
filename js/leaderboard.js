/**
 * Crack PTE - Leaderboard (Local)
 * Rankings by XP with display names
 */
window.PTE = window.PTE || {};

PTE.Leaderboard = {
  STORAGE_KEY: 'crackpte_leaderboard',

  getData() { try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || { players:[], myName:'' }; } catch(e) { return { players:[], myName:'' }; } },
  save(data) { try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); } catch(e) {} },

  getMyName() {
    const stored = this.getData().myName;
    if (stored) return stored;
    // Fall back to auth username if available
    if (PTE.Auth && PTE.Auth.getCurrentUser()) return PTE.Auth.getCurrentUser().username;
    return '';
  },

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
          <span class="text-5xl mb-4 block">🏆</span>
          <h1 class="text-3xl font-semibold text-zinc-100 mb-2">Leaderboard</h1>
          <p class="text-zinc-500 mb-8">Enter your display name to join the leaderboard.</p>
          <div class="card-elevated rounded-xl p-6">
            <input id="lb-name-input" type="text" placeholder="Your display name" maxlength="20" class="w-full bg-white/[0.02] border border-[var(--border)] rounded-xl px-4 py-3 text-zinc-100 text-center font-medium focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(109,92,255,0.15)] outline-none mb-4">
            <button onclick="const n=document.getElementById('lb-name-input').value;if(n.trim()){PTE.Leaderboard.setMyName(n);PTE.App.renderPage('leaderboard')}" class="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--accent)] to-purple-600 text-zinc-100 font-semibold hover:opacity-90 transition-all">Join Leaderboard</button>
          </div>
        </div>
      </main>`;
    }

    const players = data.players || [];
    const rankIcons = ['🥇','🥈','🥉'];

    const rows = players.map((p, i) => `
      <div class="flex items-center gap-4 py-3 ${i < players.length - 1 ? 'border-b border-[var(--border)]' : ''} ${p.isMe ? 'bg-[var(--accent-surface)] -mx-4 px-4 rounded-lg' : ''}">
        <span class="w-8 text-center font-semibold ${i < 3 ? 'text-2xl' : 'text-zinc-500 text-sm'}">${i < 3 ? rankIcons[i] : i + 1}</span>
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg ${p.isMe ? 'bg-[var(--accent-surface)]' : 'bg-white/[0.02]'}">${p.levelIcon || '🌱'}</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold ${p.isMe ? 'text-[var(--accent-light)]' : 'text-zinc-100'} truncate">${p.name} ${p.isMe ? '(You)' : ''}</p>
          <p class="text-xs text-zinc-600">Level ${p.level} • Best: ${p.score}/90 ${p.streak > 0 ? '• 🔥' + p.streak : ''}</p>
        </div>
        <div class="text-right">
          <p class="text-sm font-extrabold font-mono text-[var(--accent-light)]">${(p.xp||0).toLocaleString()}</p>
          <p class="text-xs text-zinc-600">XP</p>
        </div>
      </div>
    `).join('');

    return `
    ${PTE.UI.navbar('leaderboard')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-8">
          <span class="text-5xl mb-3 block">🏆</span>
          <h1 class="text-3xl font-semibold text-zinc-100 mb-2">Leaderboard</h1>
          <p class="text-zinc-500">Ranked by total XP earned</p>
        </div>
        <div class="card-elevated rounded-xl p-4 sm:p-6">
          ${rows || '<p class="text-zinc-500 text-center py-8">No players yet. Start practicing to appear here!</p>'}
        </div>
        <p class="text-center text-xs text-zinc-600 mt-4">Practice more to climb the rankings!</p>
      </div>
    </main>`;
  }
};
