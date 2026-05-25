// ===== ADMIN.JS =====

let adminSubmissions = [];
let adminInterns = [];
let currentReviewId = null;
let domainChart = null, weeklyChart = null;

document.addEventListener('DOMContentLoaded', async () => {
  if (!getToken()) { window.location.href = 'login.html'; return; }
  const user = getUser();
  if (user?.role !== 'ADMIN') { window.location.href = 'dashboard.html'; return; }
  document.getElementById('adminName').textContent = user?.fullName || 'Admin';
  await refreshData();
});

async function refreshData() {
  // Load from backend
  const [subsData, internsData] = await Promise.all([
    apiRequest('/admin/submissions'),
    apiRequest('/admin/interns')
  ]);

  // Use backend data or fallback demo
  adminSubmissions = (subsData?.submissions?.length > 0) ? subsData.submissions : [
    { id:1, internId:1, internName:'Priya Sharma', domain:'Web Development', taskTitle:'E-Commerce Homepage', projectType:'E-Commerce Website', status:'APPROVED', feedback:'Great work!', submittedAt:'2025-06-01T10:30:00', fileName:'Priya_WebDev.zip' },
    { id:2, internId:2, internName:'Rahul Verma', domain:'Android Development', taskTitle:'Login Screen UI', projectType:'Android App', status:'PENDING', feedback:null, submittedAt:'2025-06-05T14:00:00', fileName:null },
    { id:3, internId:3, internName:'Ananya Singh', domain:'AI / ML', taskTitle:'Sentiment Analysis Model', projectType:'AI/ML Model', status:'REVIEWED', feedback:'Add more training data', submittedAt:'2025-06-08T09:00:00', fileName:'Ananya_AIML.zip' },
    { id:4, internId:4, internName:'Karan Mehta', domain:'UI/UX Design', taskTitle:'Dashboard Wireframe', projectType:'UI/UX Design', status:'PENDING', feedback:null, submittedAt:'2025-06-10T11:00:00', fileName:null },
    { id:5, internId:5, internName:'Sneha Patel', domain:'Web Development', taskTitle:'REST API Development', projectType:'E-Commerce Website', status:'REJECTED', feedback:'Needs better error handling', submittedAt:'2025-06-12T13:00:00', fileName:'Sneha_WebDev.pdf' },
  ];

  adminInterns = (internsData?.interns?.length > 0) ? internsData.interns : [
    { id:1, fullName:'Priya Sharma', email:'priya@example.com', domain:'Web Development', college:'IIT Delhi', createdAt:'2025-05-01', submissionCount:5 },
    { id:2, fullName:'Rahul Verma', email:'rahul@example.com', domain:'Android Development', college:'VIT Vellore', createdAt:'2025-05-03', submissionCount:3 },
    { id:3, fullName:'Ananya Singh', email:'ananya@example.com', domain:'AI / ML', college:'NIT Trichy', createdAt:'2025-05-07', submissionCount:7 },
    { id:4, fullName:'Karan Mehta', email:'karan@example.com', domain:'UI/UX Design', college:'BITS Pilani', createdAt:'2025-05-10', submissionCount:4 },
    { id:5, fullName:'Sneha Patel', email:'sneha@example.com', domain:'Web Development', college:'IIIT Hyderabad', createdAt:'2025-05-12', submissionCount:6 },
  ];

  renderAnalytics();
}

function renderAnalytics() {
  const total = adminInterns.length;
  const subs = adminSubmissions.length;
  const pending = adminSubmissions.filter(s=>s.status==='PENDING').length;
  const approved = adminSubmissions.filter(s=>s.status==='APPROVED').length;

  setTimeout(()=>{document.getElementById('totalInterns').textContent=total;document.getElementById('totalSubs').textContent=subs;document.getElementById('pendingSubs').textContent=pending;document.getElementById('approvedSubs').textContent=approved;},100);
  
  
  
  document.getElementById('newSubBadge').textContent = pending;

  renderRecentTable();
  renderDomainChart();
  renderWeeklyChart();
}

