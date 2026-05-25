// ===== FEATURE 1: DARK/LIGHT MODE TOGGLE =====
function toggleTheme() {
  const body = document.body;
  const btn = document.querySelector('.theme-toggle');
  const isLight = body.classList.toggle('light-theme');
  if (btn) btn.textContent = isLight ? 'ðŸŒ™' : 'â˜€ï¸';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.body.classList.add('light-theme');
    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.textContent = 'ðŸŒ™';
  }
}

// ===== FEATURE 2: REAL-TIME NOTIFICATIONS =====
let notifCount = 0;
let notifList = [];

function addNotification(title, msg, type = 'info') {
  const notif = {
    id: Date.now(),
    title, msg, type,
    time: new Date().toLocaleTimeString(),
    read: false
  };
  notifList.unshift(notif);
  notifCount++;
  updateNotifBadge();
  showToast(title, type, msg);
}

function updateNotifBadge() {
  const badge = document.getElementById('notifBadge');
  if (badge) {
    badge.textContent = notifCount;
    badge.style.display = notifCount > 0 ? 'inline' : 'none';
  }
}

function renderNotifDropdown() {
  const list = document.getElementById('notifList');
  if (!list) return;
  if (notifList.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem">No notifications</p>';
    return;
  }
  list.innerHTML = notifList.map(n => `
    <div style="display:flex;gap:1rem;padding:1rem;border-radius:8px;margin-bottom:0.75rem;
      background:${n.read ? 'transparent' : 'rgba(0,229,255,0.04)'};
      border:1px solid ${n.read ? 'transparent' : 'rgba(0,229,255,0.15)'}">
      <span style="font-size:1.2rem">${n.type==='success'?'âœ…':n.type==='error'?'âŒ':'ðŸ””'}</span>
      <div style="flex:1">
        <div style="font-weight:600;font-size:0.9rem">${n.title}</div>
        <div style="color:var(--text-secondary);font-size:0.8rem;margin-top:0.2rem">${n.msg}</div>
        <div style="color:var(--text-muted);font-size:0.75rem;margin-top:0.25rem">${n.time}</div>
      </div>
      ${!n.read ? '<span style="width:8px;height:8px;border-radius:50%;background:var(--cyan);flex-shrink:0;margin-top:4px"></span>' : ''}
    </div>
  `).join('');
}

function markAllRead() {
  notifList.forEach(n => n.read = true);
  notifCount = 0;
  updateNotifBadge();
  renderNotifDropdown();
}

// Poll for new notifications every 30 seconds
function startNotifPolling() {
  setInterval(async () => {
    // Check for status updates from backend
    try {
      const data = await apiRequest('/submissions/my');
      if (data?.submissions) {
        const approved = data.submissions.filter(s => s.status === 'APPROVED').length;
        const reviewed = data.submissions.filter(s => s.status === 'REVIEWED').length;
        // Compare with stored counts
        const prevApproved = parseInt(localStorage.getItem('prevApproved') || '0');
        const prevReviewed = parseInt(localStorage.getItem('prevReviewed') || '0');
        if (approved > prevApproved) {
          addNotification('Task Approved! ðŸŽ‰', `${approved - prevApproved} task(s) approved by admin`, 'success');
          localStorage.setItem('prevApproved', approved);
        }
        if (reviewed > prevReviewed) {
          addNotification('Feedback Added ðŸ“', 'Admin reviewed your submission', 'info');
          localStorage.setItem('prevReviewed', reviewed);
        }
      }
    } catch {}
  }, 30000);
}

// ===== FEATURE 3: TASK DEADLINE TRACKER =====
const DEADLINES = [
  { id: 1, task: 'E-Commerce Homepage', deadline: '2025-07-01', priority: 'High' },
  { id: 2, task: 'Authentication Module', deadline: '2025-07-15', priority: 'Medium' },
  { id: 3, task: 'Admin Dashboard', deadline: '2025-07-30', priority: 'Low' },
];

