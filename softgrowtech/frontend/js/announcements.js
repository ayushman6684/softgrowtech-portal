// ===== ANNOUNCEMENT SYSTEM =====
let announcements = [
  { id:1, title:'Welcome to SoftGrowTech Portal V2! 🎉', msg:'We have added AI features, gamification, and much more. Explore the new features in your dashboard!', type:'info', author:'Admin', time:'2 hours ago', read:false },
  { id:2, title:'Submission Deadline Reminder ⚠️', msg:'The deadline for Project 2 (Internship Management System) is this Friday. Make sure to submit before 11:59 PM.', type:'warning', author:'Admin', time:'1 day ago', read:false },
  { id:3, title:'New AI Features Added 🤖', msg:'AI Code Reviewer, Performance Analyzer, and Plagiarism Checker are now available in your dashboard sidebar.', type:'success', author:'Admin', time:'2 days ago', read:true },
];

function renderAnnouncements() {
  const container = document.getElementById('announcementList');
  if (!container) return;
  if (!announcements.length) { container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:3rem">No announcements</p>'; return; }
  container.innerHTML = announcements.map(a => `
    <div style="padding:1.5rem;border-radius:10px;margin-bottom:1rem;
      background:${a.read?'rgba(0,229,255,0.02)':'rgba(0,229,255,0.05)'};
      border:1px solid ${a.read?'var(--border)':a.type==='warning'?'rgba(255,193,7,0.4)':a.type==='success'?'rgba(76,175,80,0.4)':'rgba(0,229,255,0.3)'};
      border-left:4px solid ${a.type==='warning'?'#ffc107':a.type==='success'?'#4caf50':'var(--cyan)'}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem">
        <div style="font-weight:700;font-size:0.95rem;color:${a.read?'var(--text-primary)':'white'}">${a.title}</div>
        ${!a.read?'<span style="width:8px;height:8px;border-radius:50%;background:var(--cyan);flex-shrink:0;margin-top:4px"></span>':''}
      </div>
      <p style="font-size:0.875rem;color:var(--text-secondary);line-height:1.6;margin-bottom:0.75rem">${a.msg}</p>
      <div style="font-size:0.75rem;color:var(--text-muted)">By ${a.author} · ${a.time}</div>
    </div>`).join('');
  
  // Update badge
  const unread = announcements.filter(a=>!a.read).length;
  const badge = document.getElementById('announceBadge');
  if (badge) { badge.textContent = unread; badge.style.display = unread?'inline':'none'; }
}

function markAnnouncementsRead() {
  announcements.forEach(a=>a.read=true);
  renderAnnouncements();
  showToast('All announcements marked as read', 'success');
}

// Admin: add announcement
function addAnnouncement(title, msg, type='info') {
  announcements.unshift({ id:Date.now(), title, msg, type, author:'Admin', time:'Just now', read:false });
  renderAnnouncements();
}

// Check for new announcements every 60s
setInterval(() => {
  // In real app, fetch from API
}, 60000);
