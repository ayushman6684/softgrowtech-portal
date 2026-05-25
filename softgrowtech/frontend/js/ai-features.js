// ===== AI FEATURES — Using Groq API =====
const GROQ_API = 'Your api key here';
const GROQ_KEY ='REDACTED'
; // <-- Yahan apni Groq key daalo

async function callAI(prompt, maxTokens = 500, systemPrompt = '') {
  const messages = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });

  const response = await fetch(GROQ_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + GROQ_KEY
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: maxTokens,
      messages: messages
    })
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices?.[0]?.message?.content || 'No response';
}

// ===== 1. AI TASK FEEDBACK =====
async function getAIFeedback(taskTitle, description, projectType) {
  const btn = document.getElementById('aiFeedbackBtn');
  const result = document.getElementById('aiFeedbackResult');
  if (!taskTitle || !description) { showToast('Fill task details first!', 'error'); return; }
  if (btn) { btn.innerHTML = '<span class="spinner"></span> AI analyzing...'; btn.disabled = true; }
  if (result) result.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:1rem">Analyzing your submission...</div>';

  try {
    const feedback = await callAI(
      `Review this intern submission:\nTask: ${taskTitle}\nProject: ${projectType}\nDescription: ${description}\n\nProvide feedback with:\nSCORE: X/10\nSTRENGTHS: bullet points\nIMPROVEMENTS: specific suggestions\nNEXT_STEPS: recommended actions\n\nBe encouraging and concise.`,
      400,
      'You are a senior software engineering mentor at SoftGrowTech internship program.'
    );
    if (result) result.innerHTML = `
      <div style="background:rgba(0,229,255,0.05);border:1px solid rgba(0,229,255,0.2);border-radius:10px;padding:1.5rem;margin-top:1rem">
        <div style="font-family:var(--font-head);font-size:0.85rem;color:var(--cyan);margin-bottom:1rem">🤖 AI FEEDBACK</div>
        <div style="font-size:0.875rem;line-height:1.8;white-space:pre-wrap;color:var(--text-secondary)">${feedback}</div>
      </div>`;
    showToast('AI feedback ready!', 'success');
  } catch(e) {
    if (result) result.innerHTML = `<div class="alert alert-error">AI Error: ${e.message}</div>`;
  }
  if (btn) { btn.innerHTML = '🤖 Get AI Feedback'; btn.disabled = false; }
}

// ===== 2. AI CHATBOT =====
let chatHistory = [];

async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const msg = input?.value?.trim();
  if (!msg) return;
  input.value = '';
  appendChatMessage('user', msg);
  chatHistory.push({ role: 'user', content: msg });
  const typingEl = appendChatMessage('assistant', '<span class="spinner"></span>', true);

  try {
    const messages = [
      { role: 'system', content: 'You are SGT Assistant, a helpful AI for SoftGrowTech internship portal. Help interns with coding questions, project guidance, career advice. Be friendly, concise, and encouraging.' },
      ...chatHistory.slice(-10)
    ];

    const response = await fetch(GROQ_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GROQ_KEY },
      body: JSON.stringify({ model: 'llama-3.1-8b-instant', max_tokens: 300, messages })
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm having trouble. Please try again!";
    chatHistory.push({ role: 'assistant', content: reply });
    if (typingEl) typingEl.remove();
    appendChatMessage('assistant', reply);
  } catch(e) {
    if (typingEl) typingEl.remove();
    appendChatMessage('assistant', 'Sorry, I am offline right now. Please try again later!');
  }
}