function renderRecentTable() {
  const tbody = document.getElementById('recentSubsTable');
  if (!tbody) return;
  const pending = adminSubmissions.filter(s=>s.status==='PENDING').slice(0,5);
  if (!pending.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:2rem">No pending submissions</td></tr>';
    return;
  }
  tbody.innerHTML = pending.map(s => `
    <tr>
      <td style="color:var(--text-primary)">${s.internName}</td>
      <td>${s.taskTitle}</td>
      <td><span style="font-size:0.78rem;color:var(--cyan)">${s.domain}</span></td>
      <td>${fmtDate(s.submittedAt)}</td>
      <td>${badgeHtml(s.status)}</td>
      <td><button class="icon-btn" onclick="openReview(${s.id})">Review ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢</button></td>
    </tr>
  `).join('');
}

function renderDomainChart() {
  const ctx = document.getElementById('domainChart')?.getContext('2d');
  if (!ctx) return;
  if (domainChart) domainChart.destroy();
  const domains = ['Web Development','Android Development','AI / ML','UI/UX Design','Data Science','Cloud DevOps'];
  const counts = domains.map(d => adminSubmissions.filter(s=>s.domain===d).length);
  domainChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Web Dev','Android','AI/ML','UI/UX','Data Sci','DevOps'],
      datasets: [{ data: counts, backgroundColor: ['#00e5ff','#00ffcc','#7c4dff','#ff6b6b','#ffc107','#4caf50'], borderWidth: 0 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position:'bottom', labels: { color:'#8892b0', padding:12, font:{size:11} } } }
    }
  });
}

function renderWeeklyChart() {
  const ctx = document.getElementById('weeklyChart')?.getContext('2d');
  if (!ctx) return;
  if (weeklyChart) weeklyChart.destroy();
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const data = days.map(() => Math.floor(Math.random() * 8 + 1));
  weeklyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [{ label:'Submissions', data, backgroundColor:'rgba(0,229,255,0.25)', borderColor:'#00e5ff', borderWidth:1, borderRadius:4 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend:{display:false} },
      scales: {
        x: { grid:{color:'rgba(0,229,255,0.05)'}, ticks:{color:'#8892b0'} },
        y: { grid:{color:'rgba(0,229,255,0.05)'}, ticks:{color:'#8892b0', stepSize:2}, beginAtZero:true }
      }
    }
  });
}

