// ===== GAMIFICATION SYSTEM =====
const BADGES = [
  { id:'first_sub', name:'First Step', icon:'🎯', desc:'Submit first task', points:50 },
  { id:'three_sub', name:'On Fire', icon:'🔥', desc:'Submit 3 tasks', points:100 },
  { id:'five_sub', name:'Dedicated', icon:'💪', desc:'Submit 5 tasks', points:200 },
  { id:'first_approve', name:'Approved!', icon:'✅', desc:'Get first approval', points:150 },
  { id:'perfect', name:'Perfectionist', icon:'⭐', desc:'Get 5 approvals', points:500 },
  { id:'ai_user', name:'AI Explorer', icon:'🤖', desc:'Use AI features', points:75 },
  { id:'early_bird', name:'Early Bird', icon:'🌅', desc:'Submit before 9 AM', points:50 },
  { id:'streak_3', name:'Streak Master', icon:'🌟', desc:'3 day login streak', points:100 },
];

const LEVELS = [
  { level:1, name:'Beginner', min:0, max:199, color:'#8892b0' },
  { level:2, name:'Learner', min:200, max:499, color:'#00e5ff' },
  { level:3, name:'Developer', min:500, max:999, color:'#00ffcc' },
  { level:4, name:'Expert', min:1000, max:1999, color:'#7c4dff' },
  { level:5, name:'Master', min:2000, max:99999, color:'#ffc107' },
];

function getGamificationData() {
  const subs = typeof allSubmissions !== 'undefined' ? allSubmissions : [];
  const approved = subs.filter(s=>s.status==='APPROVED').length;
  let points = subs.length * 50 + approved * 150 + 75;
  const earnedBadges = [];
  if (subs.length>=1) earnedBadges.push('first_sub');
  if (subs.length>=3) earnedBadges.push('three_sub');
  if (subs.length>=5) earnedBadges.push('five_sub');
  if (approved>=1) earnedBadges.push('first_approve');
  if (approved>=5) earnedBadges.push('perfect');
  earnedBadges.push('ai_user');
  const level = LEVELS.find(l=>points>=l.min&&points<=l.max)||LEVELS[0];
  const nextLevel = LEVELS.find(l=>l.level===level.level+1);
  const pct = nextLevel ? Math.round(((points-level.min)/(nextLevel.min-level.min))*100) : 100;
  return { points, level, nextLevel, pct, earnedBadges, subs, approved };
}

