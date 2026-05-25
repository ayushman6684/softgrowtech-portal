// ===== AI CODE REVIEWER =====
async function reviewCode() {
  const code = document.getElementById('codeInput')?.value;
  const lang = document.getElementById('codeLang')?.value || 'JavaScript';
  const btn = document.getElementById('reviewBtn');
  const result = document.getElementById('reviewResult');

  if (!code || code.length < 10) { showToast('Please paste some code first!', 'error'); return; }
  if (btn) { btn.innerHTML = '<span class="spinner"></span> Reviewing...'; btn.disabled = true; }
  if (result) result.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:2rem">AI is reviewing your code...</div>';

  try {
    const feedback = await callAI(
      `Review this ${lang} code as a senior developer:\n\n\`\`\`${lang.toLowerCase()}\n${code}\n\`\`\`\n\nProvide review in this format:\n\nOVERALL_SCORE: X/10\n\nBUGS_FOUND:\n- list any bugs or errors\n\nCODE_QUALITY:\n- readability, naming, structure\n\nPERFORMANCE:\n- optimization suggestions\n\nSECURITY:\n- security issues if any\n\nBEST_PRACTICES:\n- what was done well\n\nIMPROVED_CODE:\n\`\`\`\npaste improved version here\n\`\`\`\n\nBe specific and actionable.`,
      800,
      'You are a senior software engineer doing code review. Be thorough, constructive, and specific.'
    );

    if (result) {
      // Syntax highlight the code blocks
      const formatted = feedback
        .replace(/```[\w]*([\s\S]*?)```/g, '<pre style="background:rgba(0,0,0,0.3);padding:1rem;border-radius:8px;overflow-x:auto;font-size:0.8rem;border:1px solid var(--border)"><code>$1</code></pre>')
        .replace(/\n/g, '<br/>');

      result.innerHTML = `
        <div style="background:rgba(0,229,255,0.04);border:1px solid rgba(0,229,255,0.2);border-radius:10px;padding:1.5rem;margin-top:1rem">
          <div style="font-family:var(--font-head);font-size:0.85rem;color:var(--cyan);margin-bottom:1rem">🔍 CODE REVIEW RESULT</div>
          <div style="font-size:0.875rem;line-height:1.8;color:var(--text-secondary)">${formatted}</div>
        </div>`;
    }
    showToast('Code review complete!', 'success');
  } catch(e) {
    if (result) result.innerHTML = `<div class="alert alert-error">Review failed: ${e.message}</div>`;
  }
  if (btn) { btn.innerHTML = '🔍 Review My Code'; btn.disabled = false; }
}
