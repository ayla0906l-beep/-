/* ============================================================
   charts.js —— 14 张交互图
   ECharts 用于：图2 环形 / 图3 桑基 / 图7 气泡 / 图8 错配散点 /
                 图9 帕累托 / 图11 桑基 / 图12 倍率对比
   自绘 SVG / HTML 用于：图1 哑铃 / 图4 马赛克 / 图5 KPI / 图6 词云 /
                 图10 马赛克 / 图13 决策树 / 图14 五把尺子
   ============================================================ */
(function (global) {
  'use strict';

  const D = global.DATA;
  const instances = [];
  const BLUE = ['#2563EB', '#60A5FA', '#93C5FD', '#BFDBFE'];

  /* ---------- 工具 ---------- */
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };

  function host(mount, h) {
    mount.style.height = (typeof h === 'function' ? h() : h) + 'px';
    return mount;
  }

  function tipEl(mount) {
    let t = mount.querySelector('.chart-tip');
    if (!t) { t = el('div', 'chart-tip'); mount.appendChild(t); }
    return t;
  }
  function showTip(mount, ev, html) {
    const t = tipEl(mount);
    t.innerHTML = html;
    t.classList.add('show');
    const r = mount.getBoundingClientRect();
    let x = (ev.clientX != null ? ev.clientX - r.left : r.width / 2) + 14;
    let y = (ev.clientY != null ? ev.clientY - r.top : r.height / 2) - 10;
    if (x + t.offsetWidth > r.width - 4) x = x - t.offsetWidth - 28;
    if (y < 4) y = 4;
    if (y + t.offsetHeight > r.height - 4) y = r.height - t.offsetHeight - 4;
    t.style.left = x + 'px';
    t.style.top = y + 'px';
  }
  function hideTip(mount) { const t = mount.querySelector('.chart-tip'); if (t) t.classList.remove('show'); }

  /* 点击保留结论 */
  function pin(fig, text) {
    let p = fig.querySelector('.fig-pin');
    if (!p) { p = el('div', 'fig-pin'); fig.querySelector('.fig-foot').appendChild(p); }
    p.innerHTML = '<b>结论 · </b>' + text;
    p.classList.add('show');
  }

  const svgNS = 'http://www.w3.org/2000/svg';
  function svg(vb) {
    const s = document.createElementNS(svgNS, 'svg');
    s.setAttribute('viewBox', vb);
    s.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    s.style.width = '100%';
    s.style.height = 'auto';
    s.style.display = 'block';
    return s;
  }
  function sn(tag, attrs) {
    const e = document.createElementNS(svgNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  /* ============================================================
     图1 · 哑铃图（自绘 SVG）
     ============================================================ */
  function fig1(mount, fig) {
    const d = D.fig1;
    const W = 760, H = 300, X0 = 196, X1 = 648;
    const x = (v) => X0 + (v / 10) * (X1 - X0);
    const s = svg('0 0 ' + W + ' ' + H);
    mount.appendChild(s);

    const defs = sn('defs');
    s.appendChild(defs);

    /* 网格 */
    for (let v = 0; v <= 10; v += 2) {
      s.appendChild(sn('line', { x1: x(v), y1: 34, x2: x(v), y2: 258, stroke: '#E2E8F0', 'stroke-width': 1, 'stroke-dasharray': '3 4' }));
      const tx = sn('text', { x: x(v), y: 276, 'text-anchor': 'middle', 'font-size': 12, fill: '#94A3B8', 'font-family': 'inherit' });
      tx.textContent = v + '%';
      s.appendChild(tx);
    }

    /* 3% 基线 */
    s.appendChild(sn('line', { x1: x(3), y1: 30, x2: x(3), y2: 262, stroke: '#1E40AF', 'stroke-width': 1.6, 'stroke-dasharray': '6 4' }));
    const bl = sn('text', { x: x(3) + 6, y: 44, 'font-size': 12, fill: '#1E40AF', 'font-weight': '700', 'font-family': 'inherit' });
    bl.textContent = '成人患病率估计约3%';
    s.appendChild(bl);

    const rows = d.items;
    const rowH = 58, top = 66;

    rows.forEach((it, i) => {
      const y = top + i * rowH;
      const g = sn('g');
      g.setAttribute('class', 'db-row');
      g.style.cursor = 'pointer';

      /* 轨道 */
      g.appendChild(sn('line', { x1: x(0), y1: y, x2: x(10), y2: y, stroke: '#F1F5F9', 'stroke-width': 10, 'stroke-linecap': 'round' }));
      /* 哑铃 */
      g.appendChild(sn('line', { x1: x(3), y1: y, x2: x(it.value), y2: y, stroke: '#93C5FD', 'stroke-width': 6, 'stroke-linecap': 'round' }));
      /* 两端球 */
      g.appendChild(sn('circle', { cx: x(3), cy: y, r: 7, fill: '#fff', stroke: '#2563EB', 'stroke-width': 2 }));
      const isRef = it.level === 'ref';
      g.appendChild(sn('circle', {
        cx: x(it.value), cy: y, r: 10,
        fill: isRef ? '#DBEAFE' : '#2563EB',
        stroke: isRef ? '#1E40AF' : '#fff', 'stroke-width': isRef ? 2 : 2.4
      }));

      /* 名称 */
      const nm = sn('text', { x: X0 - 16, y: y + 4.5, 'text-anchor': 'end', 'font-size': 13.5, fill: '#0F2A43', 'font-weight': '600', 'font-family': 'inherit' });
      nm.textContent = it.name;
      g.appendChild(nm);

      /* 数值 */
      const vt = sn('text', { x: x(it.value) + 18, y: y + 5, 'font-size': 16, fill: '#2563EB', 'font-weight': '800', 'font-family': 'inherit' });
      vt.textContent = it.value + '%';
      g.appendChild(vt);

      if (!isRef) {
        const mt = sn('text', { x: x(it.value) + 18, y: y + 22, 'font-size': 11.5, fill: '#64748B', 'font-family': 'inherit' });
        mt.textContent = '约' + (it.value / 3).toFixed(1) + '倍';
        g.appendChild(mt);
      }

      const html = '<b>' + it.name + '</b><br>检出率 <b>' + it.value + '%</b><br>样本：' + it.sample + '<br>来源：' + it.src;
      g.addEventListener('mouseenter', (ev) => showTip(mount, ev, html));
      g.addEventListener('mousemove', (ev) => showTip(mount, ev, html));
      g.addEventListener('mouseleave', () => hideTip(mount));
      g.setAttribute('tabindex', '0');
      g.addEventListener('focus', () => {
        const r = mount.getBoundingClientRect();
        showTip(mount, { clientX: r.left + r.width * 0.55, clientY: r.top + (y / H) * r.height }, html);
      });
      g.addEventListener('blur', () => hideTip(mount));
      g.addEventListener('click', () => pin(fig, it.name + '：检出率 ' + it.value + '%（' + it.sample + '）——是成人患病率估计值3%的约' + (it.value / 3).toFixed(1) + '倍。'));

      s.appendChild(g);
    });

    const note = sn('text', { x: (X0 + X1) / 2, y: 292, 'text-anchor': 'middle', 'font-size': 11.5, fill: '#94A3B8', 'font-family': 'inherit' });
    note.textContent = '哑铃两端：左端＝成人患病率估计3%，右端＝该研究的量表筛查检出率';
    s.appendChild(note);
  }

  /* ============================================================
     图2 · 环形图（自绘 SVG：左环 + 右侧账号卡片联动）
     ============================================================ */
  function fig2(mount, fig) {
    host(mount, () => (window.innerWidth < 720 ? 660 : 430));
    const items = D.fig2.items;
    const COLORS = { '个人博主': '#2563EB', '普通用户': '#60A5FA', '营销号': '#94A3B8', '医生认证': '#BFDBFE', '机构账号': '#DBEAFE' };
    const pro = { 医生认证: 1, 机构账号: 1 };
    const cardOrder = ['个人博主', '普通用户', '医生认证', '营销号', '机构账号'];
    const byName = {};
    items.forEach((it) => { byName[it.name] = it; });

    /* 布局：左图 + 右卡片 */
    const wrap = el('div', 'f2wrap');
    const chartDiv = el('div', 'f2chart');
    const cardsBox = el('div', 'f2cards');
    wrap.appendChild(chartDiv); wrap.appendChild(cardsBox);
    mount.appendChild(wrap);

    /* ---- 左侧环形图（自绘 SVG） ---- */
    const W = 600, H = 430, cx = 300, cy = 215, R1 = 152, R0 = 104;
    const s = svg('0 0 ' + W + ' ' + H);
    chartDiv.appendChild(s);

    const P = (r, a) => (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2);
    function arcPath(a0, a1) {
      const large = (a1 - a0) > Math.PI ? 1 : 0;
      return 'M' + P(R1, a0) + ' A' + R1 + ' ' + R1 + ' 0 ' + large + ' 1 ' + P(R1, a1) +
             ' L' + P(R0, a1) + ' A' + R0 + ' ' + R0 + ' 0 ' + large + ' 0 ' + P(R0, a0) + ' Z';
    }

    /* 扇区（从正上方顺时针） */
    const paths = {};
    let acc = -Math.PI / 2;
    const sectors = items.map((it) => {
      const a0 = acc, a1 = acc + (it.value / 381) * 2 * Math.PI;
      acc = a1;
      const p = sn('path', {
        d: arcPath(a0, a1), fill: COLORS[it.name], stroke: '#fff',
        'stroke-width': 2, 'stroke-linejoin': 'round', cursor: 'pointer'
      });
      s.appendChild(p);
      paths[it.name] = p;
      return { it, a0, a1 };
    });
    /* 持证专业切片加深色描边 */
    sectors.forEach(({ it, a0, a1 }) => {
      if (pro[it.name]) s.appendChild(sn('path', {
        d: arcPath(a0, a1), fill: 'none', stroke: '#1E40AF',
        'stroke-width': 1.6, 'pointer-events': 'none'
      }));
    });

    /* 引导线标签（左右分侧 + 防重叠） */
    const midOf = (a0, a1) => (a0 + a1) / 2;
    const lefts = [], rights = [];
    sectors.forEach(({ it, a0, a1 }) => {
      const mid = midOf(a0, a1), c = Math.cos(mid), si = Math.sin(mid);
      const side = c >= 0 ? 1 : -1;
      const lbl = {
        it, side,
        ax: cx + (R1 + 4) * c, ay: cy + (R1 + 4) * si,
        ex: cx + side * (R1 + 18), ly: cy + (R1 + 4) * si
      };
      (side > 0 ? rights : lefts).push(lbl);
    });
    [lefts, rights].forEach((arr) => {
      arr.sort((a, b) => a.ly - b.ly);
      for (let i = 1; i < arr.length; i++) {
        if (arr[i].ly - arr[i - 1].ly < 38) arr[i].ly = arr[i - 1].ly + 38;
      }
    });
    [lefts, rights].flat().forEach(({ it, side, ax, ay, ex, ly }) => {
      const tx = ex + side * 12;
      s.appendChild(sn('polyline', {
        points: ax.toFixed(1) + ',' + ay.toFixed(1) + ' ' + ex.toFixed(1) + ',' + ly.toFixed(1) + ' ' + tx + ',' + ly,
        fill: 'none', stroke: '#94A3B8', 'stroke-width': 1, 'pointer-events': 'none'
      }));
      const t = sn('text', {
        x: tx + side * 4, y: ly - 2, 'text-anchor': side > 0 ? 'start' : 'end',
        'font-size': 12.5, fill: '#0F2A43', 'font-weight': 600, 'font-family': 'inherit',
        'pointer-events': 'none'
      });
      const l1 = sn('tspan', { x: tx + side * 4 }); l1.textContent = it.name + ' ' + it.value + '条';
      const l2 = sn('tspan', { x: tx + side * 4, dy: 17, fill: '#64748B', 'font-weight': 400 }); l2.textContent = it.pct;
      t.appendChild(l1); t.appendChild(l2);
      s.appendChild(t);
    });

    /* 中心数字 */
    const mkTxt = (y, size, fill, weight) => sn('text', {
      x: cx, y, 'text-anchor': 'middle', 'font-size': size, fill,
      'font-weight': weight, 'font-family': 'inherit', 'pointer-events': 'none'
    });
    const t1 = mkTxt(cy + 4, 42, '#2563EB', 800); t1.textContent = '84.3%';
    const t2 = mkTxt(cy + 30, 13.5, '#334155', 600); t2.textContent = '个人博主＋普通用户';
    const t3 = mkTxt(cy + 52, 12, '#94A3B8', 400); t3.textContent = '持证专业账号不足 10%';
    s.appendChild(t1); s.appendChild(t2); s.appendChild(t3);

    /* ---- 右侧账号卡片 ---- */
    const cardEls = {};
    cardOrder.forEach((name) => {
      const it = byName[name];
      const card = el('div', 'f2card');
      card.dataset.name = name;
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.innerHTML = '<span class="dot" style="background:' + COLORS[name] +
        (pro[name] ? ';border:2px solid #1E40AF' : '') + '"></span>' +
        '<span class="nm">' + name + '</span>' +
        '<span class="val">' + it.value + '条 · ' + it.pct + '</span>';
      cardsBox.appendChild(card);
      cardEls[name] = card;
    });

    function dim(key) {
      sectors.forEach(({ it }) => {
        paths[it.name].style.opacity = (!key || it.name === key) ? 1 : 0.32;
      });
    }
    function setActive(key) {
      cardOrder.forEach((n) => cardEls[n].classList.toggle('on', n === key));
      document.querySelectorAll('[data-acc]').forEach((sp) => {
        sp.classList.toggle('acc-hl', sp.getAttribute('data-acc') === key);
      });
      dim(key);
      if (key) {
        const it = byName[key];
        pin(fig, key + '：' + it.value + '条，占381条样本的 ' + it.pct + '。' +
          (pro[key] ? '属持证专业账号。' : '属非持证创作者。'));
      }
    }

    sectors.forEach(({ it }) => {
      const name = it.name;
      const html = '<b>' + name + '</b><br>' + it.value + '条 · 占381条样本的 ' + it.pct;
      const p = paths[name];
      p.addEventListener('mouseenter', (ev) => { dim(name); showTip(mount, ev, html); });
      p.addEventListener('mousemove', (ev) => showTip(mount, ev, html));
      p.addEventListener('mouseleave', () => { dim(null); hideTip(mount); });
      p.addEventListener('click', () => setActive(name));
    });
    cardOrder.forEach((name) => {
      const card = cardEls[name];
      card.addEventListener('mouseenter', () => dim(name));
      card.addEventListener('mouseleave', () => dim(null));
      card.addEventListener('click', () => setActive(name));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(name); }
      });
    });
  }

  /* ============================================================
     图3 · 桑基图（账号身份 → 内容类型）
     ============================================================ */
  function fig3(mount, fig) {
    host(mount, () => (window.innerWidth < 640 ? 260 : 300));
    const c = echarts.init(mount);
    instances.push(c);
    const colorOf = (n) => {
      if (n.indexOf('医生认证') === 0) return '#60A5FA';
      if (n.indexOf('营销号') === 0) return '#94A3B8';
      if (n.indexOf('医学科普') === 0) return '#BFDBFE';
      if (n.indexOf('自测诊断') === 0) return '#2563EB';
      return '#DBEAFE';
    };
    const bare = (n) => n.replace(/ \d+条$/, '');
    c.setOption({
      tooltip: {
        trigger: 'item',
        formatter: (p) => p.dataType === 'edge'
          ? '<b>' + bare(p.data.source) + '</b> → <b>' + bare(p.data.target) + '</b><br>' + p.data.value + '条 · 占该身份 ' + p.data.pct
          : '<b>' + bare(p.name) + '</b>'
      },
      series: [{
        type: 'sankey', left: 8, right: 128, top: 12, bottom: 12,
        nodeWidth: 16, nodeGap: 16, draggable: false,
        emphasis: { focus: 'adjacency' },
        data: D.fig3.nodes.map((n) => ({
          name: n.name,
          itemStyle: { color: colorOf(n.name), borderColor: '#1E40AF', borderWidth: 1 }
        })),
        links: D.fig3.links,
        label: { fontSize: 12.5, color: '#0F2A43', fontWeight: 600 },
        lineStyle: { color: 'gradient', opacity: 0.42, curveness: 0.5 }
      }]
    });
    c.on('click', (p) => {
      if (p.dataType === 'edge') {
        pin(fig, bare(p.data.source) + ' → ' + bare(p.data.target) + '：' + p.data.value + '条，占该身份 ' + p.data.pct + '。');
      } else {
        pin(fig, '节点：' + bare(p.name) + '。');
      }
    });
    return c;
  }

  /* ============================================================
     图4 · 方格马赛克 100 格（每格＝3.81条）
     ============================================================ */
  function fig4(mount, fig) {
    const g = el('div', 'waffle waffle-100');
    const cells = [];
    D.fig4.groups.forEach((grp) => {
      for (let i = 0; i < grp.cells; i++) {
        const c = el('div', 'waffle-cell');
        c.style.background = grp.color;
        if (grp.cat === 'pro') c.style.border = '1px solid #1E40AF';
        c.setAttribute('role', 'button');
        c.setAttribute('tabindex', '0');
        c.setAttribute('data-grp', grp.key);
        c.setAttribute('aria-label', grp.label + ' ' + grp.value + '条 ' + grp.pct);
        const html = '<b>' + grp.label + '</b><br>' + grp.value + '条 · ' + grp.pct + '<br>归类：' + (grp.cat === 'pro' ? '持证专业账号' : grp.cat === 'ad' ? '营销号/广告' : '非持证/素人');
        c.addEventListener('mouseenter', (ev) => showTip(mount, ev, html));
        c.addEventListener('mousemove', (ev) => showTip(mount, ev, html));
        c.addEventListener('mouseleave', () => hideTip(mount));
        c.addEventListener('focus', () => { const r = c.getBoundingClientRect(); showTip(mount, { clientX: r.left + 8, clientY: r.top + 8 }, html); });
        c.addEventListener('blur', () => hideTip(mount));
        c.addEventListener('click', () => pin(fig, grp.label + '：' + grp.value + '条（' + grp.pct + '），100格里占 ' + grp.cells + ' 格。'));
        cells.push({ node: c, grp: grp });
        g.appendChild(c);
      }
    });
    mount.appendChild(g);

    const legend = el('div', 'waffle-legend');
    D.fig4.groups.forEach((grp) => {
      const b = el('button');
      b.setAttribute('aria-pressed', 'true');
      b.innerHTML = '<i style="background:' + grp.color + (grp.cat === 'pro' ? ';border:1px solid #1E40AF' : '') + '"></i>' + grp.label + ' ' + grp.value + '条（' + grp.pct + '）';
      b.addEventListener('click', () => {
        const on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        cells.forEach((o) => o.node.classList.toggle('dim', o.grp.key === grp.key && !on));
      });
      legend.appendChild(b);
    });
    D.fig4.summary.forEach((s) => {
      const sp = el('div', '', '<b>' + s.pct + '</b> ' + s.label + '（' + s.value + '，' + s.cells + '格）');
      sp.style.fontSize = '13px';
      sp.style.color = '#0F2A43';
      sp.style.gridColumn = '1 / -1';
      legend.appendChild(sp);
    });
    mount.appendChild(legend);
  }

  /* ============================================================
     图5 · KPI 数据卡片组（环形进度 / 点阵 / 仪表弧）
     ============================================================ */
  function fig5(mount, fig) {
    const grid = el('div', 'kpi-grid');
    const items = D.fig5;
    const PCT = [items[0].num, items[1].num, items[2].num]; // 48.7 / 83.6 / 50

    /* --- 卡1：环形进度 48.7% --- */
    function ringCard() {
      const card = el('div', 'kpi2');
      const vis = el('div', 'k-visual');
      const R = 44, C = 2 * Math.PI * R;
      vis.innerHTML =
        '<svg viewBox="0 0 120 120" role="img" aria-label="48.7%">' +
        '<circle cx="60" cy="60" r="' + R + '" fill="none" stroke="#DBEAFE" stroke-width="11"/>' +
        '<circle class="ring-fg" cx="60" cy="60" r="' + R + '" fill="none" stroke="#2563EB" stroke-width="11" ' +
        'stroke-linecap="round" stroke-dasharray="0 ' + C.toFixed(2) + '" transform="rotate(-90 60 60)"/></svg>';
      const num0 = el('div', 'k-num');
      num0.innerHTML = '<span data-target="' + PCT[0] + '" data-dec="1">0</span><span class="unit">%</span>';
      card.appendChild(vis);
      card.appendChild(num0);
      card.appendChild(el('div', 'k-lab', items[0].lab));
      card.appendChild(el('div', 'k-sub', items[0].sub));
      return card;
    }

    /* --- 卡2：点阵 83.6%（40 点 ≈ 33 点着色） --- */
    function dotsCard() {
      const card = el('div', 'kpi2');
      const total = 40, on = Math.round(PCT[1] / 100 * total);
      const box = el('div', 'k-visual k-dots');
      let html = '';
      for (let i = 0; i < total; i++) html += '<span class="' + (i < on ? 'on' : '') + '" style="transition-delay:' + (i * 28) + 'ms"></span>';
      box.innerHTML = html;
      const num = el('div', 'k-num');
      num.innerHTML = '<span data-target="' + PCT[1] + '" data-dec="1">0</span><span class="unit">%</span>';
      card.appendChild(box); card.appendChild(num);
      card.appendChild(el('div', 'k-lab', items[1].lab));
      card.appendChild(el('div', 'k-sub', items[1].sub));
      return card;
    }

    /* --- 卡3：仪表弧 50% --- */
    function gaugeCard() {
      const card = el('div', 'kpi2');
      const vis = el('div', 'k-visual');
      vis.innerHTML =
        '<svg viewBox="0 -20 120 140" role="img" aria-label="50%">' +
        '<path d="M22.3 89.7 A53.5 53.5 0 1 1 97.7 89.7" fill="none" stroke="#DBEAFE" stroke-width="11" stroke-linecap="round"/>' +
        '<path class="gauge-fg" d="M22.3 89.7 A53.5 53.5 0 1 1 97.7 89.7" fill="none" stroke="#2563EB" stroke-width="11" ' +
        'stroke-linecap="round" pathLength="100" stroke-dasharray="0 100"/></svg>';
      const num2 = el('div', 'k-num');
      num2.innerHTML = '<span data-target="' + PCT[2] + '" data-dec="0">0</span><span class="unit">%</span>';
      card.appendChild(vis);
      card.appendChild(num2);
      card.appendChild(el('div', 'k-lab', items[2].lab));
      card.appendChild(el('div', 'k-sub', items[2].sub));
      return card;
    }

    const cards = [ringCard(), dotsCard(), gaugeCard()];
    const clickInfo = [
      items[0].lab + '：' + items[0].num + items[0].unit + '（' + items[0].sub + '）。',
      items[1].lab + '：' + items[1].num + items[1].unit + '（' + items[1].sub + '）。',
      items[2].lab + '：' + items[2].num + items[2].unit + '（' + items[2].sub + '）。'
    ];
    cards.forEach((card, i) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('click', () => pin(fig, clickInfo[i]));
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); } });
      grid.appendChild(card);
    });
    mount.appendChild(grid);

    /* 进入视口时触发动画 */
    const ringFg = cards[0].querySelector('.ring-fg');
    const gaugeFg = cards[2].querySelector('.gauge-fg');
    function play() {
      if (grid.classList.contains('play')) return;
      grid.classList.add('play');
      const R = 44, C = 2 * Math.PI * R;
      ringFg.setAttribute('stroke-dasharray', (PCT[0] / 100 * C).toFixed(2) + ' ' + C.toFixed(2));
      gaugeFg.setAttribute('stroke-dasharray', PCT[2] + ' 100');
    }
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { play(); io.disconnect(); } });
      }, { threshold: 0.25 });
      io.observe(grid);
      setTimeout(() => { if (!grid.classList.contains('play')) { play(); io.disconnect(); } }, 2600);
    } else play();

    const extra = el('div', 'fig-hint center', '同一研究对843名大学生的调查显示：自我诊断者（421人）是正式确诊者（198人）的两倍多。');
    extra.style.padding = '6px 6px 8px';
    mount.appendChild(extra);
  }

  /* ============================================================
     图6 · 词云（分级字号 + 类别着色）
     ============================================================ */
  function fig6(mount, fig) {
    const w = el('div', 'cloud');
    const max = 32, min = 1;
    D.fig6.words.forEach((it) => {
      const size = 15 + (it.n - min) / (max - min) * 27;
      const e = el('span', 'cloud-item ' + (it.k === 'clin' ? 'clin' : it.k === 'med' ? 'med' : 'neutral'), it.t);
      e.style.fontSize = Math.max(15, size).toFixed(0) + 'px';
      e.setAttribute('tabindex', '0');
      e.setAttribute('role', 'button');
      e.setAttribute('aria-label', it.t + ' 出现在 ' + it.n + ' 条标题');
      const html = '<b>' + it.t + '</b><br>出现在 <b>' + it.n + '</b> 条标题（共381条）' +
        (it.k === 'clin' ? '<br><span style="color:#B45309">医疗路径词</span>' : it.k === 'med' ? '<br>症状／情绪词' : '<br>其他高频词');
      e.addEventListener('mouseenter', (ev) => showTip(mount, ev, html));
      e.addEventListener('mousemove', (ev) => showTip(mount, ev, html));
      e.addEventListener('mouseleave', () => hideTip(mount));
      e.addEventListener('focus', () => { const r = e.getBoundingClientRect(); showTip(mount, { clientX: r.left + 6, clientY: r.top + 6 }, html); });
      e.addEventListener('blur', () => hideTip(mount));
      e.addEventListener('click', () => {
        w.querySelectorAll('.cloud-item').forEach((x) => x.classList.remove('active'));
        e.classList.add('active');
        pin(fig, '“' + it.t + '”出现在 ' + it.n + ' 条标题（381条样本）。');
      });
      e.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); e.click(); } });
      w.appendChild(e);
    });
    mount.appendChild(w);
  }

  /* ============================================================
     图7 · 气泡图
     ============================================================ */
  function fig7(mount, fig) {
    host(mount, () => (window.innerWidth < 640 ? 300 : 350));
    const c = echarts.init(mount);
    instances.push(c);
    const pts = D.fig7.map((p, i) => ({
      name: p.name, value: [p.count, p.likes, p.count],
      itemStyle: { color: i === 0 ? '#2563EB' : i === 1 ? '#BFDBFE' : '#93C5FD', borderColor: '#1E40AF', borderWidth: i === 1 ? 2 : 1 }
    }));
    c.setOption({
      grid: { left: 62, right: 30, top: 34, bottom: 52 },
      tooltip: {
        trigger: 'item',
        formatter: (p) => {
          const v = p.value;
          return '<b>' + p.name + '</b><br>条数：<b>' + v[0] + '条</b><br>平均点赞：<b>' + v[1].toLocaleString() + '次</b>';
        }
      },
      xAxis: { name: '条数', nameLocation: 'middle', nameGap: 28, nameTextStyle: { fontSize: 12, color: '#64748B' }, min: 0, max: 140, splitLine: { lineStyle: { color: '#F1F5F9' } }, axisLabel: { fontSize: 12, color: '#64748B' } },
      yAxis: { name: '平均点赞（次）', nameTextStyle: { fontSize: 12, color: '#64748B' }, min: 0, max: 34000, splitLine: { lineStyle: { color: '#F1F5F9' } }, axisLabel: { fontSize: 12, color: '#64748B', formatter: (v) => (v / 1000) + 'k' } },
      series: [{
        type: 'scatter', data: pts,
        symbolSize: (v) => 20 + v[2] * 0.55,
        label: { show: true, formatter: (p) => p.name, position: 'top', fontSize: 12.5, color: '#0F2A43', fontWeight: 600 },
        emphasis: { itemStyle: { shadowBlur: 14, shadowColor: 'rgba(37,99,235,.35)' } },
        markLine: {
          silent: true, symbol: 'none',
          lineStyle: { type: 'dashed', color: '#94A3B8' },
          label: { formatter: '持证医学科普 12880', position: 'insideMiddleTop', fontSize: 11.5, color: '#64748B' },
          data: [{ yAxis: 12880 }]
        }
      }]
    });
    c.on('click', (p) => {
      const v = p.value;
      pin(fig, p.name + '：' + v[0] + '条，平均点赞 ' + v[1].toLocaleString() + '次。自测诊断30260 ÷ 持证科普12880 ≈ 2.35倍。');
    });
    return c;
  }

  /* ============================================================
     图8 · 错配散点图
     ============================================================ */
  function fig8(mount, fig) {
    host(mount, () => (window.innerWidth < 640 ? 320 : 380));
    const c = echarts.init(mount);
    instances.push(c);
    const pts = D.fig8.map((p) => ({
      name: p.name, value: [p.share, +(p.share + p.gap).toFixed(1), p.gap],
      itemStyle: { color: p.color, borderColor: p.color === '#BFDBFE' ? '#1E40AF' : 'rgba(15,42,67,.25)', borderWidth: p.color === '#BFDBFE' ? 2 : 1 }
    }));
    c.setOption({
      grid: { left: 66, right: 34, top: 34, bottom: 56 },
      tooltip: {
        trigger: 'item',
        formatter: (p) => '<b>' + p.name + '</b><br>条数占比：<b>' + p.value[0] + '%</b><br>点赞占比：<b>' + p.value[1] + '%</b><br>错配：<b>' + (p.value[2] > 0 ? '+' : '') + p.value[2] + '个百分点</b>'
      },
      xAxis: {
        name: '条数占比（%）', nameLocation: 'middle', nameGap: 30, nameTextStyle: { fontSize: 12, color: '#64748B' },
        min: 0, max: 36, splitLine: { lineStyle: { color: '#F1F5F9' } }, axisLabel: { fontSize: 12, color: '#64748B', formatter: '{value}%' }
      },
      yAxis: {
        name: '点赞占比（%）', nameTextStyle: { fontSize: 12, color: '#64748B' },
        min: 0, max: 36, splitLine: { lineStyle: { color: '#F1F5F9' } }, axisLabel: { fontSize: 12, color: '#64748B', formatter: '{value}%' }
      },
      series: [
        {
          type: 'line', silent: true, symbol: 'none', animation: false,
          lineStyle: { color: '#CBD5E1', type: 'dashed', width: 1.5 },
          label: { show: true, formatter: '条数＝点赞 匹配线', position: 'end', fontSize: 11.5, color: '#94A3B8' },
          data: [[0, 0], [36, 36]], z: 1
        },
        {
          type: 'scatter', data: pts, symbolSize: 26, z: 3,
          label: {
            show: true, position: 'right', fontSize: 12, color: '#0F2A43', fontWeight: 600,
            formatter: (p) => p.name + '  ' + (p.value[2] > 0 ? '+' : '') + p.value[2]
          },
          emphasis: { itemStyle: { shadowBlur: 14, shadowColor: 'rgba(37,99,235,.35)' }, scale: 1.3 }
        }
      ]
    });
    c.on('click', (p) => {
      pin(fig, p.name + '：条数占比 ' + p.value[0] + '%，点赞占比 ' + p.value[1] + '%，错配 ' + (p.value[2] > 0 ? '+' : '') + p.value[2] + ' 个百分点。');
    });
    return c;
  }

  /* ============================================================
     图9 · 帕累托曲线（抖音 / 小红书 切换）
     ============================================================ */
  function fig9(mount, fig) {
    const bar = el('div', 'toggle-group');
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', '切换平台');
    const inner = el('div');
    inner.style.height = (window.innerWidth < 640 ? 300 : 360) + 'px';
    mount.appendChild(bar);
    mount.appendChild(inner);

    const c = echarts.init(inner);
    instances.push(c);

    function build(key) {
      const cfg = D.fig9[key];
      const pts = [[0, 0]];
      cfg.marks.forEach((m) => pts.push([+(m.n / cfg.total * 100).toFixed(2), m.cum]));
      pts.push([100, 100]);
      return { cfg, pts };
    }

    function render(key) {
      const { cfg, pts } = build(key);
      c.setOption({
        grid: { left: 62, right: 34, top: 40, bottom: 54 },
        tooltip: {
          trigger: 'axis',
          formatter: (ps) => {
            const p = ps[0];
            return '<b>' + key + '（样本' + cfg.total + '条）</b><br>条数占比 ' + p.value[0] + '%<br>累计点赞占比 <b>' + p.value[1] + '%</b>';
          }
        },
        xAxis: {
          name: '条数占比（%）', nameLocation: 'middle', nameGap: 30, nameTextStyle: { fontSize: 12, color: '#64748B' },
          min: 0, max: 100, splitLine: { lineStyle: { color: '#F1F5F9' } }, axisLabel: { fontSize: 12, color: '#64748B', formatter: '{value}%' }
        },
        yAxis: {
          name: '累计点赞占比（%）', nameTextStyle: { fontSize: 12, color: '#64748B' },
          min: 0, max: 100, splitLine: { lineStyle: { color: '#F1F5F9' } }, axisLabel: { fontSize: 12, color: '#64748B', formatter: '{value}%' }
        },
        series: [
          {
            type: 'line', silent: true, symbol: 'none', animation: false,
            lineStyle: { color: '#CBD5E1', type: 'dashed', width: 1.5 },
            data: [[0, 0], [100, 100]], z: 1
          },
          {
            name: key, type: 'line', smooth: 0.3, symbol: 'circle', symbolSize: 9, z: 3,
            data: pts,
            lineStyle: { width: 3, color: '#2563EB' },
            itemStyle: { color: '#2563EB', borderColor: '#fff', borderWidth: 2 },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(37,99,235,.22)' },
                { offset: 1, color: 'rgba(37,99,235,.02)' }
              ])
            },
            markPoint: {
              symbol: 'circle', symbolSize: 12,
              itemStyle: { color: '#1E40AF', borderColor: '#fff', borderWidth: 2 },
              label: { show: true, position: 'right', offset: [8, 0], fontSize: 11.5, fontWeight: 700, color: '#1E40AF', formatter: (p) => p.data.label },
              data: cfg.marks.map((m) => ({
                coord: [+(m.n / cfg.total * 100).toFixed(2), m.cum],
                label: {
                  show: true,
                  position: 'right',
                  offset: [8, 0],
                  fontSize: 11.5, fontWeight: 700, color: '#1E40AF',
                  formatter: () => m.label
                }
              }))
            }
          }
        ]
      });
    }

    ['抖音', '小红书'].forEach((key, i) => {
      const b = el('button', 'toggle-btn', key + '（' + D.fig9[key].total + '条）');
      b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.addEventListener('click', () => {
        bar.querySelectorAll('.toggle-btn').forEach((x) => x.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
        render(key);
        const cfg = D.fig9[key];
        const m0 = cfg.marks[0];
        pin(fig, key + '：前' + m0.n + '条（占样本' + (m0.n / cfg.total * 100).toFixed(1) + '%）就拿走 ' + m0.cum + '% 的点赞。');
      });
      bar.appendChild(b);
    });

    render('抖音');
    return c;
  }

  /* ============================================================
     图10 · 方块马赛克 100 格
     ============================================================ */
  function fig10(mount, fig) {
    const g = el('div', 'waffle waffle-100');
    const cells = [];
    D.fig10.forEach((grp) => {
      for (let i = 0; i < grp.cells; i++) {
        const c = el('div', 'waffle-cell');
        c.style.background = grp.color;
        c.setAttribute('role', 'button');
        c.setAttribute('tabindex', '0');
        c.setAttribute('data-grp', grp.key);
        c.setAttribute('aria-label', grp.label + ' ' + grp.value + '条 ' + grp.pct);
        const html = '<b>' + grp.label + '</b><br>' + grp.value + '条 · ' + grp.pct + '<br>' + grp.desc;
        c.addEventListener('mouseenter', (ev) => showTip(mount, ev, html));
        c.addEventListener('mousemove', (ev) => showTip(mount, ev, html));
        c.addEventListener('mouseleave', () => hideTip(mount));
        c.addEventListener('focus', () => { const r = c.getBoundingClientRect(); showTip(mount, { clientX: r.left + 8, clientY: r.top + 8 }, html); });
        c.addEventListener('blur', () => hideTip(mount));
        c.addEventListener('click', () => pin(fig, grp.label + '：' + grp.value + '条（' + grp.pct + '），' + grp.desc + '。'));
        cells.push({ node: c, key: grp.key });
        g.appendChild(c);
      }
    });
    mount.appendChild(g);
    const legend = el('div', 'waffle-legend');
    D.fig10.forEach((grp) => {
      const b = el('button');
      b.setAttribute('aria-pressed', 'true');
      b.innerHTML = '<i style="background:' + grp.color + '"></i>' + grp.label + ' ' + grp.value + '条（' + grp.pct + '，' + grp.cells + '格）';
      b.addEventListener('click', () => {
        const on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        cells.forEach((o) => o.node.classList.toggle('dim', o.key === grp.key && !on));
      });
      legend.appendChild(b);
    });
    const s = el('div', '', '<b>55.1%</b> 中风险169条＋高风险41条，合计210条');
    s.style.fontSize = '13px'; s.style.color = '#0F2A43';
    s.style.gridColumn = '1 / -1';
    legend.appendChild(s);
    mount.appendChild(legend);
  }

  /* ============================================================
     图11 · 桑基图（变现链路）
     ============================================================ */
  function fig11(mount, fig) {
    host(mount, () => (window.innerWidth < 640 ? 300 : 340));
    const c = echarts.init(mount);
    instances.push(c);
    const colorOf = (n) => {
      if (n.indexOf('自测诊断') === 0) return '#2563EB';
      if (n.indexOf('广告营销') === 0) return '#94A3B8';
      if (n.indexOf('玩梗二创') === 0) return '#60A5FA';
      if (n.indexOf('高风险') === 0) return '#F59E0B';
      if (n.indexOf('推销') === 0) return '#EF4444';
      return '#F59E0B';
    };
    c.setOption({
      tooltip: {
        trigger: 'item',
        formatter: (p) => p.dataType === 'edge'
          ? '<b>' + p.data.source + '</b> → <b>' + p.data.target + '</b><br>' + p.data.value + '条' + (p.data.extra ? '（' + p.data.extra + '）' : '')
          : '<b>' + p.name + '</b>'
      },
      series: [{
        type: 'sankey', left: 26, right: 108, top: 10, bottom: 10,
        nodeWidth: 16, nodeGap: 14, draggable: false,
        emphasis: { focus: 'adjacency' },
        data: D.fig11.nodes.map((n) => ({
          name: n.name,
          itemStyle: { color: colorOf(n.name), borderColor: '#1E40AF', borderWidth: 1 }
        })),
        links: D.fig11.links,
        label: { fontSize: 12, color: '#0F2A43', fontWeight: 600 },
        lineStyle: { color: 'gradient', opacity: 0.4, curveness: 0.5 }
      }]
    });
    c.on('click', (p) => {
      if (p.dataType === 'edge') {
        pin(fig, p.data.source + ' → ' + p.data.target + '：' + p.data.value + '条。' + (p.data.extra ? '（' + p.data.extra + '）' : ''));
      }
    });
    return c;
  }

  /* ============================================================
     图12 · 倍率对比（双 grid）
     ============================================================ */
  function fig12(mount, fig) {
    host(mount, () => (window.innerWidth < 640 ? 300 : 330));
    const c = echarts.init(mount);
    instances.push(c);
    const doc = D.fig12.doctors, vid = D.fig12.videos;
    c.setOption({
      title: [
        { text: doc.title, left: '3%', top: 2, textStyle: { fontSize: 13.5, fontWeight: 700, color: '#0F2A43', fontFamily: 'inherit' }, subtext: '平台自报口径 · ' + doc.tag, subtextStyle: { fontSize: 11.5, color: '#94A3B8', fontFamily: 'inherit' } },
        { text: vid.title, left: '56%', top: 2, textStyle: { fontSize: 13.5, fontWeight: 700, color: '#0F2A43', fontFamily: 'inherit' }, subtext: '平台自报口径 · ' + vid.tag, subtextStyle: { fontSize: 11.5, color: '#94A3B8', fontFamily: 'inherit' } }
      ],
      tooltip: { trigger: 'item', formatter: (p) => '<b>' + p.name + '</b><br>' + p.data.show + (p.dataIndex === 1 ? '' : '') },
      grid: [
        { left: '3%', width: '41%', top: 66, bottom: 34, containLabel: true },
        { left: '56%', width: '41%', top: 66, bottom: 34, containLabel: true }
      ],
      xAxis: [
        { gridIndex: 0, type: 'value', max: 820, axisLabel: { fontSize: 11.5, color: '#64748B' }, splitLine: { lineStyle: { color: '#F1F5F9' } } },
        { gridIndex: 1, type: 'value', max: 700000, interval: 100000, axisLabel: { fontSize: 11.5, color: '#64748B', formatter: (v) => (v / 10000) + '万' }, splitLine: { lineStyle: { color: '#F1F5F9' } } }
      ],
      yAxis: [
        { gridIndex: 0, type: 'category', data: doc.items.map((x) => x[0]), axisLabel: { fontSize: 11.5, color: '#475569' }, axisTick: { show: false } },
        { gridIndex: 1, type: 'category', data: vid.items.map((x) => x[0]), axisLabel: { fontSize: 11.5, color: '#475569' }, axisTick: { show: false } }
      ],
      series: [
        {
          type: 'bar', xAxisIndex: 0, yAxisIndex: 0, barWidth: 24,
          data: doc.items.map((x, i) => ({ value: x[1], show: x[1] + '名', itemStyle: { color: i === 0 ? '#93C5FD' : '#2563EB', borderRadius: [0, 5, 5, 0] } })),
          label: { show: true, position: 'right', fontSize: 12.5, fontWeight: 700, color: '#1E40AF', formatter: (p) => p.data.show },
          animationDelay: (i) => i * 220
        },
        {
          type: 'bar', xAxisIndex: 1, yAxisIndex: 1, barWidth: 24,
          data: vid.items.map((x, i) => ({ value: x[1], show: x[2], itemStyle: { color: i === 0 ? '#93C5FD' : '#2563EB', borderRadius: [0, 5, 5, 0] } })),
          label: { show: true, position: 'right', fontSize: 12.5, fontWeight: 700, color: '#1E40AF', formatter: (p) => p.data.show },
          animationDelay: (i) => i * 220
        }
      ]
    });
    c.on('click', (p) => pin(fig, p.name + '：' + p.data.show + '。两组口径不同（' + doc.tag + '／' + vid.tag + '），不作相除。'));
    return c;
  }

  /* ============================================================
     图13 · 决策树（点击展开）
     ============================================================ */
  function fig13(mount, fig) {
    const box = el('div', 'tree');
    D.fig13.forEach((n, i) => {
      const node = el('div', 'tnode' + (n.leaf ? ' leaf' : ''));
      const btn = el('button');
      btn.innerHTML = '<span class="tstep">' + (i + 1) + '</span><span>' + n.t + '</span><span class="tarrow">展开 ▾</span>';
      btn.setAttribute('aria-expanded', 'false');
      const body = el('div', 'tbody', n.d);
      btn.addEventListener('click', () => {
        const open = node.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.querySelector('.tarrow').textContent = open ? '收起 ▴' : '展开 ▾';
        if (open) pin(fig, '第' + (i + 1) + '步 · ' + n.t + '：' + n.d);
      });
      node.appendChild(btn);
      node.appendChild(body);
      box.appendChild(node);
      if (i < D.fig13.length - 1) {
        const arrow = el('div', '', '↓');
        arrow.style.cssText = 'text-align:center;color:#93C5FD;font-size:18px;margin:-4px 0 8px 6px;';
        box.appendChild(arrow);
      }
    });
    mount.appendChild(box);
    const hint = el('div', 'fig-hint', '点开每一步查看完整说明；路径依据《中国成人注意缺陷多动障碍诊断和治疗专家共识（2023年版）》。');
    hint.style.padding = '0 6px 10px';
    mount.appendChild(hint);
  }

  /* ============================================================
     图14 · 五把尺子（互动）
     ============================================================ */
  function fig14(mount, fig) {
    const grid = el('div', 'rulers');
    const alert = el('div', 'ruler-alert', '点亮任意一条，看看该先打什么问号。');
    const picked = new Set();
    const icons = ['okhand', 'stethoscope', 'pill', 'magnifier', 'questionhand'];

    D.fig14.forEach((r, i) => {
      const b = el('button', 'ruler');
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML = '<span class="r-icon" data-art="' + icons[i] + '"></span>' +
        '<span class="r-name">' + r.name + '</span>' +
        '<span class="r-desc">' + r.desc + '</span>' +
        '<span class="ruler-meter"><i></i><i></i><i></i><i></i><i></i></span>';
      b.addEventListener('click', () => {
        const on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on) picked.add(r.k); else picked.delete(r.k);
        const n = picked.size;
        grid.querySelectorAll('.ruler').forEach((x) => {
          const m = x.querySelectorAll('.ruler-meter i');
          m.forEach((dot, k) => dot.classList.toggle('on', k < n));
        });
        if (n === 0) {
          alert.className = 'ruler-alert';
          alert.textContent = '点亮任意一条，看看该先打什么问号。';
        } else if (n < 2) {
          alert.className = 'ruler-alert';
          alert.textContent = '已亮 ' + n + ' 条：这条内容已有一处值得警惕的地方，先别急着对号入座。';
        } else {
          alert.className = 'ruler-alert danger';
          alert.textContent = '已亮 ' + n + ' 条（≥2）：这条内容应高度警惕——凡是把“测一测”包装成“查一查”、把“中了N条”等同于“确诊”的，无论出自谁手，都应先打个问号。请到正规医院精神科或心理科挂号面诊。';
          pin(fig, '五把尺子亮起 ' + n + ' 条（≥2）：看资质、看就医、看推销、看来源、看标签——先打问号，再谈确诊。');
        }
      });
      grid.appendChild(b);
    });
    mount.appendChild(grid);
    mount.appendChild(alert);
    global.mountIllustrations();
  }

  /* ---------- 注册 ---------- */
  const MAP = {
    fig01: fig1, fig02: fig2, fig03: fig3, fig04: fig4, fig05: fig5,
    fig06: fig6, fig07: fig7, fig08: fig8, fig09: fig9, fig10: fig10,
    fig11: fig11, fig12: fig12, fig13: fig13, fig14: fig14
  };

  global.renderCharts = function () {
    document.querySelectorAll('.figure').forEach((fig) => {
      const id = fig.id;
      const mount = fig.querySelector('.mount');
      if (!mount || !MAP[id]) return;
      try { MAP[id](mount, fig); } catch (e) { console.error(id, e); }
    });
  };

  global.resizeCharts = function () {
    instances.forEach((c) => { try { c.resize(); } catch (e) { } });
  };
})(window);
