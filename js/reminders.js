/**
 * Crack PTE - Study Reminders
 * Browser notifications for daily practice
 */
window.PTE = window.PTE || {};

PTE.Reminders = {
  STORAGE_KEY: 'crackpte_reminders',

  getData() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || { enabled: false, hour: 9, minute: 0 };
    } catch (e) { return { enabled: false, hour: 9, minute: 0 }; }
  },

  save(data) {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  },

  async requestPermission() {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  async enable(hour, minute) {
    const ok = await this.requestPermission();
    if (!ok) return { success: false, error: 'Notification permission denied' };

    const data = this.getData();
    data.enabled = true;
    data.hour = hour ?? 9;
    data.minute = minute ?? 0;
    this.save(data);

    this.scheduleNext();
    return { success: true };
  },

  disable() {
    const data = this.getData();
    data.enabled = false;
    this.save(data);
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  },

  scheduleNext() {
    if (this._timeoutId) clearTimeout(this._timeoutId);

    const data = this.getData();
    if (!data.enabled) return;

    const now = new Date();
    let next = new Date(now);
    next.setHours(data.hour, data.minute, 0, 0);

    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }

    const ms = Math.min(next.getTime() - now.getTime(), 24 * 60 * 60 * 1000); // Cap at 24h
    this._timeoutId = setTimeout(() => {
      this._showNotification();
      this._timeoutId = null;
      this.scheduleNext(); // Schedule for tomorrow
    }, ms);
  },

  /** Call on app init to schedule reminders if enabled */
  init() {
    const data = this.getData();
    if (data.enabled) this.scheduleNext();
  },

  _showNotification() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const title = 'Crack PTE — Time to Practice!';
    const body = 'Keep your streak alive. A few minutes of practice can make a big difference.';
    const n = new Notification(title, {
      body,
      icon: '/img/logo.png',
      tag: 'crackpte-reminder',
    });

    n.onclick = () => {
      window.focus();
      if (window.location.hash !== '#/') {
        window.location.hash = '#/';
      }
      n.close();
    };
  },

  renderCard() {
    const data = this.getData();
    const enabled = data.enabled;

    return `
    <a href="#/reminders" class="block">
      <div class="glass glass-hover rounded-2xl p-6 card-shine">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style="background:rgba(34,211,238,0.15)">🔔</div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-white mb-1">Study Reminders</h3>
            <p class="text-sm text-gray-500">${enabled ? `Daily at ${String(data.hour).padStart(2,'0')}:${String(data.minute).padStart(2,'0')}` : 'Get notified to practice daily'}</p>
          </div>
          <span class="text-xs px-2 py-1 rounded-full ${enabled ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-500/15 text-gray-500'}">${enabled ? 'On' : 'Off'}</span>
        </div>
      </div>
    </a>`;
  },

  renderPage() {
    const data = this.getData();
    const enabled = data.enabled;

    return `
    ${PTE.UI.navbar('home')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-md mx-auto">

        <!-- Header -->
        <div class="text-center mb-8">
          <span class="text-5xl mb-3 block animate-float">🔔</span>
          <h1 class="text-3xl font-bold text-white mb-2">Study Reminders</h1>
          <p class="text-gray-500">Get a daily notification to practice and keep your streak alive.</p>
        </div>

        <!-- Status -->
        <div class="glass rounded-2xl p-6 mb-6">
          <div class="flex items-center justify-between mb-6">
            <span class="text-gray-400">Reminders</span>
            <span class="text-sm font-bold px-3 py-1 rounded-full ${enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-500'}">${enabled ? 'Enabled' : 'Disabled'}</span>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Daily time</label>
              <div class="flex gap-3">
                <input type="number" id="reminder-hour" value="${data.hour}" min="0" max="23"
                  class="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center focus:border-indigo-500 outline-none">
                <span class="flex items-center text-gray-500">:</span>
                <input type="number" id="reminder-minute" value="${data.minute}" min="0" max="59"
                  class="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center focus:border-indigo-500 outline-none">
              </div>
            </div>

            ${enabled ? `
            <button onclick="PTE.Reminders.disable(); PTE.Router.navigate('/reminders');" class="w-full py-3 bg-red-500/15 border border-red-500/20 text-red-400 font-semibold rounded-xl hover:bg-red-500/25 transition-all">
              Disable Reminders
            </button>
            ` : `
            <button onclick="PTE.Reminders._enableFromForm()" class="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">
              Enable Reminders
            </button>
            `}
          </div>
        </div>

        <p class="text-xs text-gray-600 text-center">You'll need to allow notifications in your browser. Reminders only work when the app is open in a tab (or was recently used).</p>

      </div>
    </main>`;
  },

  async _enableFromForm() {
    const hour = parseInt(document.getElementById('reminder-hour')?.value) || 9;
    const minute = parseInt(document.getElementById('reminder-minute')?.value) || 0;
    const result = await this.enable(hour, minute);
    if (result.success) {
      if (PTE.App) PTE.App.renderPage('reminders');
    } else {
      alert(result.error || 'Could not enable reminders.');
    }
  },
};
