// ===== DASHBOARD.JS =====

let allSubmissions = [...DEMO_SUBMISSIONS];
let activityChart = null;

document.addEventListener('DOMContentLoaded', async () => {
  if (!getToken()) { window.location.href = 'login.html'; return; }
  const user = getUser();
  if (user?.role === 'ADMIN') { window.location.href = 'admin.html'; return; }

  const name = user?.fullName || 'Intern';
  const initials = name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
  document.getElementById('userName').textContent = name;
  document.getElementById('greetName').textContent = name.split(' ')[0];
  document.getElementById('avatarEl').textContent = initials;
  document.getElementById('profileAvatar').textContent = initials;
  document.getElementById('profileName').textContent = name;
  document.getElementById('profileDomain').textContent = user?.domain || 'Web Development';

  if (user) {
    document.getElementById('pName').value = user.fullName || '';
    document.getElementById('pEmail').value = user.email || '';
    document.getElementById('pPhone').value = user.phone || '+91 9876543210';
    document.getElementById('pCollege').value = user.college || 'Demo College';
  }

  await loadSubmissions();
  renderOverview();
  renderNotifications();
  startPolling();
});

async function loadSubmissions() {
  try {
    const data = await apiRequest("/submissions/my");
    allSubmissions = (data?.submissions?.length > 0) ? data.submissions : DEMO_SUBMISSIONS;
  } catch {
    allSubmissions = DEMO_SUBMISSIONS;
  }
  if (!allSubmissions || allSubmissions.length === 0) allSubmissions = DEMO_SUBMISSIONS;
}

function renderOverview() {
  const total = allSubmissions.length;
  const approved = allSubmissions.filter(s=>s.status==='APPROVED').length;
  const pending = allSubmissions.filter(s=>s.status==='PENDING').length;
  const pct = total ? Math.round((approved/total)*100) : 0;

  document.getElementById('pendingBadge').textContent = pending;
  document.getElementById('domainLabel').textContent = getUser()?.domain || 'Web Development';
  document.getElementById('domainPct').textContent = pct + '%';
  setTimeout(() => { document.getElementById('domainBar').style.width = pct + '%'; }, 300);

  // Force set numbers
  setTimeout(() => {
    document.getElementById('totalSubmissions').textContent = total;
    document.getElementById('approvedCount').textContent = approved;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('progressPct').textContent = pct + '%';
  }, 100);

  renderRecentSubmissions();
  renderActivityChart();
}

