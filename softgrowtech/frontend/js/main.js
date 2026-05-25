// ===== MAIN.JS — Shared Utilities =====

const API = 'https://softgrowtech-portal.onrender.com/api';

// ===== AUTH HELPERS =====
function getToken() { return localStorage.getItem('token'); }
function getUser() { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } }
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '../pages/login.html';
}
function requireAuth() {
  const token = getToken();
  if (!token) { window.location.href = 'login.html'; return false; }
  return true;
}

// ===== API HELPER =====
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}), ...options.headers };
  try {
    const res = await fetch(`${API}${endpoint}`, { ...options, headers });
    if (res.status === 401) { logout(); return null; }
    return await res.json();
  } catch (err) {
    console.warn('API offline, using demo data:', err.message);
    return null;
  }
}

// ===== DEMO DATA =====
const DEMO_SUBMISSIONS = [
  { id: 1, taskTitle: 'E-Commerce Homepage', projectType: 'E-Commerce Website', description: 'Built responsive homepage with product grid, cart, and navbar using React and Tailwind CSS.', status: 'APPROVED', feedback: 'Excellent work! Clean code and great UI.', submittedAt: '2025-06-01T10:30:00', fileName: 'JohnDoe_WebDev.zip', internName: 'John Doe', domain: 'Web Development' },
  { id: 2, taskTitle: 'User Authentication Module', projectType: 'Internship Management System', description: 'Implemented JWT-based auth with Spring Security, BCrypt password hashing, role-based access.', status: 'REVIEWED', feedback: 'Good implementation. Add refresh token support.', submittedAt: '2025-06-05T14:00:00', fileName: 'JohnDoe_WebDev_Auth.pdf', internName: 'John Doe', domain: 'Web Development' },
  { id: 3, taskTitle: 'Admin Dashboard UI', projectType: 'Internship Management System', description: 'Created admin panel with analytics charts, data tables, and submission review workflow.', status: 'PENDING', feedback: null, submittedAt: '2025-06-10T09:00:00', fileName: 'JohnDoe_WebDev_Admin.zip', internName: 'John Doe', domain: 'Web Development' },
  { id: 4, taskTitle: 'Product Listing API', projectType: 'E-Commerce Website', description: 'REST API endpoints for product CRUD, filtering, pagination using Spring Boot + MySQL.', status: 'PENDING', feedback: null, submittedAt: '2025-06-12T11:00:00', fileName: 'JohnDoe_WebDev_API.zip', internName: 'John Doe', domain: 'Web Development' },
];

const DEMO_INTERNS = [
  { id: 1, fullName: 'Priya Sharma', email: 'priya@example.com', domain: 'Web Development', college: 'IIT Delhi', createdAt: '2025-05-01', submissionCount: 5 },
  { id: 2, fullName: 'Rahul Verma', email: 'rahul@example.com', domain: 'Android Development', college: 'VIT Vellore', createdAt: '2025-05-03', submissionCount: 3 },
  { id: 3, fullName: 'Ananya Singh', email: 'ananya@example.com', domain: 'AI / ML', college: 'NIT Trichy', createdAt: '2025-05-07', submissionCount: 7 },
  { id: 4, fullName: 'Karan Mehta', email: 'karan@example.com', domain: 'UI/UX Design', college: 'BITS Pilani', createdAt: '2025-05-10', submissionCount: 4 },
  { id: 5, fullName: 'Sneha Patel', email: 'sneha@example.com', domain: 'Web Development', college: 'IIIT Hyderabad', createdAt: '2025-05-12', submissionCount: 6 },
];

const DEMO_NOTIFICATIONS = [
  { id: 1, icon: '✅', title: 'Submission Approved!', msg: 'Your task "E-Commerce Homepage" was approved.', time: '2 hours ago', read: false },
  { id: 2, icon: '📝', title: 'Feedback Added', msg: 'Admin reviewed "User Authentication Module". Check feedback.', time: '1 day ago', read: false },
  { id: 3, icon: '📧', title: 'Welcome Email Sent', msg: 'A welcome email was sent to your registered email.', time: '5 days ago', read: true },
];

// ===== TOAST =====
function showToast(title, type = 'success', msg = '') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icon}</span><div><div class="toast-title">${title}</div>${msg ? `<div class="toast-msg">${msg}</div>` : ''}</div>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ===== THEME TOGGLE =====
function toggleTheme() {
  const btn = document.querySelector('.theme-toggle');
  document.body.classList.toggle('light-theme');
  if (btn) btn.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
}

// ===== NAVBAR MOBILE =====
function toggleMenu() {
  document.querySelector('.nav-links')?.classList.toggle('open');
}

// ===== PAGE SWITCHER =====
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  const page = document.getElementById(`page-${pageId}`);
  if (page) { page.style.display = 'block'; }
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.getAttribute('onclick')?.includes(pageId)) n.classList.add('active');
  });
}

// ===== DATE FORMAT =====
function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ===== STATUS BADGE =====
function badgeHtml(status) {
  const s = (status || 'PENDING').toUpperCase();
  return `<span class="badge badge-${s.toLowerCase()}">${s}</span>`;
}

// ===== MODAL =====
function closeModal() { document.getElementById('detailModal')?.classList.add('hidden'); }
function openModal(title, bodyHtml) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  document.getElementById('detailModal')?.classList.remove('hidden');
}

// ===== CSV EXPORT HELPER =====
function downloadCSV(data, filename) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => `"${(row[h] ?? '').toString().replace(/"/g, '""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// ===== DRAG & DROP UPLOAD =====
function initUploadArea() {
  const area = document.getElementById('uploadArea');
  if (!area) return;
  area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('dragover'); });
  area.addEventListener('dragleave', () => area.classList.remove('dragover'));
  area.addEventListener('drop', e => {
    e.preventDefault(); area.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) showFilePreview(file);
  });
}
function handleFileSelect(input) {
  if (input.files[0]) showFilePreview(input.files[0]);
}
function showFilePreview(file) {
  document.getElementById('fileName').textContent = `${file.name} (${(file.size/1024/1024).toFixed(2)} MB)`;
  document.getElementById('filePreview').style.display = 'flex';
}
function clearFile() {
  document.getElementById('fileInput').value = '';
  document.getElementById('filePreview').style.display = 'none';
}

// Init
document.addEventListener('DOMContentLoaded', () => { initUploadArea(); });
