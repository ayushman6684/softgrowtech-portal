// ===== ONBOARDING TOUR =====
const TOUR_STEPS = [
  { target:'#page-overview .page-header h1', title:'Welcome to SoftGrowTech! 👋', desc:'This is your personal internship dashboard. Track your progress, submit tasks, and use AI features.', pos:'bottom' },
  { target:'.stats-grid', title:'Your Stats 📊', desc:'These cards show your total submissions, approved tasks, pending reviews, and overall progress percentage.', pos:'bottom' },
  { target:'[onclick*="submit"]', title:'Submit Tasks 📤', desc:'Click here to submit your projects and assignments for admin review.', pos:'right' },
  { target:'[onclick*="ai-chat"]', title:'AI Assistant 🤖', desc:'Ask our AI anything about coding, career advice, or your internship!', pos:'right' },
  { target:'[onclick*="gamification"]', title:'Gamification 🎮', desc:'Earn points and badges as you complete tasks. Climb the leaderboard!', pos:'right' },
  { target:'.theme-toggle', title:'Theme Toggle 🌙', desc:'Switch between dark and light mode anytime.', pos:'left' },
  { target:'body', title:"You're all set! 🚀", desc:'Press Ctrl+K anytime to open the command palette for quick navigation. Good luck with your internship!', pos:'center' },
];

let tourStep = 0;
let tourEl = null;

function startTour() {
  if (localStorage.getItem('tourDone')) { if(!confirm('Restart the tour?')) return; }
  tourStep = 0;
  showTourStep();
}

function showTourStep() {
  removeTourEl();
  if (tourStep >= TOUR_STEPS.length) { endTour(); return; }
  const step = TOUR_STEPS[tourStep];
  const target = document.querySelector(step.target);

  tourEl = document.createElement('div');
  tourEl.id = 'tourPopup';

  if (step.pos === 'center' || !target) {
    tourEl.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9998;max-width:400px;width:90%';
  } else {
    const rect = target.getBoundingClientRect();
    target.style.outline = '2px solid var(--cyan)';
    target.style.boxShadow = '0 0 20px rgba(0,229,255,0.4)';
    target.dataset.tourHighlight = 'true';
    let top = rect.bottom + 10, left = rect.left;
    if (step.pos==='right') { top=rect.top; left=rect.right+10; }
    if (step.pos==='left') { top=rect.top; left=rect.left-310; }
    tourEl.style.cssText = `position:fixed;top:${Math.min(top,window.innerHeight-200)}px;left:${Math.max(0,Math.min(left,window.innerWidth-320))}px;z-index:9998;max-width:300px;width:90%`;
  }

  tourEl.innerHTML = `
    <div style="background:#0a192f;border:1px solid rgba(0,229,255,0.5);border-radius:12px;padding:1.5rem;box-shadow:0 20px 60px rgba(0,0,0,0.6)">
      <div style="font-family:var(--font-head);font-size:0.85rem;color:var(--cyan);margin-bottom:0.75rem">${step.title}</div>
      <p style="font-size:0.875rem;color:var(--text-secondary);line-height:1.6;margin-bottom:1.2rem">${step.desc}</p>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:0.75rem;color:var(--text-muted)">${tourStep+1} / ${TOUR_STEPS.length}</span>
        <div style="display:flex;gap:0.5rem">
          <button onclick="endTour()" style="padding:0.4rem 0.8rem;background:none;border:1px solid var(--border);border-radius:6px;color:var(--text-muted);cursor:pointer;font-family:var(--font-body);font-size:0.8rem">Skip</button>
          <button onclick="nextTourStep()" style="padding:0.4rem 1rem;background:var(--cyan);border:none;border-radius:6px;color:#050d1a;cursor:pointer;font-family:var(--font-head);font-size:0.75rem;font-weight:700">${tourStep===TOUR_STEPS.length-1?'Finish!':'Next →'}</button>
        </div>
      </div>
      <div style="display:flex;gap:4px;margin-top:1rem;justify-content:center">
        ${TOUR_STEPS.map((_,i)=>`<div style="width:${i===tourStep?20:6}px;height:6px;border-radius:3px;background:${i===tourStep?'var(--cyan)':'var(--border)'};transition:all 0.3s"></div>`).join('')}
      </div>
    </div>`;
  document.body.appendChild(tourEl);
}

function nextTourStep() { removeHighlights(); tourStep++; showTourStep(); }

function endTour() {
  removeTourEl(); removeHighlights();
  localStorage.setItem('tourDone', 'true');
  showToast('Tour complete! Press Ctrl+K for quick navigation.', 'success');
}

function removeTourEl() { document.getElementById('tourPopup')?.remove(); }
function removeHighlights() {
  document.querySelectorAll('[data-tour-highlight]').forEach(el => {
    el.style.outline = ''; el.style.boxShadow = ''; delete el.dataset.tourHighlight;
  });
}

// Auto-start tour for new users
document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('tourDone')) setTimeout(startTour, 2000);
});
