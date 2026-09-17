/* Draft switcher — injected only in the deployed review copies */
(function () {
  try {
    if (sessionStorage.getItem('pp-switcher-hidden') === '1') return;
  } catch (e) { /* ignore */ }
  var m = location.pathname.match(/\/(site[123])\/([^\/]*)$/);
  if (!m) return;
  var cur = m[1], page = m[2] || 'index.html';
  var labels = { site1: 'A', site2: 'B', site3: 'C' };
  var css = '#pp-sw{position:fixed;left:16px;bottom:16px;z-index:2147483000;display:flex;align-items:center;gap:4px;padding:6px 6px 6px 12px;border-radius:999px;background:rgba(30,27,23,.82);color:#F6F2E9;font:600 12px/1 -apple-system,"Noto Sans KR",sans-serif;letter-spacing:.04em;box-shadow:0 12px 30px -10px rgba(0,0,0,.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}' +
    '#pp-sw a{color:inherit;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:28px;border-radius:999px;padding:0 8px;opacity:.75;transition:background .2s,opacity .2s}' +
    '#pp-sw a:hover{opacity:1;background:rgba(255,255,255,.12)}' +
    '#pp-sw a.cur{opacity:1;background:#F6F2E9;color:#1E3A2C}' +
    '#pp-sw .lbl{opacity:.6;margin-right:4px;font-weight:500}' +
    '#pp-sw button{all:unset;cursor:pointer;width:26px;height:26px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;opacity:.6;font-size:14px;margin-left:2px}' +
    '#pp-sw button:hover{opacity:1;background:rgba(255,255,255,.12)}' +
    '@media(max-width:640px){#pp-sw{left:12px;bottom:12px;padding-left:10px}#pp-sw .lbl{display:none}}';
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
  var bar = document.createElement('div'); bar.id = 'pp-sw';
  var html = '<span class="lbl">시안</span>';
  ['site1', 'site2', 'site3'].forEach(function (s) {
    html += '<a href="../' + s + '/' + page + '" class="' + (s === cur ? 'cur' : '') + '" title="시안 ' + labels[s] + ' — 같은 페이지로 이동">' + labels[s] + '</a>';
  });
  html += '<a href="../index.html" title="시안 목록">목록</a><button type="button" aria-label="전환 바 숨기기" title="이 탭에서 숨기기">×</button>';
  bar.innerHTML = html;
  bar.querySelector('button').addEventListener('click', function () {
    try { sessionStorage.setItem('pp-switcher-hidden', '1'); } catch (e) { /* ignore */ }
    bar.remove();
  });
  document.body.appendChild(bar);
})();