function renderDeadlines() {
  const container = document.getElementById('deadlineList');
  if (!container) return;

  const now = new Date();
  const sorted = [...DEADLINES].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  container.innerHTML = sorted.map(d => {
    const deadline = new Date(d.deadline);
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    const isOverdue = daysLeft < 0;
    const isUrgent = daysLeft <= 3 && daysLeft >= 0;
    const color = isOverdue ? '#ff6b6b' : isUrgent ? '#ffc107' : '#00e5ff';
    const pctUsed = Math.min(100, Math.max(0, ((30 - daysLeft) / 30) * 100));

    return `
      <div style="background:rgba(0,229,255,0.03);border:1px solid var(--border);border-radius:10px;padding:1.2rem;margin-bottom:1rem;border-left:3px solid ${color}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem">
          <div>
            <div style="font-weight:600;font-size:0.95rem">${d.task}</div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.2rem">
              Due: ${deadline.toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}
            </div>
          </div>
          <div style="text-align:right">
            <span style="font-size:0.75rem;padding:0.2rem 0.6rem;border-radius:4px;
              background:${d.priority==='High'?'rgba(255,107,107,0.15)':d.priority==='Medium'?'rgba(255,193,7,0.15)':'rgba(0,229,255,0.15)'};
              color:${d.priority==='High'?'#ff6b6b':d.priority==='Medium'?'#ffc107':'#00e5ff'}">${d.priority}</span>
            <div style="font-size:1rem;font-weight:700;color:${color};margin-top:0.3rem">
              ${isOverdue ? 'OVERDUE' : daysLeft === 0 ? 'TODAY!' : daysLeft + ' days left'}
            </div>
          </div>
        </div>
        <div style="height:4px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden">
          <div style="height:100%;width:${pctUsed}%;background:${color};border-radius:2px;transition:width 1s ease"></div>
        </div>
      </div>
    `;
  }).join('');
}

function addDeadline() {
  const task = prompt('Task name:');
  const date = prompt('Deadline (YYYY-MM-DD):');
  const priority = prompt('Priority (High/Medium/Low):') || 'Medium';
  if (task && date) {
    DEADLINES.push({ id: Date.now(), task, deadline: date, priority });
    renderDeadlines();
    showToast('Deadline added!', 'success');
  }
}

