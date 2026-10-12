import { readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const works = JSON.parse(await readFile(resolve(root, 'works.json'), 'utf8'));
const categories = [
  { id: 'games', label: 'ゲーム', english: 'GAMES', lead: '気になった世界で、ひと遊び。', description: '小さな町も、ピッチも、100mのトラックも。' },
  { id: 'manga', label: '漫画', english: 'MANGA', lead: 'ページをめくる、その先へ。', description: '日常から一歩踏み出す、3つの物語。' },
  { id: 'apps', label: 'アプリ', english: 'APPS', lead: '毎日の「続ける」を、少し楽しく。', description: '記録を積み重ねて、自分の変化を見つけよう。' }
];
const ids = new Set();
for (const work of works) {
  for (const field of ['id', 'category', 'title', 'description', 'url', 'art', 'action']) {
    if (typeof work[field] !== 'string' || !work[field]) throw new Error(`Missing ${field}`);
  }
  if (ids.has(work.id) || !/^[a-z0-9-]+$/.test(work.id)) throw new Error(`Invalid or duplicate ID: ${work.id}`);
  ids.add(work.id);
  if (!categories.some(c => c.id === work.category)) throw new Error(`Invalid category: ${work.category}`);
  if (new URL(work.url).protocol !== 'https:') throw new Error(`HTTPS URL required: ${work.id}`);
  if (!['cover', 'town', 'screenshot', 'record'].includes(work.art)) throw new Error(`Invalid art: ${work.id}`);
  if (!Array.isArray(work.tags) || work.tags.some(t => typeof t !== 'string')) throw new Error(`Invalid tags: ${work.id}`);
  if (work.image) {
    if (!/^assets\/[a-z0-9-]+\.webp$/.test(work.image) || !work.imageAlt) throw new Error(`Invalid image: ${work.id}`);
    await access(resolve(root, work.image));
  }
}
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
const count = category => works.filter(w => w.category === category).length;
const pad = value => String(value).padStart(2, '0');
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function visual(work) {
  const image = work.image ? `<img src="${escape(work.image)}" alt="${escape(work.imageAlt)}" loading="lazy" decoding="async"${work.position ? ` style="object-position:${escape(work.position)}"` : ''}>` : '';
  if (work.art === 'screenshot') return image;
  if (work.art === 'cover') return `${image}<span class="cover-mark" aria-hidden="true">READ THE STORY ${arrow}</span>`;
  if (work.art === 'town') return `${image}<span class="game-label" aria-hidden="true">A LITTLE TOWN,<br>A LITTLE WONDER.</span>`;
  return `${image}<div class="record-words" aria-hidden="true"><span>YOUR RUN.<br>YOUR RECORD.</span><small>100m / 200m / 400m</small></div>`;
}
function card(work, index) {
  return `<article class="work-card ${work.category === 'apps' ? 'app-card' : ''}">
    <a class="work-link" href="${escape(work.url)}" aria-label="${escape(work.title)}：${escape(work.action)}">
      <div class="work-visual art-${escape(work.art)}">${visual(work)}</div>
      <div class="work-info"><div class="work-meta"><span>${work.tags.map(escape).join(' <span class="tag-dot" aria-hidden="true">/</span> ')}</span><span class="work-number">${pad(index + 1)}</span></div>
      <h3>${escape(work.title)}</h3><p class="work-description">${escape(work.description)}</p><span class="work-action">${escape(work.action)} ${arrow}</span></div>
    </a></article>`;
}
const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>LOCKCOLE WORKS — ゲーム・漫画・アプリ</title>
  <meta name="description" content="lockcoleの作品ポータル。ブラウザゲーム、オリジナル漫画、スプリント記録アプリを、ジャンルごとに楽しめます。">
  <meta name="theme-color" content="#1c201f">
  <link rel="canonical" href="https://lockcole6.github.io/">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ja_JP">
  <meta property="og:title" content="LOCKCOLE WORKS — 遊んで、夢中に。">
  <meta property="og:description" content="ゲーム、漫画、日々の記録。つくったものを、ここに集めました。">
  <meta property="og:url" content="https://lockcole6.github.io/">
  <meta property="og:image" content="https://lockcole6.github.io/assets/mofumofu-game.webp">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css?v=3">
  <script src="app.js" defer></script>
</head>
<body id="top">
  <a class="skip-link" href="#works">作品一覧へスキップ</a>
  <header class="site-header"><div class="container header-inner">
    <a class="brand" href="./" aria-label="LOCKCOLE WORKS ホーム"><span class="brand-mark" aria-hidden="true">L<span>↗</span></span><span>LOCKCOLE<span class="brand-sub">WORKS</span></span></a>
    <nav class="main-nav" aria-label="メインナビゲーション"><a href="#games" data-jump>ゲーム</a><a href="#manga" data-jump>漫画</a><a href="#apps" data-jump>アプリ</a></nav>
    <span class="header-caption">A SMALL CREATIVE SPACE</span>
  </div></header>
  <main>
    <section class="hero container" aria-labelledby="hero-title">
      <div class="hero-copy"><p class="eyebrow"><span class="little-star" aria-hidden="true">✳</span> WELCOME TO MY PLAYGROUND</p>
      <h1 id="hero-title">遊んで、<br>夢中に。<span class="hero-accent">小さな世界へ、ようこそ。</span></h1>
      <p class="hero-description">ゲーム、漫画、日々の記録。<br>つくったものを、ここに集めました。</p>
      <a class="primary-link" href="#games" data-jump>ゲームを見にいく ${arrow}</a>
      <p class="hero-footnote"><span>${pad(works.length)} WORKS</span><span>3 CATEGORIES</span></p></div>
      <div class="game-showcase" aria-hidden="true"><div class="showcase-backdrop"></div><span class="showcase-caption">PICK YOUR PLAY</span>
        <div class="game-screen screen-football"><img src="assets/mofumofu-game.webp" alt="" width="1280" height="720" fetchpriority="high"><span>もふもふ蹴球団</span></div>
        <div class="game-screen screen-sprint"><img src="assets/sprint100m-game.webp" alt="" width="1152" height="720"><span>100m SPRINT</span></div>
        <div class="game-screen screen-town"><img src="assets/kamisama-game.webp" alt="" width="405" height="720"><span>カミサマ、いま起きてる？</span></div>
        <span class="showcase-note">気になる世界で、ひと遊び。</span>
      </div>
    </section>
    <section class="collection" id="works" aria-labelledby="works-title"><div class="container">
      <div class="collection-heading"><div><p class="eyebrow">THE COLLECTION</p><h2 id="works-title">作品を探す<span class="heading-dot">.</span></h2></div><p id="result-count" class="result-count" role="status" aria-live="polite" aria-atomic="true">全${works.length}作品</p></div>
      <div class="filters" aria-label="ジャンルで絞り込む" hidden><button type="button" data-filter="all" aria-pressed="true">すべて <span>${pad(works.length)}</span></button>${categories.map(c => `<button type="button" data-filter="${c.id}" aria-pressed="false">${c.label} <span>${pad(count(c.id))}</span></button>`).join('')}</div>
      ${categories.map((category, index) => `<section class="genre-section" id="${category.id}" data-category="${category.id}" aria-labelledby="${category.id}-title"><div class="genre-heading"><div class="genre-index"><span>${pad(index + 1)}</span><p>${category.english}</p></div><div><h2 id="${category.id}-title">${category.label}<span class="genre-total">${pad(count(category.id))}</span></h2><p>${category.lead}</p></div></div><div class="works-grid">${works.filter(w => w.category === category.id).map((work, i) => card(work, i)).join('')}</div></section>`).join('')}
      <noscript><p class="noscript-note">すべての作品を表示しています。上部のメニューから各ジャンルへ移動できます。</p></noscript>
    </div></section>
    <div class="closing container"><p>次のひとときに、<br><strong>ひとつ、お気に入りを。</strong></p><a href="#top" class="back-top" aria-label="ページの先頭へ戻る">↑</a></div>
  </main>
  <footer class="site-footer"><div class="container footer-inner"><span class="footer-brand">LOCKCOLE WORKS</span><span>ゲーム・漫画・アプリの作品集</span><a href="https://github.com/lockcole6/lockcole6.github.io">GitHub ${arrow}</a></div></footer>
</body>
</html>
`;
await writeFile(resolve(root, 'index.html'), html, 'utf8');
console.log(`Built index.html: ${works.length} works (${categories.map(c => `${c.id}: ${count(c.id)}`).join(', ')})`);
