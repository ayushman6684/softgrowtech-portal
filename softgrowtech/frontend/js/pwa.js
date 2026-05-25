// ===== PWA SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.log('SW error:', err));
  });
}

// Install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallBtn();
});

function showInstallBtn() {
  const existing = document.getElementById('installBtn');
  if (existing) return;
  const btn = document.createElement('button');
  btn.id = 'installBtn';
  btn.innerHTML = '📱 Install App';
  btn.style.cssText = `position:fixed;bottom:5rem;right:1.5rem;z-index:100;
    background:linear-gradient(135deg,var(--cyan),#005f73);color:#050d1a;
    border:none;border-radius:25px;padding:0.6rem 1.2rem;font-family:var(--font-head);
    font-size:0.75rem;font-weight:700;cursor:pointer;box-shadow:0 4px 20px rgba(0,229,255,0.4)`;
  btn.onclick = installApp;
  document.body.appendChild(btn);
}

async function installApp() {
  if (!deferredPrompt) { showToast('Already installed or not supported!','info'); return; }
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') showToast('App installed successfully!','success');
  deferredPrompt = null;
  document.getElementById('installBtn')?.remove();
}
