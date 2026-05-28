/* =====================
   聯絡表單：
   1. 送資料到 Google Apps Script（Sheet + Gmail 通知）
   2. 手機自動跳 LINE 並預填諮詢內容
   3. 電腦顯示 QR Code + 訊息預覽 + 複製按鈕
   ===================== */
const form = document.getElementById('contactForm');
if (!form) throw new Error('contactForm not found');

const LINE_ID = '@fqc1848m';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyGBiaQRfcvGW0i9qjo5NvAtBavC0E_a19IBiHkYR8g0gbtE4y6tBj5ErZzG-ZBeVxujg/exec';

const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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

function getInquiryData() {
  return {
    name:    form.name.value.trim(),
    contact: form.contact.value.trim(),
    concern: selectedText(form.concern),
    timing:  selectedText(form.timing) || '尚未確定',
    note:    form.note.value.trim() || '（無）',
  };
}

function buildLineMessage(data) {
  return [
    '【網站諮詢申請】',
    `姓名：${data.name}`,
    `聯絡：${data.contact}`,
    `主要困擾：${data.concern}`,
    `希望開始時間：${data.timing}`,
    `備註：${data.note}`,
    '',
    '（來源：科學體重管理師網站）',
  ].join('\n');
}

function buildLineUrl(message) {
  return `https://line.me/R/oaMessage/${LINE_ID}/?${encodeURIComponent(message)}`;
}

function sendToAppsScript(data) {
  const params = new URLSearchParams();
  params.append('name', data.name);
  params.append('contact', data.contact);
  params.append('concern', data.concern);
  params.append('timing', data.timing);
  params.append('note', data.note);
  params.append('source', isMobile ? 'mobile' : 'desktop');

  // 優先用 sendBeacon（瀏覽器保證頁面跳轉後仍會送出）
  const body = params.toString();
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/x-www-form-urlencoded;charset=UTF-8' });
    const ok = navigator.sendBeacon(APPS_SCRIPT_URL, blob);
    if (ok) return;
  }
  // fallback：fetch + keepalive
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body,
  }).catch(() => {});
}

// 複製按鈕（綁定一次即可，成功訊息顯示後再點才會作用）
document.addEventListener('click', e => {
  const btn = e.target.closest('#copyMsgBtn');
  if (!btn) return;
  const msg = document.getElementById('msgPreview')?.textContent || '';
  if (!msg) return;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(msg).then(() => {
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check2"></i> 已複製';
      setTimeout(() => { btn.innerHTML = original; }, 2000);
    }).catch(() => {});
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const allValid = Object.keys(fields).map(k => validateField(k)).every(Boolean);
  if (!allValid) return;

  const data    = getInquiryData();
  const message = buildLineMessage(data);
  const lineUrl = buildLineUrl(message);

  sendToAppsScript(data);

  const lineBtn = document.getElementById('openLineBtn');
  if (lineBtn) lineBtn.href = lineUrl;
  const msgPreview = document.getElementById('msgPreview');
  if (msgPreview) msgPreview.textContent = message;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(message).catch(() => {});
  }

  form.style.display = 'none';
  document.getElementById('formSuccess').classList.add('show');

  // 只有手機才自動跳 LINE，電腦留在成功頁讓使用者掃 QR
  if (isMobile) {
    try { window.location.assign(lineUrl); } catch (_) {}
  }
});
