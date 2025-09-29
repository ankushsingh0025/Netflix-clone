// script.js

// Wait for DOM ready
document.addEventListener('DOMContentLoaded', () => {
  /********** Helper functions **********/
  const isValidEmail = (email) => {
    // simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const createToast = (msg, timeout = 3000) => {
    const t = document.createElement('div');
    t.className = 'simple-toast';
    t.textContent = msg;
    Object.assign(t.style, {
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      padding: '10px 14px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      borderRadius: '6px',
      zIndex: 9999,
      fontSize: '14px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), timeout);
  };

  /********** 1) Email signup handlers (both forms) **********/
  document.querySelectorAll('form.email-signup').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input && input.value.trim();
      if (!email) {
        createToast('कृपया अपना ईमेल डालें।');
        input.focus();
        return;
      }
      if (!isValidEmail(email)) {
        createToast('कृपया मान्य ईमेल दर्ज करें।');
        input.focus();
        return;
      }

      // Simulate successful signup / next step
      // You can replace this with real API call (fetch) if needed
      createToast('शानदार! आगे बढ़ने के लिए भेजा जा रहा है…');
      // Visual feedback: briefly disable button
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const original = btn.textContent;
        btn.textContent = 'Processing...';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          // Optionally clear the input
          // input.value = '';
          // Show modal to ask for password or next step:
          showSignupNextStep(email);
        }, 900);
      } else {
        // fallback
        setTimeout(() => showSignupNextStep(email), 600);
      }
    });
  });

  function showSignupNextStep(email) {
    // Create a small modal to ask for password / or notify
    const modal = document.createElement('div');
    modal.className = 'simple-modal';
    Object.assign(modal.style, {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      background: 'rgba(0,0,0,0.6)'
    });
   
    document.body.appendChild(modal);

    modal.querySelector('.modal-cancel').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-done').addEventListener('click', () => {
      createToast('Account setup complete (demo).');
      modal.remove();
    });
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  /********** 2) Accordion toggle improvement **********/
  // HTML uses radio inputs; we allow toggling (click same question to close)
  const accLabels = document.querySelectorAll('ul.accordion label');
  accLabels.forEach(label => {
    // use mousedown to intercept default label behaviour and toggle manually
    label.addEventListener('mousedown', (ev) => {
      ev.preventDefault(); // prevent native label toggle
      const forId = label.getAttribute('for');
      if (!forId) return;
      const input = document.getElementById(forId);
      if (!input) return;
      // If it is a radio (single-select group), toggle checked state
      if (input.type === 'radio') {
        if (input.checked) {
          input.checked = false; // close
          // also hide any visible focus/active via dispatch change
          input.dispatchEvent(new Event('change'));
        } else {
          // check it
          input.checked = true;
          input.dispatchEvent(new Event('change'));
        }
      } else {
        // fallback for checkbox
        input.checked = !input.checked;
        input.dispatchEvent(new Event('change'));
      }
    });
  });

  /********** 3) Language button dropdown (simple) **********/
  document.querySelectorAll('.langauage-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      // if dropdown already present, toggle remove it
      const existing = btn.parentElement.querySelector('.lang-dropdown');
      if (existing) {
        existing.remove();
        return;
      }
      const dropdown = document.createElement('div');
      dropdown.className = 'lang-dropdown';
      Object.assign(dropdown.style, {
        position: 'absolute',
        marginTop: '6px',
        right: '0',
        background: '#fff',
        borderRadius: '6px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
        padding: '8px',
        zIndex: 9998,
        minWidth: '150px'
      });
      const langs = ['English', 'हिन्दी', 'বাংলা', 'தமிழ்', 'తెలుగు', 'मराठी'];
      dropdown.innerHTML = langs.map(l => `<div class="lang-item" style="padding:8px 10px;cursor:pointer;border-radius:4px">${l}</div>`).join('');
      // position relative parent
      btn.parentElement.style.position = 'relative';
      btn.parentElement.appendChild(dropdown);

      dropdown.querySelectorAll('.lang-item').forEach(item => {
        item.addEventListener('click', () => {
          // for demo: change button text
          btn.innerHTML = item.textContent + ' <img src="image/down-icon.png">';
          dropdown.remove();
          createToast(`Language set to ${item.textContent} (demo)`);
        });
      });

      // close on outside click
      const closeFn = (ev) => {
        if (!dropdown.contains(ev.target) && ev.target !== btn) {
          dropdown.remove();
          document.removeEventListener('click', closeFn);
        }
      };
      document.addEventListener('click', closeFn);
    });
  });

  /********** 4) Sign in button -> show modal **********/
  const signInBtn = Array.from(document.querySelectorAll('nav button')).find(b => /sign in/i.test(b.textContent));
  if (signInBtn) {
    signInBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openSignInModal();
    });
  }

  function openSignInModal() {
    // re-use modal style
    const modal = document.createElement('div');
    modal.className = 'signin-modal';
    Object.assign(modal.style, {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      background: 'rgba(0,0,0,0.6)'
    });
    modal.innerHTML = `
      <div style="background:#111;color:white;border-radius:8px;padding:20px;max-width:420px;width:90%;font-family:inherit;">
        <h2 style="margin:0 0 10px">Sign In</h2>
        <input id="signin-email" placeholder="Email address" type="email" style="width:100%;padding:10px;border-radius:6px;border:none;margin-bottom:10px;">
        <input id="signin-pass" placeholder="Password" type="password" style="width:100%;padding:10px;border-radius:6px;border:none;margin-bottom:10px;">
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:6px;">
          <button id="signin-close" style="padding:8px 12px;border-radius:6px;background:#333;border:0;color:#ddd;cursor:pointer;">Cancel</button>
          <button id="signin-submit" style="padding:8px 12px;border-radius:6px;background:#e50914;border:0;color:white;cursor:pointer;">Sign in</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#signin-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#signin-submit').addEventListener('click', () => {
      const email = modal.querySelector('#signin-email').value.trim();
      const pass = modal.querySelector('#signin-pass').value;
      if (!isValidEmail(email)) {
        createToast('Valid email required.');
        return;
      }
      if (!pass || pass.length < 4) {
        createToast('Please enter a valid password (min 4 chars).');
        return;
      }
      createToast('Signed in (demo).');
      setTimeout(() => modal.remove(), 600);
    });

    // close on background click
    modal.addEventListener('click', (ev) => {
      if (ev.target === modal) modal.remove();
    });
  }

  /********** 5) Header scroll effect **********/
  const header = document.querySelector('.header');
  if (header) {
    const topNav = header.querySelector('nav');
    window.addEventListener('scroll', () => {
      const sc = window.scrollY || window.pageYOffset;
      if (sc > 50) {
        topNav && (topNav.style.background = 'rgba(0,0,0,0.6)');
        topNav && (topNav.style.backdropFilter = 'blur(6px)');
      } else {
        topNav && (topNav.style.background = 'transparent');
        topNav && (topNav.style.backdropFilter = 'none');
      }
    });
  }

  /********** 6) Small accessibility: focus outlines on labels for accordion **********/
  document.querySelectorAll('ul.accordion li label').forEach(l => {
    l.setAttribute('tabindex', '0');
    l.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        l.dispatchEvent(new MouseEvent('mousedown', {bubbles:true}));
      }
    });
  });

}); // DOMContentLoaded end
