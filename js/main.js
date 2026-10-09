/* ============================================================
   main.js —— 阅读进度 / 章节导航 / 进场动画 / 数字滚动 /
              附录速查表 / 自测警示模块
   ============================================================ */
(function (global) {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  /* ---------- 阅读进度条 ---------- */
  function progress() {
    const bar = $('#progressBar');
    const h = document.documentElement;
    function upd() {
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
      bar.style.width = (Math.min(1, Math.max(0, p)) * 100).toFixed(2) + '%';
    }
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  /* ---------- 顶部导航：高亮 + 自动隐藏 ---------- */
  function nav() {
    const links = $$('.navlinks a');
    const secs = links.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    const bar = $('.topnav');
    let last = window.scrollY;
    function upd() {
      const y = window.scrollY + 120;
      let idx = -1;
      secs.forEach((s, i) => { if (s && s.offsetTop <= y) idx = i; });
      links.forEach((a, i) => a.classList.toggle('active', i === idx));
      if (window.scrollY > last && window.scrollY > 400) bar.classList.add('hidden');
      else bar.classList.remove('hidden');
      last = window.scrollY;
    }
    window.addEventListener('scroll', upd, { passive: true });
    upd();
  }

  /* ---------- 进场动画 ---------- */
  function reveal() {
    const items = $$('.reveal');
    document.documentElement.classList.add('js');
    if (!('IntersectionObserver' in window)) { items.forEach((i) => i.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    items.forEach((i) => io.observe(i));

    /* 兜底：已进入视口但 IO 未触发的元素直接点亮 */
    const sweep = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      items.forEach((i) => {
        if (i.classList.contains('in')) return;
        const r = i.getBoundingClientRect();
        if (r.top < vh * 0.96 && r.bottom > 0) i.classList.add('in');
      });
    };
    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('resize', sweep);
    setTimeout(sweep, 260);
    setTimeout(sweep, 1200);
  }

  /* ---------- 数字滚动 ---------- */
  function animateNum(node) {
    const target = parseFloat(node.getAttribute('data-target'));
    const dec = parseInt(node.getAttribute('data-dec') || '0', 10);
    const dur = 1100;
    const t0 = performance.now();
    function step(t) {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      const v = target * e;
      node.textContent = dec === 0 ? Math.round(v).toLocaleString() : v.toFixed(dec);
      if (k < 1) requestAnimationFrame(step);
      else node.textContent = dec === 0 ? target.toLocaleString() : target.toFixed(dec);
    }
    requestAnimationFrame(step);
  }

  function counters() {
    const nodes = $$('[data-target]');
    if (!('IntersectionObserver' in window)) { nodes.forEach(animateNum); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const n = e.target;
          if (n.hasAttribute('data-target')) { animateNum(n); n.removeAttribute('data-target'); }
          io.unobserve(n);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -4% 0px' });
    nodes.forEach((n) => io.observe(n));
  }

  /* ---------- 核验修订 展开 ---------- */
  function revNotes() {
    $$('.rev').forEach((r) => {
      const chip = r.querySelector('.rev-chip');
      chip.setAttribute('role', 'button');
      chip.setAttribute('tabindex', '0');
      chip.setAttribute('aria-expanded', 'false');
      const toggle = () => {
        const open = r.classList.toggle('open');
        chip.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      chip.addEventListener('click', toggle);
      chip.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    });
  }

  /* ---------- 附录速查表 ---------- */
  function appendix() {
    const tbody = $('#appxBody');
    if (!tbody) return;
    const rows = global.APPX.map((r, i) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-idx', String(i + 1));
      tr.setAttribute('data-lv', r[2]);
      const link = r[5]
        ? '<a class="appx-link" href="' + r[5] + '" target="_blank" rel="noopener">' + r[4] +
          (r[6] ? '' : '<span class="search-tag">检索↗</span>') + '</a>'
        : '<span class="appx-link none">' + r[4] + '</span>';
      tr.innerHTML =
        '<td>' + r[0] + '</td>' +
        '<td>' + r[1] + '</td>' +
        '<td>' + r[3] + '</td>' +
        '<td class="appx-link">' + link + '</td>';
      return tr;
    });
    rows.forEach((tr) => tbody.appendChild(tr));

    const search = $('#appxSearch');
    function apply() {
      const q = (search.value || '').trim().toLowerCase();
      let shown = 0;
      rows.forEach((tr) => {
        const txt = tr.textContent.toLowerCase();
        const show = !q || txt.indexOf(q) >= 0;
        tr.style.display = show ? '' : 'none';
        if (show) shown++;
      });
      $('#appxCount').textContent = shown + ' / ' + rows.length;
    }
    search.addEventListener('input', apply);
    apply();

    /* 图表来源行 → 跳到附录并高亮 */
    $$('.src-link[data-appx]').forEach((a) => {
      a.setAttribute('role', 'link');
      a.setAttribute('tabindex', '0');
      const go = (ev) => {
        ev.preventDefault();
        const list = a.getAttribute('data-appx').split(',').map((x) => x.trim());
        search.value = '';
        apply();
        const target = document.getElementById('appendix');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        rows.forEach((tr) => tr.classList.remove('flash'));
        setTimeout(() => {
          list.forEach((n) => { const tr = rows[parseInt(n, 10) - 1]; if (tr) { tr.style.display = ''; tr.classList.add('flash'); } });
          if (list.length) { const tr = rows[parseInt(list[0], 10) - 1]; if (tr && tr.scrollIntoView) tr.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        }, 420);
      };
      a.addEventListener('click', go);
      a.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(e); } });
    });
  }

  /* ---------- 自测警示模块 ---------- */
  function selftest() {
    const box = $('#selftest');
    if (!box) return;
    const items = $$('.st-item', box);
    const count = $('#stCount');
    const verdict = $('#stVerdict');
    items.forEach((it) => {
      it.setAttribute('aria-pressed', 'false');
      const toggle = () => {
        const on = it.getAttribute('aria-pressed') !== 'true';
        it.setAttribute('aria-pressed', on ? 'true' : 'false');
        it.querySelector('.box').textContent = on ? '✓' : '';
        const n = items.filter((x) => x.getAttribute('aria-pressed') === 'true').length;
        count.innerHTML = '你已勾选 <b>' + n + '</b> / ' + items.length + ' 条';
        if (n === 0) {
          verdict.className = 'st-verdict';
          verdict.innerHTML = '先勾选几条，看看结果会怎么说。';
        } else if (n <= 2) {
          verdict.className = 'st-verdict';
          verdict.innerHTML = '“中了' + n + '条”——网络清单很可能接着写“你就是ADHD”。但拖延、走神、丢三落四、开会听不进去，是每个人都可能有的日常状态。';
        } else {
          verdict.className = 'st-verdict danger';
          verdict.innerHTML = '“中了' + n + '条就是ADHD”？<b>这不能确诊，请就医面诊。</b>网络自测清单与量表只是“筛查线索”，量表“不应被用于诊断目的”，而是临床结构化访谈的一部分。请到正规医院精神科或心理科挂号面诊，切勿根据网络信息自行服药。';
        }
      };
      it.addEventListener('click', toggle);
      it.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    });
  }

  /* ---------- 启动 ---------- */
  function boot() {
    global.mountIllustrations();
    global.renderCharts();
    progress();
    nav();
    reveal();
    counters();
    revNotes();
    appendix();
    selftest();

    /* QA 辅助：?only=章节id 只显示该板块；?at/?y 定位（正常访问无影响） */
    try {
      const sp = new URLSearchParams(location.search);
      const only = sp.get('only');
      if (only) {
        const hide = ['hero', 'numbers', 'ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ending', 'appendix']
          .filter((x) => x !== only).map((x) => '#' + x).join(',');
        const st = document.createElement('style');
        st.textContent = hide + '{display:none!important}.topnav{position:static!important}';
        document.head.appendChild(st);
      }
      const at = sp.get('at'), y = sp.get('y');
      if (at || y) {
        document.documentElement.style.scrollBehavior = 'auto';
        const go = () => {
          if (y) window.scrollTo(0, parseInt(y, 10));
          else { const t = document.getElementById(at); if (t) window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY - 66); }
        };
        go(); setTimeout(go, 500);
      }
      if (sp.has('debug')) {
        const report = () => {
          const cw = document.documentElement.clientWidth;
          const sw = document.documentElement.scrollWidth;
          const bad = [];
          document.querySelectorAll('body *').forEach((e) => {
            const r = e.getBoundingClientRect();
            if (r.width && r.right > cw + 1) bad.push(e.tagName + '.' + (e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className) + ' right=' + Math.round(r.right) + ' w=' + Math.round(r.width));
          });
          const d = document.createElement('pre');
          d.id = 'qa-debug';
          d.style.cssText = 'position:fixed;top:0;left:0;z-index:99999;background:#fff;color:#000;font-size:11px;padding:6px;max-height:100%;overflow:auto;max-width:100%';
          d.textContent = 'clientWidth=' + cw + ' scrollWidth=' + sw + '\n' + bad.slice(0, 40).join('\n');
          document.body.appendChild(d);
        };
        setTimeout(report, 900);
      }
    } catch (e) { }

    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(() => global.resizeCharts(), 160);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