function loadAdminSubmissions() {
  const domain = document.getElementById('filterDomain').value;
  const status = document.getElementById('filterStatus').value;
  const q = document.getElementById('searchQuery').value.toLowerCase();
  let filtered = adminSubmissions;
  if (domain) filtered = filtered.filter(s=>s.domain===domain);
  if (status) filtered = filtered.filter(s=>s.status===status);
  if (q) filtered = filtered.filter(s=>s.internName?.toLowerCase().includes(q)||s.taskTitle?.toLowerCase().includes(q));

  const tbody = document.getElementById('allSubsTable');
  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:2rem">No submissions found</td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map((s,i) => `
    <tr>
      <td style="color:var(--text-muted)">${i+1}</td>
      <td style="color:var(--text-primary);font-weight:600">${s.internName}</td>
      <td>${s.taskTitle}</td>
      <td><span style="font-size:0.78rem;color:var(--cyan)">${s.projectType}</span></td>
      <td>${fmtDate(s.submittedAt)}</td>
      <td>${badgeHtml(s.status)}</td>
      <td>
        <div style="display:flex;gap:0.4rem">
          <button class="icon-btn" onclick="openReview(${s.id})">Review</button>
          ${s.fileName ? `<button class="icon-btn" onclick="showToast('${s.fileName}','info')">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã…Â½</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function loadInterns() {
  const q = document.getElementById('internSearch').value.toLowerCase();
  const domain = document.getElementById('internDomainFilter').value;
  let filtered = adminInterns;
  if (q) filtered = filtered.filter(i=>i.fullName.toLowerCase().includes(q)||i.email.toLowerCase().includes(q));
  if (domain) filtered = filtered.filter(i=>i.domain===domain);

  const tbody = document.getElementById('internsTable');
  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:2rem">No interns found</td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map((intern,i) => `
    <tr>
      <td style="color:var(--text-muted)">${i+1}</td>
      <td style="color:var(--text-primary);font-weight:600">${intern.fullName}</td>
      <td style="color:var(--text-secondary)">${intern.email}</td>
      <td><span style="color:var(--cyan);font-size:0.8rem">${intern.domain}</span></td>
      <td style="color:var(--text-secondary)">${intern.college}</td>
      <td>${fmtDate(intern.createdAt)}</td>
      <td style="text-align:center;color:var(--cyan)">${intern.submissionCount||0}</td>
      <td>
        <div style="display:flex;gap:0.4rem">
          <button class="icon-btn" onclick="showToast('Viewing ${intern.fullName}','info')">View</button>
          <button class="icon-btn danger" onclick="confirmDelete(${intern.id},'${intern.fullName}')">Remove</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function confirmDelete(id, name) {
  if (confirm(`Remove intern "${name}"? This cannot be undone.`)) {
    adminInterns = adminInterns.filter(i=>i.id!==id);
    apiRequest(`/admin/interns/${id}`, { method:'DELETE' });
    loadInterns();
    showToast(`${name} removed`, 'error');
  }
}

function openReview(subId) {
  currentReviewId = subId;
  const s = adminSubmissions.find(x=>x.id===subId);
  if (!s) return;
  document.getElementById('reviewContent').innerHTML = `
    <div style="background:rgba(0,229,255,0.04);border:1px solid var(--border);border-radius:8px;padding:1rem;font-size:0.875rem">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
        <div><span style="color:var(--text-muted)">Intern:</span><br/><strong>${s.internName}</strong></div>
        <div><span style="color:var(--text-muted)">Domain:</span><br/><span style="color:var(--cyan)">${s.domain}</span></div>
        <div><span style="color:var(--text-muted)">Task:</span><br/>${s.taskTitle}</div>
        <div><span style="color:var(--text-muted)">Project:</span><br/>${s.projectType}</div>
        <div><span style="color:var(--text-muted)">Status:</span><br/>${badgeHtml(s.status)}</div>
        <div><span style="color:var(--text-muted)">Date:</span><br/>${fmtDate(s.submittedAt)}</div>
      </div>
      ${s.fileName ? `<button class="icon-btn" onclick="showToast('Downloading: ${s.fileName}','info')">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã…Â½ ${s.fileName}</button>` : ''}
    </div>
    ${s.feedback ? `<div style="margin-top:0.75rem;font-size:0.85rem;color:var(--text-muted)">Previous feedback: <em>${s.feedback}</em></div>` : ''}
  `;
  document.getElementById('feedbackText').value = s.feedback || '';
  document.getElementById('reviewModal').classList.remove('hidden');
}

function closeReviewModal() { document.getElementById('reviewModal').classList.add('hidden'); currentReviewId = null; }

async function updateStatus(status) {
  if (!currentReviewId) return;
  const feedback = document.getElementById('feedbackText').value;
  try {
    await apiRequest(`/admin/submissions/${currentReviewId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, feedback })
    });
  } catch {}
  const sub = adminSubmissions.find(s=>s.id===currentReviewId);
  if (sub) { sub.status = status; sub.feedback = feedback; }
  closeReviewModal();
  renderAnalytics();
  loadAdminSubmissions();
  showToast(`Submission ${status.toLowerCase()}!`, status==='REJECTED'?'error':'success');
}

function exportSubmissions() {
  const data = adminSubmissions.map(s => ({
    ID:s.id, Intern:s.internName, Domain:s.domain,
    Task:s.taskTitle, Project:s.projectType,
    Status:s.status, Feedback:s.feedback||'', Date:fmtDate(s.submittedAt)
  }));
  downloadCSV(data, 'submissions.csv');
  showToast('CSV downloaded!', 'success');
}

function exportInterns() {
  const data = adminInterns.map(i => ({
    ID:i.id, Name:i.fullName, Email:i.email,
    Domain:i.domain, College:i.college,
    Joined:fmtDate(i.createdAt), Submissions:i.submissionCount||0
  }));
  downloadCSV(data, 'interns.csv');
  showToast('CSV downloaded!', 'success');
}

const _adminOrig = showPage;
window.showPage = function(pageId) {
  _adminOrig(pageId);
  if (pageId === 'submissions') setTimeout(loadAdminSubmissions, 100);
  if (pageId === 'interns') setTimeout(loadInterns, 100);
};

function bulkDownloadZip() {
  const token = localStorage.getItem('token');
  showToast('Preparing ZIP...', 'info');
  fetch('http://localhost:8080/api/admin/submissions/download-zip', {
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(r => {
    if (!r.ok) throw new Error('No files');
    return r.blob();
  }).then(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'all_submissions.zip';
    a.click();
    showToast('Downloaded!', 'success');
  }).catch(() => showToast('No uploaded files found', 'error'));
}