const API = window.location.origin;

function showStatus(msg, type = 'success') {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = `status ${type}`;
  setTimeout(() => (el.className = 'status'), 3000);
}

async function login() {
  const uid = document.getElementById('uid').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!uid || !password) {
    return showStatus('UID aur Password dono bharo', 'error');
  }

  try {
    const res = await fetch(`${API}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, password })
    });

    const data = await res.json();
    document.getElementById('output').textContent = JSON.stringify(data, null, 2);

    if (data.status) {
      localStorage.setItem('token', data.token);
      showStatus('✅ Login successful!', 'success');
    } else {
      showStatus('❌ ' + data.message, 'error');
    }
  } catch (err) {
    showStatus('❌ Network error', 'error');
  }
}

async function getProfile() {
  const token = localStorage.getItem('token');
  if (!token) return showStatus('Pehle login karo', 'error');

  try {
    const res = await fetch(`${API}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    document.getElementById('output').textContent = JSON.stringify(data, null, 2);
    showStatus(
      data.status ? '✅ Profile loaded' : '❌ Failed',
      data.status ? 'success' : 'error'
    );
  } catch (err) {
    showStatus('❌ Network error', 'error');
  }
}

function logout() {
  localStorage.removeItem('token');
  document.getElementById('output').textContent = '';
  showStatus('👋 Logged out', 'success');
}

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('token')) {
    showStatus('Token mila — Get Profile try karo', 'success');
  }
});
