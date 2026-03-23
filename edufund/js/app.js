/**
 * EduFund – js/app.js
 * All application logic: navigation, forms, tables, chatbot, CSV export
 */

// ── State ────────────────────────────────────────────────────────────────────
let currentRole = null;
let currentUser = null;
let regStep = 1;

// ── Screen Navigation ────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showAuth(role) {
  currentRole = role;
  document.getElementById('auth-title').textContent =
    role === 'admin' ? 'Admin Login' : 'Student Login';
  document.getElementById('auth-sub').textContent =
    role === 'admin' ? 'Access the admin console' : 'Access your project portal';
  document.getElementById('auth-email').value =
    role === 'admin' ? 'admin@edufund.com' : 'student@edufund.com';
  showScreen('screen-auth');
}

function showRegister() {
  showScreen('screen-register');
}

// ── Auth ─────────────────────────────────────────────────────────────────────
function doLogin() {
  const email = document.getElementById('auth-email').value.trim();
  const pass  = document.getElementById('auth-password').value;

  if (!email || !pass) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  if (currentRole === 'admin') {
    currentUser = { name: 'Admin User', role: 'admin' };
    showScreen('screen-admin');
    renderAdminDashboard();
    updateExportCount();
    renderAmountsTable();
    populateAmountSelect();
    showToast('Welcome back, Admin!', 'success');
  } else {
    currentUser = students[0]; // demo: always first student
    document.getElementById('s-uname').textContent = currentUser.name;
    document.getElementById('s-avatar').textContent = initials(currentUser.name);
    showScreen('screen-student');
    renderStudentDashboard();
    showToast('Welcome back, ' + currentUser.name.split(' ')[0] + '!', 'success');
  }
}

function doLogout() {
  showScreen('screen-landing');
  showToast('Logged out successfully');
}

function doRegister() {
  const name = document.getElementById('r-name').value.trim() || 'New Student';
  currentRole = 'student';
  currentUser = { name, role: 'student' };
  document.getElementById('s-uname').textContent = name;
  document.getElementById('s-avatar').textContent = initials(name);
  showScreen('screen-student');
  renderStudentDashboard();
  showToast('Account created! Welcome, ' + name + '! 🎉', 'success');
}

// Registration step wizard
function regNext(step) {
  document.getElementById('reg-step' + regStep).style.display = 'none';
  regStep = step;
  document.getElementById('reg-step' + regStep).style.display = '';
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById('rs' + i);
    el.className = 'step' + (i < regStep ? ' done' : i === regStep ? ' active' : '');
  }
}