function renderGamification() {
  const container = document.getElementById('gamificationPage');
  if (!container) return;
  const { points, level, nextLevel, pct, earnedBadges, subs, approved } = getGamificationData();
  container.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem">
      <div class="content-section" style="text-align:center">
        <div style="font-size:3rem;margin-bottom:0.5rem">🏆</div>
        <div style="font-family:var(--font-head);font-size:2.5rem;font-weight:900;color:${level.color}">${points}</div>
        <div style="color:var(--text-muted);font-size:0.8rem;letter-spacing:0.1em;margin-bottom:1rem">TOTAL POINTS</div>
        <span style="font-family:var(--font-head);font-size:0.9rem;color:${level.color};background:${level.color}22;padding:0.3rem 1rem;border-radius:20px">Level ${level.level} — ${level.name}</span>
        ${nextLevel?`<div style="margin-top:1rem;font-size:0.8rem;color:var(--text-muted)">${nextLevel.min-points} pts to ${nextLevel.name}</div>
        <div style="height:8px;background:rgba(255,255,255,0.1);border-radius:4px;margin-top:0.5rem;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,${level.color},${nextLevel.color});border-radius:4px"></div>
        </div>`:'<div style="margin-top:1rem;color:#ffc107;font-family:var(--font-head)">MAX LEVEL!</div>'}
      </div>
      <div class="content-section">
        <h3 style="font-family:var(--font-head);font-size:0.85rem;margin-bottom:1rem;color:var(--cyan)">POINTS BREAKDOWN</h3>
        ${[
          {label:'Tasks Submitted',pts:subs.length*50,icon:'📤'},
          {label:'Tasks Approved',pts:approved*150,icon:'✅'},
          {label:'AI Features Used',pts:75,icon:'🤖'},
          {label:'Streak Bonus',pts:0,icon:'🔥'},
        ].map(i=>`<div style="display:flex;justify-content:space-between;padding:0.6rem 0;border-bottom:1px solid var(--border)">
          <span style="font-size:0.875rem">${i.icon} ${i.label}</span>
          <span style="font-family:var(--font-head);color:var(--cyan)">+${i.pts}</span></div>`).join('')}
      </div>
    </div>
    <div class="content-section">
      <h2 style="font-family:var(--font-head);font-size:1rem;margin-bottom:1.5rem">BADGES <span style="color:var(--text-muted);font-size:0.8rem">${earnedBadges.length}/${BADGES.length}</span></h2>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem">
        ${BADGES.map(b=>{const e=earnedBadges.includes(b.id);return`<div style="text-align:center;padding:1.2rem;border-radius:10px;border:1px solid ${e?'rgba(0,229,255,0.3)':'var(--border)'};background:${e?'rgba(0,229,255,0.05)':'transparent'};opacity:${e?1:0.4}">
          <div style="font-size:2rem;margin-bottom:0.5rem">${b.icon}</div>
          <div style="font-family:var(--font-head);font-size:0.7rem;color:${e?'var(--cyan)':'var(--text-muted)'}">${b.name}</div>
          <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.25rem">${b.desc}</div>
          <div style="font-size:0.75rem;color:#ffc107;margin-top:0.25rem">+${b.points} pts</div>
        </div>`}).join('')}
      </div>
    </div>`;
}

function renderLeaderboard() {
  const container = document.getElementById('leaderboardPage');
  if (!container) return;
  const myPoints = getGamificationData().points;
  const myLevel = getGamificationData().level.name;
  const entries = [
    {name:'Priya Sharma',domain:'Web Dev',points:1250,level:'Expert'},
    {name:'Ananya Singh',domain:'AI/ML',points:980,level:'Developer'},
    {name:'Karan Mehta',domain:'UI/UX',points:820,level:'Developer'},
    {name:getUser()?.fullName||'You',domain:getUser()?.domain||'Web Dev',points:myPoints,level:myLevel,isYou:true},
    {name:'Rahul Verma',domain:'Android',points:420,level:'Learner'},
  ].sort((a,b)=>b.points-a.points);
  const medals = ['🥇','🥈','🥉'];
  container.innerHTML = `<div class="content-section">
    <h2 style="font-family:var(--font-head);font-size:1rem;margin-bottom:1.5rem">LEADERBOARD</h2>
    ${entries.map((u,i)=>`<div style="display:flex;align-items:center;gap:1rem;padding:1rem;border-radius:10px;margin-bottom:0.75rem;
      background:${u.isYou?'rgba(0,229,255,0.08)':'rgba(0,229,255,0.02)'};border:1px solid ${u.isYou?'rgba(0,229,255,0.4)':'var(--border)'}">
      <div style="font-size:1.5rem;width:2rem;text-align:center">${medals[i]||i+1}</div>
      <div style="flex:1">
        <div style="font-weight:600;color:${u.isYou?'var(--cyan)':'var(--text-primary)'}">${u.name}${u.isYou?' (You)':''}</div>
        <div style="font-size:0.75rem;color:var(--text-muted)">${u.domain} · ${u.level}</div>
      </div>
      <div style="font-family:var(--font-head);font-size:1.1rem;color:${i===0?'#ffc107':i===1?'#e0e0e0':i===2?'#cd7f32':'var(--cyan)'}">${u.points} pts</div>
    </div>`).join('')}
  </div>`;
}
