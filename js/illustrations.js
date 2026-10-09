/* 扁平线描插画（内联 SVG）：线描 + 淡蓝填充 + 深蓝描边 */
(function (global) {
  const S = (inner, vb) =>
    `<svg viewBox="${vb || '0 0 100 100'}" xmlns="http://www.w3.org/2000/svg" fill="none" role="img" aria-hidden="true">${inner}</svg>`;

  const stroke = 'stroke="#1E40AF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  const thin = 'stroke="#1E40AF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"';
  const fillSoft = 'fill="#EFF6FF"';
  const fillMid = 'fill="#BFDBFE"';

  const art = {
    /* 大脑 */
    brain: S(`
      <path d="M50 20c-9-7-23-5-28 5-6 2-9 8-8 14-6 3-8 10-5 16 2 5 7 8 12 8 0 8 6 14 14 14h10c9 0 16-7 16-16 0-1 0-2 0-3 5-3 8-9 6-15-3-9-11-13-17-11-3-6-9-10-15-9" ${fillSoft} ${stroke}/>
      <path d="M50 20v57" ${thin}/>
      <path d="M38 30c4 3 6 8 5 13M62 30c-4 3-6 8-5 13M30 46c5-2 9 0 12 3M70 46c-5-2-9 0-12 3" ${thin}/>
      <circle cx="43" cy="62" r="3" fill="#93C5FD" ${stroke}/>
      <circle cx="60" cy="66" r="2.4" fill="#93C5FD" ${stroke}/>
    `),

    /* 手机 + 内容流 */
    phone: S(`
      <rect x="26" y="12" width="48" height="76" rx="9" ${fillSoft} ${stroke}/>
      <rect x="33" y="24" width="34" height="30" rx="4" fill="#BFDBFE" stroke="#1E40AF" stroke-width="1.4"/>
      <rect x="33" y="60" width="34" height="5" rx="2.5" fill="#93C5FD"/>
      <rect x="33" y="70" width="22" height="5" rx="2.5" fill="#93C5FD"/>
      <circle cx="50" cy="83" r="3.4" fill="#fff" stroke="#1E40AF" stroke-width="1.6"/>
      <path d="M78 40c6-4 6-12 0-16M22 40c-6-4-6-12 0-16" ${thin}/>
    `),

    /* 放大镜 */
    magnifier: S(`
      <circle cx="43" cy="42" r="22" ${fillSoft} ${stroke}/>
      <circle cx="43" cy="42" r="13" fill="#DBEAFE" stroke="#60A5FA" stroke-width="1.4"/>
      <path d="M59 60l18 20" stroke="#1E40AF" stroke-width="4" stroke-linecap="round"/>
      <path d="M35 34c5 5 11 6 16 2" ${thin}/>
    `),

    /* 时钟 / 拖延 */
    clock: S(`
      <circle cx="50" cy="52" r="30" ${fillSoft} ${stroke}/>
      <circle cx="50" cy="52" r="23" fill="#DBEAFE" stroke="#60A5FA" stroke-width="1.3"/>
      <path d="M50 52V36" ${stroke}/>
      <path d="M50 52l13 8" ${stroke}/>
      <circle cx="50" cy="52" r="2.6" fill="#1E40AF"/>
      <path d="M40 16c4-3 16-3 20 0" ${thin}/>
      <path d="M78 30l8-4M22 30l-8-4" ${thin}/>
    `),

    /* 药瓶 */
    pill: S(`
      <rect x="30" y="40" width="40" height="44" rx="8" ${fillSoft} ${stroke}/>
      <rect x="36" y="28" width="28" height="14" rx="4" fill="#BFDBFE" ${stroke}/>
      <rect x="36" y="52" width="28" height="22" rx="3" fill="#fff" stroke="#60A5FA" stroke-width="1.4"/>
      <path d="M42 60h16M42 67h10" ${thin}/>
      <circle cx="70" cy="72" r="7" fill="#DBEAFE" stroke="#1E40AF" stroke-width="1.6"/>
      <path d="M67 72h6" ${stroke}/>
    `),

    /* 听诊器 */
    stethoscope: S(`
      <path d="M32 18v20a18 18 0 0036 0V18" ${fillSoft} ${stroke}/>
      <path d="M50 56v14c0 10-8 18-18 18s-18-8-18-18 8-18 18-18" ${stroke} fill="none"/>
      <circle cx="32" cy="70" r="8" fill="#BFDBFE" ${stroke}/>
      <circle cx="32" cy="70" r="3" fill="#1E40AF"/>
      <circle cx="32" cy="12" r="4" fill="#93C5FD" ${stroke}/>
      <circle cx="68" cy="12" r="4" fill="#93C5FD" ${stroke}/>
      <path d="M62 44h14M62 52h10" ${thin}/>
    `),

    /* OK 手势 */
    okhand: S(`
      <path d="M40 46c0-9 7-16 16-16s16 7 16 16v18c0 12-8 22-18 22s-16-10-16-22V46z" ${fillSoft} ${stroke}/>
      <circle cx="50" cy="40" r="8" fill="#fff" ${stroke}/>
      <path d="M38 54c-6 2-10-2-9-8 1-5 5-8 9-7" ${fillMid} ${stroke}/>
      <path d="M56 30c3-6 8-8 12-5s3 9-1 12" ${fillMid} ${stroke}/>
      <path d="M46 66c3 4 9 4 12 0" ${thin}/>
    `),

    /* 问号手势 */
    questionhand: S(`
      <path d="M40 46c0-9 7-16 16-16s16 7 16 16v18c0 12-8 22-18 22s-16-10-16-22V46z" fill="#EFF6FF" ${stroke}/>
      <path d="M38 54c-6 2-10-2-9-8 1-5 5-8 9-7" ${fillMid} ${stroke}/>
      <path d="M56 30c3-6 8-8 12-5s3 9-1 12" ${fillMid} ${stroke}/>
      <text x="50" y="70" font-size="26" font-weight="800" fill="#1E40AF" text-anchor="middle" font-family="sans-serif">?</text>
    `),

    /* Hero 主插画：自测清单手机 + 大脑 + 点赞 + 问号放大镜（参考构图） */
    heroScene: S(`
      <defs>
        <linearGradient id="hgA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#DBEAFE"/><stop offset="100%" stop-color="#EFF6FF"/>
        </linearGradient>
        <marker id="hArr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="#2563EB"/>
        </marker>
      </defs>
      <font-face font-family="'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif"/>

      <!-- 背景大圆 -->
      <circle cx="200" cy="160" r="150" fill="url(#hgA)" stroke="#BFDBFE" stroke-width="1.5"/>

      <!-- 两侧虚线弧线（算法分发回路） -->
      <path d="M98 112C64 152 64 200 100 240" stroke="#2563EB" stroke-width="2.6" stroke-linecap="round" fill="none" stroke-dasharray="0.5 9.5" marker-end="url(#hArr)"/>
      <path d="M302 122C336 158 334 206 298 242" stroke="#2563EB" stroke-width="2.6" stroke-linecap="round" fill="none" stroke-dasharray="0.5 9.5" marker-end="url(#hArr)"/>

      <!-- 中央手机：自测清单 -->
      <g>
        <rect x="150" y="34" width="100" height="216" rx="17" fill="#FFFFFF" stroke="#1E40AF" stroke-width="2.6"/>
        <rect x="184" y="45" width="32" height="5.5" rx="2.75" fill="#1E40AF"/>
        <rect x="157" y="60" width="86" height="23" rx="7" fill="#DBEAFE" stroke="#1E40AF" stroke-width="1.6"/>
        <text x="200" y="76.5" font-size="13" font-weight="800" fill="#1E3A8A" text-anchor="middle"
              textLength="78" lengthAdjust="spacingAndGlyphs"
              font-family="'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif">ADHD 自测清单</text>
        <!-- 清单行 -->
        <g stroke="#2563EB" stroke-width="1.8" fill="#FFFFFF">
          <rect x="165" y="95" width="13" height="13" rx="3.5"/>
          <rect x="165" y="119" width="13" height="13" rx="3.5"/>
          <rect x="165" y="143" width="13" height="13" rx="3.5"/>
          <rect x="165" y="167" width="13" height="13" rx="3.5"/>
          <rect x="165" y="191" width="13" height="13" rx="3.5"/>
        </g>
        <path d="M164 94l14 14M178 94l-14 14" stroke="#2563EB" stroke-width="2.1" stroke-linecap="round" fill="none"/>
        <g fill="#93C5FD">
          <rect x="186" y="99"  width="50" height="5" rx="2.5"/>
          <rect x="186" y="123" width="42" height="5" rx="2.5"/>
          <rect x="186" y="147" width="54" height="5" rx="2.5"/>
          <rect x="186" y="171" width="38" height="5" rx="2.5"/>
          <rect x="186" y="195" width="48" height="5" rx="2.5"/>
        </g>
        <!-- 橙色警示条（允许压在手机边缘上，参考图同款） -->
        <rect x="116" y="212" width="168" height="26" rx="13" fill="#FFFBEB" stroke="#F59E0B" stroke-width="2.2"/>
        <text x="200" y="230" font-size="13.5" font-weight="800" fill="#B45309" text-anchor="middle"
              textLength="150" lengthAdjust="spacingAndGlyphs"
              font-family="'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif">你已中 8 条 · 高度吻合！</text>
        <!-- 蓝色按钮 -->
        <rect x="162" y="247" width="76" height="21" rx="10.5" fill="#2563EB"/>
        <text x="201" y="261.5" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle"
              textLength="62" lengthAdjust="spacingAndGlyphs"
              font-family="'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif">立即测试 ▸</text>
      </g>

      <!-- 左上：探出的大脑 -->
      <g transform="translate(52,38) scale(0.78)">
        <path d="M52 20c-10-8-25-5-30 6-7 2-10 9-9 15-6 4-9 11-5 18 3 5 8 8 13 8 0 9 7 15 15 15h11c10 0 18-8 18-18 0-1 0-2 0-3 6-3 9-10 7-17-3-10-12-14-19-12-3-7-10-11-16-10z"
              fill="#FFFFFF" stroke="#1E40AF" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M52 22v56" stroke="#1E40AF" stroke-width="1.6" stroke-linecap="round" fill="none"/>
        <path d="M39 32c5 4 7 9 6 15M65 32c-5 4-7 9-6 15M29 50c6-3 11 0 14 3M75 50c-6-3-11 0-14 3"
              stroke="#60A5FA" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      </g>

      <!-- 右上：点赞 -->
      <g transform="translate(288,58) scale(0.78)">
        <path d="M34 44h6V28a6 6 0 016-6h2l4 22h14a6 6 0 016 7l-4 22a6 6 0 01-6 5H34z" fill="#FFFFFF" stroke="#1E40AF" stroke-width="2.2" stroke-linejoin="round"/>
        <rect x="22" y="44" width="12" height="34" rx="3" fill="#BFDBFE" stroke="#1E40AF" stroke-width="2"/>
        <path d="M40 62h10" stroke="#1E40AF" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      </g>

      <!-- 左下：问号放大镜 -->
      <g transform="translate(46,186) scale(0.82)">
        <circle cx="43" cy="42" r="22" fill="#FFFFFF" stroke="#1E40AF" stroke-width="2.4"/>
        <circle cx="43" cy="42" r="14" fill="#DBEAFE" stroke="#60A5FA" stroke-width="1.4"/>
        <text x="43" y="49" font-size="20" font-weight="800" fill="#1E40AF" text-anchor="middle"
              font-family="'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif">?</text>
        <path d="M59 60l18 20" stroke="#1E40AF" stroke-width="4.5" stroke-linecap="round"/>
      </g>

      <!-- 右下：光标标签 -->
      <g transform="rotate(8 320 254)">
        <path d="M298 244h36l11 13-11 13h-36z" fill="#BFDBFE" stroke="#1E40AF" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="310" cy="257" r="3.2" fill="#1E40AF"/>
      </g>

      <!-- 点缀节点 -->
      <circle cx="76" cy="66" r="4.5" fill="#60A5FA"/>
      <circle cx="330" cy="70" r="4" fill="#93C5FD"/>
      <circle cx="72" cy="258" r="4" fill="#93C5FD"/>
      <circle cx="352" cy="170" r="4.5" fill="#60A5FA"/>
      <circle cx="52" cy="152" r="3.5" fill="#BFDBFE"/>
    `, '0 0 400 320'),

    /* 播放量 */
    play: S(`
      <circle cx="50" cy="50" r="30" ${fillSoft} ${stroke}/>
      <path d="M44 38l20 12-20 12V38z" fill="#60A5FA" stroke="#1E40AF" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M84 34a40 40 0 010 32" ${thin}/>
      <path d="M16 34a40 40 0 000 32" ${thin}/>
    `),

    /* 点赞 */
    thumb: S(`
      <path d="M34 44h6V28a6 6 0 016-6h2l4 22h14a6 6 0 016 7l-4 22a6 6 0 01-6 5H34z" ${fillSoft} ${stroke}/>
      <rect x="22" y="44" width="12" height="34" rx="3" fill="#BFDBFE" ${stroke}/>
      <path d="M40 62h10" ${thin}/>
    `),

    /* 倍率 */
    ratio: S(`
      <rect x="20" y="56" width="18" height="30" rx="3" fill="#BFDBFE" ${stroke}/>
      <rect x="46" y="34" width="18" height="52" rx="3" fill="#2563EB" ${stroke}/>
      <path d="M72 62l10-10M82 62l-10-10" ${stroke}/>
    `),

    /* 人（非持证创作者） */
    person: S(`
      <circle cx="50" cy="32" r="14" ${fillSoft} ${stroke}/>
      <path d="M24 82c0-14 12-24 26-24s26 10 26 24" ${fillSoft} ${stroke}/>
      <path d="M42 30h2M58 30h2M44 40c4 3 8 3 12 0" ${thin}/>
    `)
  };

  global.ILLU = art;

  /* 把 [data-art="brain"] 的容器填上插画 */
  global.mountIllustrations = function () {
    document.querySelectorAll('[data-art]').forEach((el) => {
      const key = el.getAttribute('data-art');
      if (art[key]) el.innerHTML = art[key];
    });
  };
})(window);
