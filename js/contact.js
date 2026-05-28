/* =====================
   聯絡表單：送出後跳轉至 LINE 並預填諮詢內容
   ===================== */
const form = document.getElementById('contactForm');
if (!form) throw new Error('contactForm not found');

const LINE_ID = '@fqc1848m';

const fields = {
  name:    { el: form.name,    msg: form.querySelector('[data-err="name"]'),    validate: v => v.trim().length >= 2 },
  contact: { el: form.contact, msg: form.querySelector('[data-err="contact"]'), validate: v => v.trim().length >= 4 },
  concern: { el: form.concern, msg: form.querySelector('[data-err="concern"]'), validate: v => v !== '' },
};

function validateField(key) {
  const { el, msg, validate } = fields[key];
  const ok = validate(el.value);
  el.classList.toggle('error', !ok);
  if (msg) msg.classList.toggle('show', !ok);
  return ok;
}

Object.keys(fields).forEach(key => {
  fields[key].el?.addEventListener('blur', () => validateField(key));
});

function selectedText(selectEl) {
  return selectEl.value ? (selectEl.options[selectEl.selectedIndex]?.text || '') : '';
}

function buildLineMessage() {
  const concernText = selectedText(form.concern);
  const timingText  = selectedText(form.timing) || '尚未確定';
  const note        = form.note.value.trim() || '（無）';
  return [
    '【網站諮詢申請】',
    `姓名：${form.name.value.trim()}`,
    `聯絡：${form.contact.value.trim()}`,
    `主要困擾：${concernText}`,
    `希望開始時間：${timingText}`,
    `備註：${note}`,
    '',
    '（來源：科學體重管理師網站）',
  ].join('\n');
}

function buildLineUrl(message) {
  return `https://line.me/R/oaMessage/${LINE_ID}/?${encodeURIComponent(message)}`;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const allValid = Object.keys(fields).map(k => validateField(k)).every(Boolean);
  if (!allValid) return;

  const message = buildLineMessage();
  const lineUrl = buildLineUrl(message);

  const lineBtn = document.getElementById('openLineBtn');
  if (lineBtn) lineBtn.href = lineUrl;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(message).catch(() => {});
  }

  // 先嘗試同步跳轉（user gesture 內最可靠）
  try { window.location.assign(lineUrl); } catch (_) {}

  // UI 更新（若跳轉成功，下列畫面只在使用者按返回時可見；若被擋，留下備援按鈕）
  form.style.display = 'none';
  document.getElementById('formSuccess').classList.add('show');
});