function appendChatMessage(role, text, isTyping = false) {
  const container = document.getElementById('chatMessages');
  if (!container) return null;
  const div = document.createElement('div');
  div.style.cssText = `display:flex;gap:0.75rem;margin-bottom:1rem;${role==='user'?'flex-direction:row-reverse':''}`;
  div.innerHTML = `
    <div style="width:32px;height:32px;border-radius:50%;background:${role==='user'?'linear-gradient(135deg,var(--cyan),#005f73)':'linear-gradient(135deg,#7c4dff,#4a148c)'};
      display:flex;align-items:center;justify-content:center;font-size:0.8rem;flex-shrink:0;color:white">
      ${role==='user'?'U':'AI'}
    </div>
    <div style="max-width:75%;padding:0.75rem 1rem;border-radius:${role==='user'?'12px 4px 12px 12px':'4px 12px 12px 12px'};
      background:${role==='user'?'rgba(0,229,255,0.15)':'rgba(124,77,255,0.15)'};
      border:1px solid ${role==='user'?'rgba(0,229,255,0.3)':'rgba(124,77,255,0.3)'};
      font-size:0.875rem;line-height:1.6;color:var(--text-primary)">
      ${text}
    </div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function handleChatKeyPress(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
}

// ===== 3. AI PERFORMANCE ANALYZER =====
async function analyzePerformance() {
  const btn = document.getElementById('analyzeBtn');
  const result = document.getElementById('analysisResult');
  if (btn) { btn.innerHTML = '<span class="spinner"></span> Analyzing...'; btn.disabled = true; }

  const submissions = typeof allSubmissions !== 'undefined' ? allSubmissions : [];
  const user = typeof getUser === 'function' ? getUser() : {};
  const approved = submissions.filter(s=>s.status==='APPROVED').length;
  const pending = submissions.filter(s=>s.status==='PENDING').length;
  const total = submissions.length;

  try {
    const analysis = await callAI(
      `Analyze intern performance:\nName: ${user?.fullName}\nDomain: ${user?.domain}\nTotal Submissions: ${total}\nApproved: ${approved}\nPending: ${pending}\nApproval Rate: ${total?Math.round((approved/total)*100):0}%\n\nProvide:\nOVERALL_RATING: X/10\nPERFORMANCE_SUMMARY:\nKEY_STRENGTHS:\nAREAS_TO_IMPROVE:\nCAREER_RECOMMENDATION:\nFINAL_MESSAGE:`,
      600,
      'You are a professional HR analyst at SoftGrowTech. Provide data-driven, encouraging performance analysis.'
    );
    if (result) result.innerHTML = `
      <div style="background:rgba(124,77,255,0.05);border:1px solid rgba(124,77,255,0.3);border-radius:10px;padding:1.5rem;margin-top:1rem">
        <div style="font-family:var(--font-head);font-size:0.85rem;color:#ce93d8;margin-bottom:1rem">AI PERFORMANCE ANALYSIS</div>
        <div style="font-size:0.875rem;line-height:1.8;white-space:pre-wrap;color:var(--text-secondary)">${analysis}</div>
      </div>`;
    showToast('Analysis complete!', 'success');
  } catch(e) {
    if (result) result.innerHTML = `<div class="alert alert-error">Error: ${e.message}</div>`;
  }
  if (btn) { btn.innerHTML = 'Analyze My Performance'; btn.disabled = false; }
}

// ===== 4. AI PLAGIARISM DETECTOR =====
async function checkPlagiarism() {
  const text = document.getElementById('plagiarismText')?.value;
  const btn = document.getElementById('plagiarismBtn');
  const result = document.getElementById('plagiarismResult');
  if (!text || text.length < 50) { showToast('Enter at least 50 characters', 'error'); return; }
  if (btn) { btn.innerHTML = '<span class="spinner"></span> Checking...'; btn.disabled = true; }

  try {
    const check = await callAI(
      `Analyze this text for plagiarism and AI-generated content:\n"${text}"\n\nProvide:\nORIGINALITY_SCORE: X%\nPLAGIARISM_RISK: Low/Medium/High\nAI_GENERATED_PROBABILITY: X%\nINDICATORS: specific patterns found\nVERDICT: conclusion\nRECOMMENDATION: action to take`,
      400,
      'You are a plagiarism detection expert. Analyze text for copied or AI-generated content.'
    );
    const isHigh = check.includes('High');
    if (result) result.innerHTML = `
      <div style="background:rgba(${isHigh?'239,83,80':'0,229,255'},0.05);border:1px solid rgba(${isHigh?'239,83,80':'0,229,255'},0.3);border-radius:10px;padding:1.5rem;margin-top:1rem">
        <div style="font-family:var(--font-head);font-size:0.85rem;color:${isHigh?'#ff6b6b':'var(--cyan)'};margin-bottom:1rem">
          ${isHigh?'WARNING':'CHECK RESULT'}
        </div>
        <div style="font-size:0.875rem;line-height:1.8;white-space:pre-wrap;color:var(--text-secondary)">${check}</div>
      </div>`;
  } catch(e) {
    if (result) result.innerHTML = `<div class="alert alert-error">Error: ${e.message}</div>`;
  }
  if (btn) { btn.innerHTML = 'Check Plagiarism'; btn.disabled = false; }
}

// ===== 5. AI REPORT GENERATOR =====
async function generateAIReport() {
  const btn = document.getElementById('reportBtn');
  const result = document.getElementById('reportResult');
  if (btn) { btn.innerHTML = '<span class="spinner"></span> Generating...'; btn.disabled = true; }

  const submissions = typeof allSubmissions !== 'undefined' ? allSubmissions : [];
  const user = typeof getUser === 'function' ? getUser() : {};

  try {
    const report = await callAI(
      `Generate a professional internship performance report:\nName: ${user?.fullName}\nDomain: ${user?.domain}\nCollege: ${user?.college}\nDuration: ${user?.duration}\nTotal Tasks: ${submissions.length}\nCompleted: ${submissions.filter(s=>s.status==='APPROVED').length}\n\nInclude:\n1. Executive Summary\n2. Technical Skills Assessment\n3. Project Contributions\n4. Professional Development\n5. Areas of Excellence\n6. Recommendations\n7. Overall Grade`,
      800,
      'You are a professional HR writer. Write formal internship performance reports for college submission.'
    );
    if (result) result.innerHTML = `
      <div style="background:rgba(0,229,255,0.03);border:1px solid var(--border);border-radius:10px;padding:2rem;margin-top:1rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
          <div style="font-family:var(--font-head);font-size:0.85rem;color:var(--cyan)">AI GENERATED REPORT</div>
          <button onclick="printReport()" class="btn-outline" style="font-size:0.75rem;padding:0.4rem 1rem">Print / Save PDF</button>
        </div>
        <div id="reportContent" style="font-size:0.875rem;line-height:2;white-space:pre-wrap;color:var(--text-secondary)">${report}</div>
      </div>`;
    showToast('Report generated!', 'success');
  } catch(e) {
    if (result) result.innerHTML = `<div class="alert alert-error">Error: ${e.message}</div>`;
  }
  if (btn) { btn.innerHTML = 'Generate AI Report'; btn.disabled = false; }
}

function printReport() {
  const content = document.getElementById('reportContent')?.innerText;
  const user = typeof getUser === 'function' ? getUser() : {};
  const win = window.open('', '_blank');
  win.document.write(`<html><head><title>Report - ${user?.fullName}</title>
    <style>body{font-family:Arial;max-width:800px;margin:40px auto;line-height:1.8}pre{white-space:pre-wrap;font-family:inherit}</style></head>
    <body><h1>SoftGrowTech Performance Report</h1><hr/><pre>${content}</pre></body></html>`);
  win.document.close(); win.print();
}

// ===== CERTIFICATE GENERATOR =====
function generateCertificate(internName, domain, duration) {
  const user = typeof getUser === 'function' ? getUser() : {};
  internName = internName || user?.fullName || 'Intern Name';
  domain = domain || user?.domain || 'Web Development';
  duration = duration || user?.duration || '3 Months';
  const today = new Date().toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'});
  const certNum = 'SGT-' + Date.now().toString().slice(-6);
  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Certificate - ${internName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap" rel="stylesheet"/>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{background:#050d1a;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Exo 2',sans-serif}
  .cert{width:900px;padding:60px;background:linear-gradient(135deg,#0a192f,#050d1a,#0a192f);border:2px solid #00e5ff;box-shadow:0 0 60px rgba(0,229,255,0.2);position:relative;text-align:center;color:#e6f1ff}
  .cert::before{content:'';position:absolute;inset:10px;border:1px solid rgba(0,229,255,0.2);pointer-events:none}
  .logo{font-family:'Orbitron',sans-serif;font-size:1.8rem;font-weight:900;color:#00e5ff;margin-bottom:0.5rem}
  .tagline{font-size:0.8rem;letter-spacing:0.3em;color:#8892b0;text-transform:uppercase;margin-bottom:3rem}
  .cert-title{font-family:'Orbitron',sans-serif;font-size:0.9rem;letter-spacing:0.3em;color:#00e5ff;text-transform:uppercase;margin-bottom:1rem}
  .name{font-family:'Orbitron',sans-serif;font-size:2.8rem;font-weight:900;color:#fff;margin-bottom:1.5rem;text-shadow:0 0 30px rgba(0,229,255,0.4);border-bottom:2px solid rgba(0,229,255,0.3);padding-bottom:1rem}
  .desc{font-size:1rem;color:#8892b0;line-height:1.8;margin-bottom:2rem;max-width:600px;margin-left:auto;margin-right:auto}
  .domain{color:#00e5ff;font-weight:700}
  .details{display:flex;justify-content:center;gap:3rem;margin:2rem 0}
  .detail-item{text-align:center}
  .detail-label{font-size:0.7rem;letter-spacing:0.2em;color:#8892b0;text-transform:uppercase}
  .detail-value{font-family:'Orbitron',sans-serif;font-size:0.9rem;color:#00e5ff;margin-top:0.3rem}
  .sig-section{display:flex;justify-content:space-between;margin-top:3rem;padding-top:2rem;border-top:1px solid rgba(0,229,255,0.2)}
  .sig{text-align:center}
  .sig-line{width:150px;height:1px;background:rgba(0,229,255,0.4);margin:0 auto 0.5rem}
  .sig-name{font-family:'Orbitron',sans-serif;font-size:0.75rem;color:#e6f1ff}
  .sig-title{font-size:0.7rem;color:#8892b0;margin-top:0.2rem}
  .cert-no{position:absolute;bottom:20px;right:30px;font-size:0.7rem;color:#4a5568;font-family:'Orbitron',sans-serif}
  @media print{body{background:white}.cert{box-shadow:none}}</style></head>
  <body><div class="cert">
  <div class="logo">SGT SoftGrowTech</div>
  <div class="tagline">Learn - Build - Evolve</div>
  <div class="cert-title">Certificate of Completion</div>
  <p style="color:#8892b0;margin-bottom:1rem">This is to proudly certify that</p>
  <div class="name">${internName}</div>
  <div class="desc">has successfully completed the internship program in <span class="domain">${domain}</span> at SoftGrowTech, demonstrating exceptional dedication and technical proficiency.</div>
  <div class="details">
    <div class="detail-item"><div class="detail-label">Duration</div><div class="detail-value">${duration}</div></div>
    <div class="detail-item"><div class="detail-label">Domain</div><div class="detail-value">${domain.split(' ')[0]}</div></div>
    <div class="detail-item"><div class="detail-label">Date</div><div class="detail-value">${today}</div></div>
    <div class="detail-item"><div class="detail-label">Grade</div><div class="detail-value">EXCELLENT</div></div>
  </div>
  <div class="sig-section">
    <div class="sig"><div class="sig-line"></div><div class="sig-name">Admin User</div><div class="sig-title">Program Director</div></div>
    <div class="sig"><div class="sig-line"></div><div class="sig-name">SoftGrowTech</div><div class="sig-title">Authorized Signatory</div></div>
  </div>
  <div class="cert-no">Cert No: ${certNum}</div>
  </div><script>setTimeout(()=>window.print(),1000)</script></body></html>`);
  win.document.close();
}