// ── Tab Switching ─────────────────────────────────────────────────────────────
function studentTab(tab, el) {
  document.querySelectorAll('#screen-student .nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  document.querySelectorAll('#screen-student .tab-page').forEach(p => p.classList.remove('active'));
  document.getElementById('s-tab-' + tab).classList.add('active');

  if (tab === 'myapps')   renderStudentAppsTable(myApplications());
  if (tab === 'funding')  renderStudentFunding();
  if (tab === 'dashboard') renderStudentDashboard();
}

function adminTab(tab, el) {
  document.querySelectorAll('#screen-admin .nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  document.querySelectorAll('#screen-admin .tab-page').forEach(p => p.classList.remove('active'));
  document.getElementById('a-tab-' + tab).classList.add('active');

  if (tab === 'dashboard')    renderAdminDashboard();
  if (tab === 'applications') renderAdminTable();
  if (tab === 'amounts') {
    renderAmountsTable();
    populateAmountSelect();
    updateAmountSummary();
  }
  if (tab === 'exports') updateExportCount();
}

// ── Student: Dashboard ────────────────────────────────────────────────────────
function renderStudentDashboard() {
  const my = myApplications();
  document.getElementById('s-stat-total').textContent    = my.length;
  document.getElementById('s-stat-approved').textContent = my.filter(a => a.status === 'approved').length;
  document.getElementById('s-stat-pending').textContent  = my.filter(a => a.status === 'pending').length;
  const total = my.reduce((s, a) => s + a.amount, 0);
  document.getElementById('s-stat-amount').textContent = '$' + total.toLocaleString();

  document.getElementById('s-recent-apps').innerHTML = my.slice(0, 3).map(a => `
    <tr>
      <td><strong>${a.project}</strong></td>
      <td>${a.category}</td>
      <td>$${a.amount.toLocaleString()}</td>
      <td>${badgeHtml(a.status)}</td>
      <td>${a.date}</td>
    </tr>`).join('');
}

function renderStudentAppsTable(apps) {
  document.getElementById('s-apps-table').innerHTML = apps.map(a => `
    <tr>
      <td><strong>${a.project}</strong></td>
      <td>${a.category}</td>
      <td>$${a.amount.toLocaleString()}</td>
      <td>${badgeHtml(a.status)}</td>
      <td>${a.date}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="viewApp('${a.id}','student')">View</button>
      </td>
    </tr>`).join('');
}

function filterStudentApps(q) {
  const my = myApplications();
  renderStudentAppsTable(
    q ? my.filter(a => a.project.toLowerCase().includes(q.toLowerCase())) : my
  );
}

function renderStudentFunding() {
  const my  = myApplications();
  const req  = my.reduce((s, a) => s + a.amount, 0);
  const app  = my.filter(a => a.status === 'approved').reduce((s, a) => s + a.approvedAmt, 0);
  const pend = my.filter(a => a.status === 'pending' || a.status === 'review').reduce((s, a) => s + a.amount, 0);

  document.getElementById('sf-req').textContent  = '$' + req.toLocaleString();
  document.getElementById('sf-app').textContent  = '$' + app.toLocaleString();
  document.getElementById('sf-pend').textContent = '$' + pend.toLocaleString();

  document.getElementById('sf-table').innerHTML = my.map(a => `
    <tr>
      <td><strong>${a.project}</strong></td>
      <td>$${a.amount.toLocaleString()}</td>
      <td>${badgeHtml(a.status)}</td>
      <td style="color:var(--muted);font-size:.82rem">${a.note || '—'}</td>
    </tr>`).join('');
}

// ── Student: Submit Application ───────────────────────────────────────────────
function submitApplication() {
  const title  = document.getElementById('app-title').value.trim();
  const amount = parseFloat(document.getElementById('app-amount').value);
  const desc   = document.getElementById('app-desc').value.trim();

  if (!title || !amount || !desc) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  const newApp = {
    id:          'APP-' + String(applications.length + 1).padStart(3, '0'),
    studentId:   'STU-001',
    studentName: currentUser.name,
    uni:         'Univ. of Rwanda',
    project:     title,
    category:    document.getElementById('app-cat').value,
    amount,
    approvedAmt: 0,
    status:      'pending',
    date:        new Date().toISOString().split('T')[0],
    desc,
    team:        document.getElementById('app-team').value,
    outcomes:    document.getElementById('app-outcomes').value,
    timeline:    document.getElementById('app-timeline').value,
    note:        '',
  };

  applications.unshift(newApp);
  showToast('Application submitted successfully! 🎉', 'success');

  // Clear form
  ['app-title', 'app-amount', 'app-desc', 'app-team', 'app-outcomes'].forEach(id => {
    document.getElementById(id).value = '';
  });

  // Switch to My Applications tab
  const navItems = document.querySelectorAll('#screen-student .nav-item');
  navItems.forEach((n, i) => n.classList.toggle('active', i === 2));
  studentTab('myapps', null);
}

// ── Admin: Dashboard ──────────────────────────────────────────────────────────
function renderAdminDashboard() {
  document.getElementById('a-stat-total').textContent        = applications.length;
  document.getElementById('a-stat-pending').textContent      = applications.filter(a => a.status === 'pending').length;
  document.getElementById('a-stat-approved').textContent     = applications.filter(a => a.status === 'approved').length;
  document.getElementById('a-stat-amount').textContent       = '$' + applications.reduce((s, a) => s + a.amount, 0).toLocaleString();
  document.getElementById('a-stat-approved-amt').textContent = '$' + applications.filter(a => a.status === 'approved').reduce((s, a) => s + a.approvedAmt, 0).toLocaleString();
  document.getElementById('a-stat-students').textContent     = [...new Set(applications.map(a => a.studentId))].length;

  document.getElementById('a-recent-apps').innerHTML = applications.slice(0, 5).map(a => `
    <tr>
      <td>${a.studentName}</td>
      <td><strong>${a.project}</strong></td>
      <td>$${a.amount.toLocaleString()}</td>
      <td>${badgeHtml(a.status)}</td>
      <td>${a.date}</td>
      <td style="display:flex;gap:6px;flex-wrap:wrap">
        ${actionBtns(a)}
        <button class="btn btn-secondary btn-sm" onclick="viewApp('${a.id}','admin')">View</button>
      </td>
    </tr>`).join('');
}

// ── Admin: All Applications ───────────────────────────────────────────────────
function renderAdminTable() {
  const q  = (document.getElementById('a-search') || {}).value || '';
  const sf = (document.getElementById('a-filter-status') || {}).value || '';

  let apps = applications;
  if (q)  apps = apps.filter(a => a.studentName.toLowerCase().includes(q.toLowerCase()) || a.project.toLowerCase().includes(q.toLowerCase()));
  if (sf) apps = apps.filter(a => a.status === sf);

  document.getElementById('a-apps-table').innerHTML = apps.map(a => `
    <tr>
      <td>
        ${a.studentName}<br>
        <small style="color:var(--muted)">${a.uni}</small>
      </td>
      <td><strong>${a.project}</strong></td>
      <td>${a.category}</td>
      <td>$${a.amount.toLocaleString()}</td>
      <td>${badgeHtml(a.status)}</td>
      <td>${a.date}</td>
      <td style="display:flex;gap:6px;flex-wrap:wrap">
        ${actionBtns(a)}
        <button class="btn btn-secondary btn-sm" onclick="viewApp('${a.id}','admin')">📄</button>
      </td>
    </tr>`).join('');
}

function actionBtns(a) {
  let html = '';
  if (a.status === 'pending') {
    html += `<button class="btn btn-secondary btn-sm" onclick="updateStatus('${a.id}','review')">⟳ Review</button>`;
  }
  if (a.status === 'pending' || a.status === 'review') {
    html += `<button class="btn btn-success btn-sm" onclick="updateStatus('${a.id}','approved')">✓</button>`;
    html += `<button class="btn btn-danger btn-sm"  onclick="updateStatus('${a.id}','rejected')">✗</button>`;
  }
  return html;
}

function updateStatus(id, status) {
  const app = applications.find(a => a.id === id);
  if (!app) return;
  app.status = status;
  showToast('Application ' + status + '!', 'success');
  renderAdminDashboard();
  renderAdminTable();
  renderAmountsTable();
  populateAmountSelect();
  updateExportCount();
}

// ── Admin: Amount Management ──────────────────────────────────────────────────
function updateAmountSummary() {
  const req = applications.reduce((s, a) => s + a.amount, 0);
  const app = applications.filter(a => a.approvedAmt > 0).reduce((s, a) => s + a.approvedAmt, 0);
  document.getElementById('am-req').textContent = '$' + req.toLocaleString();
  document.getElementById('am-app').textContent = '$' + app.toLocaleString();
  document.getElementById('am-avg').textContent = '$' + Math.round(req / applications.length).toLocaleString();
}

function populateAmountSelect() {
  const sel = document.getElementById('am-select');
  sel.innerHTML =
    '<option value="">-- Select --</option>' +
    applications.map(a => `<option value="${a.id}">${a.project} (${a.studentName})</option>`).join('');
}

function loadAmountApp() {
  const id  = document.getElementById('am-select').value;
  const app = applications.find(a => a.id === id);
  document.getElementById('am-req-disp').value      = app ? '$' + app.amount.toLocaleString() : '';
  document.getElementById('am-approve-input').value  = app ? (app.approvedAmt || '') : '';
  document.getElementById('am-note').value           = app ? app.note : '';
}

function saveAmount() {
  const id = document.getElementById('am-select').value;
  if (!id) { showToast('Select an application first', 'error'); return; }

  const app = applications.find(a => a.id === id);
  const val = parseFloat(document.getElementById('am-approve-input').value);
  if (isNaN(val)) { showToast('Enter a valid amount', 'error'); return; }

  app.approvedAmt = val;
  app.note        = document.getElementById('am-note').value;
  showToast('Amount saved!', 'success');
  renderAmountsTable();
  updateAmountSummary();
}

function renderAmountsTable() {
  updateAmountSummary();
  document.getElementById('am-table').innerHTML = applications.map(a => `
    <tr>
      <td>${a.studentName}</td>
      <td><strong>${a.project}</strong></td>
      <td>$${a.amount.toLocaleString()}</td>
      <td style="color:var(--accent2)">${a.approvedAmt ? '$' + a.approvedAmt.toLocaleString() : '—'}</td>
      <td>${badgeHtml(a.status)}</td>
      <td style="color:var(--muted);font-size:.82rem">${a.note || '—'}</td>
    </tr>`).join('');
}

// ── Admin: CSV Export ─────────────────────────────────────────────────────────
function updateExportCount() {
  const el = document.getElementById('ep-count');
  if (el) el.textContent = applications.length;
}

function exportCSV() {
  const statusF = document.getElementById('exp-status').value;
  let apps = statusF === 'all' ? applications : applications.filter(a => a.status === statusF);

  const headers = [
    'Application ID', 'Student Name', 'Student ID', 'University', 'Department',
    'Project Title', 'Category', 'Amount Requested', 'Amount Approved', 'Status',
    'Submission Date', 'Team Members', 'Timeline', 'Expected Outcomes', 'Admin Notes',
  ];

  const rows = apps.map(a => [
    a.id, a.studentName, a.studentId, a.uni, '',
    a.project, a.category, a.amount, a.approvedAmt || 0, a.status,
    a.date, a.team, a.timeline, a.outcomes, a.note,
  ]);

  const csv = [headers, ...rows]
    .map(r => r.map(c => '"' + String(c || '').replace(/"/g, '""') + '"').join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = 'edufund_applicants.csv';
  link.click();
  URL.revokeObjectURL(url);
  showToast('CSV downloaded!', 'success');
}

// ── Modal: View Application ───────────────────────────────────────────────────
function viewApp(id, role) {
  const a = applications.find(ap => ap.id === id);
  if (!a) return;

  document.getElementById('modal-proj-title').textContent = a.project;
  document.getElementById('modal-proj-sub').textContent   = 'Submitted by ' + a.studentName + ' · ' + a.date;

  document.getElementById('modal-content').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px">
      <div class="stat-card"><div class="label">Category</div><div style="font-size:1rem;font-weight:600">${a.category}</div></div>
      <div class="stat-card"><div class="label">Status</div>${badgeHtml(a.status)}</div>
      <div class="stat-card"><div class="label">Requested</div><div style="font-size:1rem;font-weight:600;color:var(--accent)">$${a.amount.toLocaleString()}</div></div>
      <div class="stat-card"><div class="label">Approved</div><div style="font-size:1rem;font-weight:600;color:var(--accent2)">${a.approvedAmt ? '$' + a.approvedAmt.toLocaleString() : 'Not yet approved'}</div></div>
    </div>
    <div class="form-group"><label>Description</label>
      <div style="padding:12px;background:var(--bg);border-radius:8px;font-size:.88rem;line-height:1.6">${a.desc}</div>
    </div>
    <div class="form-group"><label>Team Members</label>
      <div style="padding:12px;background:var(--bg);border-radius:8px;font-size:.88rem">${a.team || '—'}</div>
    </div>
    <div class="form-group"><label>Timeline</label>
      <div style="padding:12px;background:var(--bg);border-radius:8px;font-size:.88rem">${a.timeline}</div>
    </div>
    <div class="form-group"><label>Expected Outcomes</label>
      <div style="padding:12px;background:var(--bg);border-radius:8px;font-size:.88rem;line-height:1.6">${a.outcomes || '—'}</div>
    </div>
    ${a.note ? `
    <div class="form-group"><label>Admin Note</label>
      <div style="padding:12px;background:rgba(247,168,79,.08);border:1px solid rgba(247,168,79,.2);border-radius:8px;font-size:.88rem;line-height:1.6;color:var(--warn)">${a.note}</div>
    </div>` : ''}
  `;

  const actions = document.getElementById('modal-actions');
  if (role === 'admin' && (a.status === 'pending' || a.status === 'review')) {
    actions.innerHTML = `
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn btn-danger"    onclick="updateStatus('${a.id}','rejected');closeModal()">✗ Reject</button>
      <button class="btn btn-success"   onclick="updateStatus('${a.id}','approved');closeModal()">✓ Approve</button>`;
  } else {
    actions.innerHTML = `<button class="btn btn-primary" onclick="closeModal()">Close</button>`;
  }

  document.getElementById('modal-app').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-app').classList.remove('open');
}

document.getElementById('modal-app').addEventListener('click', e => {
  if (e.target.id === 'modal-app') closeModal();
});

// ── Chatbot ───────────────────────────────────────────────────────────────────
function getBotReply(msg) {
  const m = msg.toLowerCase();
  for (const key in botReplies) {
    if (key !== 'default' && m.includes(key)) {
      const val = botReplies[key];
      return typeof val === 'function' ? val() : val;
    }
  }
  return typeof botReplies['default'] === 'function' ? botReplies['default']() : botReplies['default'];
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const msg   = input.value.trim();
  if (!msg) return;
  input.value = '';
  appendMsg('chat-messages', msg, 'user');
  showTyping('chat-messages');
  setTimeout(() => {
    removeTyping('chat-messages');
    appendMsg('chat-messages', getBotReply(msg), 'bot');
  }, 900 + Math.random() * 600);
}

function quickChat(msg) {
  document.getElementById('chat-input').value = msg;
  sendChat();
}

function sendAdminChat() {
  const input = document.getElementById('admin-chat-input');
  const msg   = input.value.trim();
  if (!msg) return;
  input.value = '';
  appendMsg('admin-chat-messages', msg, 'user');
  showTyping('admin-chat-messages');
  setTimeout(() => {
    removeTyping('admin-chat-messages');
    appendMsg('admin-chat-messages', getBotReply(msg), 'bot');
  }, 900 + Math.random() * 600);
}

function quickAdminChat(msg) {
  document.getElementById('admin-chat-input').value = msg;
  sendAdminChat();
}

function appendMsg(containerId, text, role) {
  const container = document.getElementById(containerId);
  const div  = document.createElement('div');
  div.className = 'msg ' + role;
  const now  = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  div.innerHTML = `
    <div class="msg-bubble">${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>
    <div class="msg-time">${now}</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function showTyping(containerId) {
  const container = document.getElementById(containerId);
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.id = containerId + '-typing';
  div.innerHTML = `
    <div class="typing-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function removeTyping(containerId) {
  const el = document.getElementById(containerId + '-typing');
  if (el) el.remove();
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function myApplications() {
  return applications.filter(a => a.studentId === 'STU-001');
}

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function badgeHtml(status) {
  const classes = { pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected', review: 'badge-review' };
  const icons   = { pending: '⏳', approved: '✅', rejected: '❌', review: '🔍' };
  return `<span class="badge ${classes[status] || ''}">${icons[status] || ''}${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
}

function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = 'toast show ' + type;
  setTimeout(() => { t.className = 'toast'; }, 3200);
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
// Pre-populate student table on load (hidden until student logs in)
renderStudentAppsTable(applications.filter(a => a.studentId === 'STU-001'));