// ===== FEATURE 4: CERTIFICATE GENERATOR =====
function generateCertificate(internName, domain, duration) {
  const user = getUser();
  internName = internName || user?.fullName || 'Intern Name';
  domain = domain || user?.domain || 'Web Development';
  duration = duration || user?.duration || '3 Months';

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const certNum = 'SGT-' + Date.now().toString().slice(-6);

  const win = window.open('', '_blank');
  win.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Certificate - ${internName}</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap" rel="stylesheet"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#050d1a; display:flex; align-items:center; justify-content:center; min-height:100vh; font-family:'Exo 2',sans-serif; }
  .cert {
    width:900px; padding:60px;
    background: linear-gradient(135deg, #0a192f 0%, #050d1a 50%, #0a192f 100%);
    border:2px solid #00e5ff;
    box-shadow: 0 0 60px rgba(0,229,255,0.2), inset 0 0 60px rgba(0,229,255,0.02);
    position:relative; text-align:center; color:#e6f1ff;
  }
  .cert::before {
    content:''; position:absolute; inset:10px;
    border:1px solid rgba(0,229,255,0.2); pointer-events:none;
  }
  .logo { font-family:'Orbitron',sans-serif; font-size:1.8rem; font-weight:900; color:#00e5ff; margin-bottom:0.5rem; }
  .tagline { font-size:0.8rem; letter-spacing:0.3em; color:#8892b0; text-transform:uppercase; margin-bottom:3rem; }
  .cert-title { font-family:'Orbitron',sans-serif; font-size:0.9rem; letter-spacing:0.3em; color:#00e5ff; text-transform:uppercase; margin-bottom:1rem; }
  .presented { font-size:1rem; color:#8892b0; margin-bottom:1rem; }
  .name { font-family:'Orbitron',sans-serif; font-size:2.8rem; font-weight:900; color:#fff; margin-bottom:1.5rem;
    text-shadow: 0 0 30px rgba(0,229,255,0.4); border-bottom:2px solid rgba(0,229,255,0.3); padding-bottom:1rem; }
  .desc { font-size:1rem; color:#8892b0; line-height:1.8; margin-bottom:2rem; max-width:600px; margin-left:auto; margin-right:auto; }
  .domain { color:#00e5ff; font-weight:700; font-size:1.1rem; }
  .details { display:flex; justify-content:center; gap:3rem; margin:2rem 0; }
  .detail-item { text-align:center; }
  .detail-label { font-size:0.7rem; letter-spacing:0.2em; color:#8892b0; text-transform:uppercase; }
  .detail-value { font-family:'Orbitron',sans-serif; font-size:0.9rem; color:#00e5ff; margin-top:0.3rem; }
  .signature-section { display:flex; justify-content:space-between; margin-top:3rem; padding-top:2rem; border-top:1px solid rgba(0,229,255,0.2); }
  .sig { text-align:center; }
  .sig-line { width:150px; height:1px; background:rgba(0,229,255,0.4); margin:0 auto 0.5rem; }
  .sig-name { font-family:'Orbitron',sans-serif; font-size:0.75rem; color:#e6f1ff; }
  .sig-title { font-size:0.7rem; color:#8892b0; margin-top:0.2rem; }
  .cert-no { position:absolute; bottom:20px; right:30px; font-size:0.7rem; color:#4a5568; font-family:'Orbitron',sans-serif; }
  .stars { color:#00e5ff; font-size:1.5rem; letter-spacing:0.5rem; margin-bottom:2rem; }
  @media print { body { background:white; } .cert { box-shadow:none; } }
</style>
</head>
<body>
<div class="cert">
  <div class="logo">â¬¡ SoftGrowTech</div>
  <div class="tagline">Learn â€¢ Build â€¢ Evolve</div>
  <div class="stars">â˜… â˜… â˜…</div>
  <div class="cert-title">Certificate of Completion</div>
  <div class="presented">This is to proudly certify that</div>
  <div class="name">${internName}</div>
  <div class="desc">
    has successfully completed the internship program in
    <span class="domain">${domain}</span>
    at SoftGrowTech, demonstrating exceptional dedication,
    technical proficiency, and professional growth.
  </div>
  <div class="details">
    <div class="detail-item">
      <div class="detail-label">Duration</div>
      <div class="detail-value">${duration}</div>
    </div>
    <div class="detail-item">
      <div class="detail-label">Domain</div>
      <div class="detail-value">${domain.split(' ')[0]}</div>
    </div>
    <div class="detail-item">
      <div class="detail-label">Issue Date</div>
      <div class="detail-value">${today}</div>
    </div>
    <div class="detail-item">
      <div class="detail-label">Grade</div>
      <div class="detail-value">EXCELLENT</div>
    </div>
  </div>
  <div class="signature-section">
    <div class="sig">
      <div class="sig-line"></div>
      <div class="sig-name">Admin User</div>
      <div class="sig-title">Program Director</div>
    </div>
    <div class="sig">
      <div class="sig-line"></div>
      <div class="sig-name">SoftGrowTech</div>
      <div class="sig-title">Authorized Signatory</div>
    </div>
  </div>
  <div class="cert-no">Cert No: ${certNum}</div>
</div>
<script>
  setTimeout(() => window.print(), 1000);
</script>
</body>
</html>
  `);
  win.document.close();
}

// Init all features on load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  startNotifPolling();
  setTimeout(renderDeadlines, 500);
});