// ===== DEADLINE TRACKER =====
let DEADLINES = JSON.parse(localStorage.getItem('deadlines') || '[]');
if (DEADLINES.length === 0) {
  DEADLINES = [
    {id:1, task:'E-Commerce Homepage', deadline:'2025-07-01', priority:'High'},
    {id:2, task:'Authentication Module', deadline:'2025-07-15', priority:'Medium'},
    {id:3, task:'Admin Dashboard', deadline:'2025-07-30', priority:'Low'},
  ];
}

function renderDeadlines() {
  const container = document.getElementById('deadlineList');
  if (!container) return;
  const now = new Date();
  container.innerHTML = DEADLINES.sort((a,b)=>new Date(a.deadline)-new Date(b.deadline)).map(d => {
    const deadline = new Date(d.deadline);
    const daysLeft = Math.ceil((deadline - now) / (1000*60*60*24));
    const isOverdue = daysLeft < 0;
    const isUrgent = daysLeft <= 3 && daysLeft >= 0;
    const color = isOverdue ? '#ff6b6b' : isUrgent ? '#ffc107' : '#00e5ff';
    const pct = Math.min(100, Math.max(0, ((30-daysLeft)/30)*100));
    return `<div style="background:rgba(0,229,255,0.03);border:1px solid var(--border);border-radius:10px;padding:1.2rem;margin-bottom:1rem;border-left:3px solid ${color}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem">
        <div>
          <div style="font-weight:600;font-size:0.95rem">${d.task}</div>
          <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.2rem">Due: ${deadline.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
        </div>
        <div style="text-align:right">
          <span style="font-size:0.75rem;padding:0.2rem 0.6rem;border-radius:4px;background:${d.priority==='High'?'rgba(255,107,107,0.15)':d.priority==='Medium'?'rgba(255,193,7,0.15)':'rgba(0,229,255,0.15)'};color:${d.priority==='High'?'#ff6b6b':d.priority==='Medium'?'#ffc107':'#00e5ff'}">${d.priority}</span>
          <div style="font-size:1rem;font-weight:700;color:${color};margin-top:0.3rem">${isOverdue?'OVERDUE':daysLeft===0?'TODAY!':daysLeft+' days left'}</div>
        </div>
      </div>
      <div style="height:4px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${color};border-radius:2px"></div>
      </div>
    </div>`;
  }).join('');
}

function addDeadline() {
  const task = prompt('Task name:');
  const date = prompt('Deadline (YYYY-MM-DD):');
  const priority = prompt('Priority (High/Medium/Low):') || 'Medium';
  if (task && date) {
    DEADLINES.push({id:Date.now(), task, deadline:date, priority});
    localStorage.setItem('deadlines', JSON.stringify(DEADLINES));
    renderDeadlines();
    showToast('Deadline added!', 'success');
  }
}

// ===== THEME TOGGLE =====
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-theme');
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.textContent = isLight ? '🌙' : '☀️';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

function initTheme() {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.textContent = '🌙';
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setTimeout(renderDeadlines, 500);
});
