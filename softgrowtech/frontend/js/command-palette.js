// ===== COMMAND PALETTE (Ctrl+K) =====
const COMMANDS = [
  { label:'Overview', icon:'📊', action:()=>showPage('overview') },
  { label:'Submit Task', icon:'📤', action:()=>showPage('submit') },
  { label:'My Submissions', icon:'📋', action:()=>showPage('submissions') },
  { label:'AI Assistant', icon:'💬', action:()=>showPage('ai-chat') },
  { label:'AI Feedback', icon:'🤖', action:()=>showPage('ai-feedback') },
  { label:'Performance AI', icon:'📈', action:()=>showPage('ai-analyze') },
  { label:'Plagiarism Check', icon:'🔍', action:()=>showPage('plagiarism') },
  { label:'AI Report', icon:'📝', action:()=>showPage('ai-report') },
  { label:'Gamification', icon:'🎮', action:()=>showPage('gamification') },
  { label:'Leaderboard', icon:'🏆', action:()=>showPage('leaderboard') },
  { label:'Deadlines', icon:'⏰', action:()=>showPage('deadlines') },
  { label:'Certificate', icon:'🏅', action:()=>showPage('certificate') },
  { label:'Profile', icon:'👤', action:()=>showPage('profile') },
  { label:'Notifications', icon:'🔔', action:()=>showPage('notifications') },
  { label:'Toggle Theme', icon:'🌙', action:()=>toggleTheme() },
  { label:'Logout', icon:'🚪', action:()=>logout() },
];

let paletteOpen = false;
let paletteFiltered = [...COMMANDS];
let paletteSelected = 0;

function initCommandPalette() {
  // Inject palette HTML
  const el = document.createElement('div');
  el.id = 'cmdPalette';
  el.style.cssText = 'display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.7);backdrop-filter:blur(5px);align-items:flex-start;justify-content:center;padding-top:15vh';
  el.innerHTML = `
    <div style="width:100%;max-width:580px;background:#0a192f;border:1px solid rgba(0,229,255,0.4);border-radius:12px;overflow:hidden;box-shadow:0 25px 80px rgba(0,0,0,0.6)">
      <div style="display:flex;align-items:center;gap:0.75rem;padding:1rem 1.2rem;border-bottom:1px solid var(--border)">
        <span style="color:var(--cyan)">⌨️</span>
        <input id="cmdInput" placeholder="Type a command..." style="flex:1;background:none;border:none;outline:none;color:var(--text-primary);font-size:1rem;font-family:var(--font-body)" oninput="filterCommands(this.value)" onkeydown="handlePaletteKey(event)"/>
        <span style="font-size:0.75rem;color:var(--text-muted);font-family:var(--font-head)">ESC</span>
      </div>
      <div id="cmdList" style="max-height:320px;overflow-y:auto;padding:0.5rem"></div>
    </div>`;
  el.addEventListener('click', e => { if(e.target===el) closePalette(); });
  document.body.appendChild(el);

  // Keyboard shortcut
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); togglePalette(); }
    if (e.key === 'Escape' && paletteOpen) closePalette();
  });
}

function togglePalette() { paletteOpen ? closePalette() : openPalette(); }

function openPalette() {
  paletteOpen = true;
  paletteFiltered = [...COMMANDS];
  paletteSelected = 0;
  const el = document.getElementById('cmdPalette');
  el.style.display = 'flex';
  setTimeout(() => document.getElementById('cmdInput')?.focus(), 50);
  renderPaletteList();
}

function closePalette() {
  paletteOpen = false;
  document.getElementById('cmdPalette').style.display = 'none';
  document.getElementById('cmdInput').value = '';
}

function filterCommands(query) {
  paletteFiltered = COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
  paletteSelected = 0;
  renderPaletteList();
}

function renderPaletteList() {
  const list = document.getElementById('cmdList');
  if (!paletteFiltered.length) { list.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--text-muted)">No commands found</div>'; return; }
  list.innerHTML = paletteFiltered.map((c,i) => `
    <div onclick="runCommand(${i})" onmouseover="paletteSelected=${i};renderPaletteList()"
      style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1.2rem;cursor:pointer;border-radius:6px;margin:0.2rem 0.5rem;
      background:${i===paletteSelected?'rgba(0,229,255,0.1)':'transparent'};transition:background 0.1s">
      <span style="font-size:1.1rem">${c.icon}</span>
      <span style="font-size:0.9rem;color:${i===paletteSelected?'var(--cyan)':'var(--text-primary)'}">${c.label}</span>
    </div>`).join('');
}

function handlePaletteKey(e) {
  if (e.key==='ArrowDown') { paletteSelected=Math.min(paletteSelected+1,paletteFiltered.length-1); renderPaletteList(); }
  if (e.key==='ArrowUp') { paletteSelected=Math.max(paletteSelected-1,0); renderPaletteList(); }
  if (e.key==='Enter') runCommand(paletteSelected);
}

function runCommand(i) {
  closePalette();
  paletteFiltered[i]?.action();
}

document.addEventListener('DOMContentLoaded', initCommandPalette);