function renderRecentSubmissions() {
  const container = document.getElementById('recentSubmissions');
  const recent = allSubmissions.slice(-3).reverse();
  if (!recent.length) { container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem">No submissions yet</p>'; return; }
  container.innerHTML = recent.map(s => `
    <div class="submission-card">
      <div class="sub-header">
        <div>
          <div class="sub-title">${s.taskTitle}</div>
          <div class="sub-meta">${s.projectType} ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· ${fmtDate(s.submittedAt)}</div>
        </div>
        ${badgeHtml(s.status)}
      </div>
      ${s.feedback ? `<div style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.5rem;padding:0.5rem;background:rgba(0,229,255,0.05);border-radius:6px">ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€šÃ‚Â¬ ${s.feedback}</div>` : ''}
    </div>
  `).join('');
}

function renderActivityChart() {
  const ctx = document.getElementById('activityChart')?.getContext('2d');
  if (!ctx) return;
  if (activityChart) activityChart.destroy();
  const months = ['Jan','Feb','Mar','Apr','May','Jun'];
  const data = months.map((_, i) => allSubmissions.filter(s => new Date(s.submittedAt).getMonth() === i).length);
  activityChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Submissions', data,
        borderColor: '#00e5ff', backgroundColor: 'rgba(0,229,255,0.08)',
        fill: true, tension: 0.4, pointBackgroundColor: '#00e5ff', pointRadius: 4,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(0,229,255,0.05)' }, ticks: { color: '#8892b0' } },
        y: { grid: { color: 'rgba(0,229,255,0.05)' }, ticks: { color: '#8892b0', stepSize: 1 }, beginAtZero: true }
      }
    }
  });
}

// ===== SUBMISSION FORM =====
async function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.innerHTML = '<span class="spinner"></span> Submitting...';
  btn.disabled = true;
  document.getElementById('submit-alert').innerHTML = '';

  const fileInput = document.getElementById('fileInput');
  const formData = new FormData();
  const user = getUser();
  formData.append('taskTitle', document.getElementById('taskTitle').value);
  formData.append('projectType', document.getElementById('projectType').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('projectUrl', document.getElementById('projectUrl').value);
  if (fileInput.files[0]) {
    formData.append('file', fileInput.files[0]);
  }

  try {
    const res = await fetch(`${API}/submissions/submit`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData
    });
    if (res.ok) {
      handleSuccess();
    } else {
      throw new Error('API error');
    }
  } catch {
    const newSub = {
      id: allSubmissions.length + 1,
      taskTitle: document.getElementById('taskTitle').value,
      projectType: document.getElementById('projectType').value,
      description: document.getElementById('description').value,
      status: 'PENDING', feedback: null,
      submittedAt: new Date().toISOString(),
      fileName: fileInput.files[0]?.name || null,
    };
    allSubmissions.push(newSub);
    handleSuccess();
  }
  btn.innerHTML = 'Submit Task ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢'; btn.disabled = false;
}

function handleSuccess() {
  showToast('Task Submitted!', 'success', 'Your submission is pending review.');
  document.getElementById('submitForm').reset();
  clearFile();
  document.getElementById('submit-alert').innerHTML = '<div class="alert alert-success">Submission received! Redirecting...</div>';
  renderOverview();
  setTimeout(() => showPage('overview'), 2000);
}

// ===== SUBMISSIONS LIST =====
let currentFilter = 'all';
function filterSubs(status) {
  currentFilter = status;
  document.querySelectorAll('#page-submissions .icon-btn').forEach((b,i) => {
    const statuses = ['all','PENDING','APPROVED','REVIEWED','REJECTED'];
    b.classList.toggle('active', statuses[i] === status);
  });
  renderSubmissionsList();
}

function renderSubmissionsList() {
  const list = document.getElementById('submissionsList');
  const filtered = currentFilter === 'all' ? allSubmissions : allSubmissions.filter(s => s.status === currentFilter);
  if (!filtered.length) { list.innerHTML = '<p style="text-align:center;padding:3rem;color:var(--text-muted)">No submissions found</p>'; return; }
  list.innerHTML = filtered.map(s => `
    <div class="submission-card">
      <div class="sub-header">
        <div>
          <div class="sub-title">${s.taskTitle}</div>
          <div class="sub-meta">${s.projectType} ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Submitted ${fmtDate(s.submittedAt)}</div>
        </div>
        ${badgeHtml(s.status)}
      </div>
      <p style="font-size:0.85rem;color:var(--text-secondary);margin:0.5rem 0">${(s.description||'').slice(0,120)}...</p>
      ${s.feedback ? `<div style="font-size:0.8rem;color:var(--text-secondary);padding:0.5rem;background:rgba(0,229,255,0.05);border-radius:6px;margin-top:0.5rem">ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€šÃ‚Â¬ ${s.feedback}</div>` : ''}
      <div class="sub-actions">
        ${s.fileName ? `<button class="icon-btn" onclick="showToast('Download ready','info')">ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€¦Ã‚Â½ ${s.fileName}</button>` : ''}
        <button class="icon-btn" onclick="viewDetail(${s.id})">View Details</button>
      </div>
    </div>
  `).join('');
}

function viewDetail(id) {
  const s = allSubmissions.find(x=>x.id===id);
  if (!s) return;
  const body = `
    <div style="font-size:0.875rem">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div><span style="color:var(--text-muted)">Project:</span><br/>${s.projectType}</div>
        <div><span style="color:var(--text-muted)">Status:</span><br/>${badgeHtml(s.status)}</div>
        <div><span style="color:var(--text-muted)">Submitted:</span><br/>${fmtDate(s.submittedAt)}</div>
        <div><span style="color:var(--text-muted)">File:</span><br/>${s.fileName||'No file'}</div>
      </div>
      <div style="color:var(--text-muted);margin-bottom:0.5rem">Description:</div>
      <p style="background:rgba(0,229,255,0.04);padding:0.75rem;border-radius:8px;line-height:1.6">${s.description||''}</p>
      ${s.feedback ? `<div style="margin-top:1rem;color:var(--text-muted)">Feedback:</div><p style="background:rgba(0,255,204,0.05);border:1px solid rgba(0,255,204,0.2);padding:0.75rem;border-radius:8px;margin-top:0.5rem">${s.feedback}</p>` : ''}
    </div>
  `;
  openModal(s.taskTitle, body);
}

// ===== NOTIFICATIONS =====
let notifications = [
  { id:1, icon:'ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦', title:'Submission Approved!', msg:'Your task "E-Commerce Homepage" was approved.', time:'2 hours ago', read:false },
  { id:2, icon:'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â', title:'Feedback Added', msg:'Admin reviewed your submission. Check feedback.', time:'1 day ago', read:false },
  { id:3, icon:'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â§', title:'Welcome Email Sent', msg:'A welcome email was sent to your registered email.', time:'5 days ago', read:true },
];

function renderNotifications() {
  const unread = notifications.filter(n=>!n.read).length;
  document.getElementById('notifBadge').textContent = unread;
  document.getElementById('notifBadge').style.display = unread ? 'inline' : 'none';
  const list = document.getElementById('notifList');
  if (!list) return;
  list.innerHTML = notifications.map(n => `
    <div style="display:flex;gap:1rem;padding:1rem;border-radius:8px;margin-bottom:0.75rem;background:${n.read?'transparent':'rgba(0,229,255,0.04)'};border:1px solid ${n.read?'transparent':'rgba(0,229,255,0.1)'}">
      <span style="font-size:1.4rem">&#9679;</span>
      <div>
        <div style="font-weight:600;font-size:0.9rem">${n.title}</div>
        <div style="color:var(--text-secondary);font-size:0.8rem;margin-top:0.2rem">${n.msg}</div>
        <div style="color:var(--text-muted);font-size:0.75rem;margin-top:0.25rem">${n.time}</div>
      </div>
      ${!n.read ? `<span style="width:8px;height:8px;border-radius:50%;background:var(--cyan);flex-shrink:0;margin-top:0.25rem"></span>` : ''}
    </div>
  `).join('');
}

function clearAllNotifs() { notifications.forEach(n=>n.read=true); renderNotifications(); showToast('All cleared!','success'); }

// ===== PASSWORD CHANGE =====
async function changePassword(e) {
  e.preventDefault();
  const newPwd = document.getElementById('newPwd').value;
  const confirmPwd = document.getElementById('confirmPwd').value;
  if (newPwd !== confirmPwd) { document.getElementById('pwd-alert').innerHTML = '<div class="alert alert-error">Passwords do not match</div>'; return; }
  document.getElementById('pwd-alert').innerHTML = '<div class="alert alert-success">Password updated!</div>';
  e.target.reset();
}

// ===== POLLING =====
function startPolling() {
  setInterval(async () => {
    const data = await apiRequest('/submissions/my');
    if (data?.submissions) { allSubmissions = data.submissions; renderOverview(); }
  }, 30000);
}

// Override showPage
const _origShowPage = showPage;
window.showPage = function(pageId) {
  _origShowPage(pageId);
  setTimeout(() => {
    if (pageId === 'submissions') renderSubmissionsList();
    if (pageId === 'notifications') renderNotifications();
    if (pageId === 'gamification' && typeof renderGamification==='function') renderGamification();
    if (pageId === 'leaderboard' && typeof renderLeaderboard==='function') renderLeaderboard();
    if (pageId === 'announcements' && typeof renderAnnouncements==='function') renderAnnouncements();
  }, 100);
};

// Icon btn style
const style = document.createElement('style');
style.textContent = `.icon-btn.active { color: var(--cyan); border-color: var(--border-hover); background: rgba(0,229,255,0.08); }`;
document.head.appendChild(style);
