import { readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const works = JSON.parse(await readFile(resolve(root, 'works.json'), 'utf8'));
const categories = [
  { id: 'manga', label: '漫画', english: 'MANGA', lead: 'ページをめくる、その先へ。', description: '日常から一歩踏み出す、3つの物語。' },
  { id: 'games', label: 'ゲーム', english: 'GAMES', lead: '気になった世界で、ひと遊び。', description: '小さな町も、ピッチも、100mのトラックも。' },
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
  if (!['cover', 'town', 'football', 'sprint', 'record'].includes(work.art)) throw new Error(`Invalid art: ${work.id}`);
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
const ball = '<svg class="football-icon" viewBox="0 0 120 120" fill="none" aria-hidden="true"><circle cx="60" cy="60" r="47" stroke="currentColor" stroke-width="3"/><path d="m60 35 24 17-9 28H45l-9-28 24-17ZM60 13v22m44 10L84 52m3 45L75 80M33 97l12-17M16 45l20 7" stroke="currentColor" stroke-width="3"/><path d="m60 35 24 17-9 28H45l-9-28 24-17Z" fill="currentColor"/></svg>';
function visual(work) {
  const image = work.image ? `<img src="${escape(work.image)}" alt="${escape(work.imageAlt)}" loading="lazy" decoding="async"${work.position ? ` style="object-position:${escape(work.position)}"` : ''}>` : '';
  if (work.art === 'cover') return `${image}<span class="cover-mark" aria-hidden="true">READ THE STORY ${arrow}</span>`;
  if (work.art === 'town') return `${image}<span class="game-label" aria-hidden="true">A LITTLE TOWN,<br>A LITTLE WONDER.</span>`;
  if (work.art === 'football') return `<div class="pitch" aria-hidden="true"><span></span></div>${ball}<span class="game-label" aria-hidden="true">MOFUMOFU<br>FOOTBALL CLUB</span><span class="art-corner" aria-hidden="true">BUILD YOUR TEAM</span>`;
  if (work.art === 'sprint') return `<div class="lanes" aria-hidden="true"><i>1</i><i>2</i><i>3</i><i>4</i></div><span class="sprint-word" aria-hidden="true">100<span>m</span></span><span class="game-label" aria-hidden="true">ON YOUR MARKS.</span>`;
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
  <title>LOCKCOLE WORKS — 漫画・ゲーム・アプリ</title>
  <meta name="description" content="lockcoleの作品ポータル。オリジナル漫画、ブラウザゲーム、スプリント記録アプリを、ジャンルごとに楽しめます。">
  <meta name="theme-color" content="#f7f6f2">
  <link rel="canonical" href="https://lockcole6.github.io/">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ja_JP">
  <meta property="og:title" content="LOCKCOLE WORKS — 読んで、遊んで。">
  <meta property="og:description" content="漫画、ゲーム、日々の記録。つくったものを、ここに集めました。">
  <meta property="og:url" content="https://lockcole6.github.io/">
  <meta property="og:image" content="https://lockcole6.github.io/assets/kaketara-okiru.webp">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css">
  <script src="app.js" defer></script>
</head>
<body id="top">
  <a class="skip-link" href="#works">作品一覧へスキップ</a>
  <header class="site-header"><div class="container header-inner">
    <a class="brand" href="./" aria-label="LOCKCOLE WORKS ホーム"><span class="brand-mark" aria-hidden="true">L<span>↗</span></span><span>LOCKCOLE<span class="brand-sub">WORKS</span></span></a>
    <nav class="main-nav" aria-label="メインナビゲーション"><a href="#manga" data-jump>漫画</a><a href="#games" data-jump>ゲーム</a><a href="#apps" data-jump>アプリ</a></nav>
    <span class="header-caption">A SMALL CREATIVE SPACE</span>
  </div></header>
  <main>
    <section class="hero container" aria-labelledby="hero-title">
      <div class="hero-copy"><p class="eyebrow"><span class="little-star" aria-hidden="true">✳</span> WELCOME TO MY PLAYGROUND</p>
      <h1 id="hero-title">読んで、<br>遊んで。<span class="hero-accent">ちょっと夢中に。</span></h1>
      <p class="hero-description">漫画、ゲーム、日々の記録。<br>つくったものを、ここに集めました。</p>
      <a class="primary-link" href="#works">作品を見にいく ${arrow}</a>
      <p class="hero-footnote"><span>${pad(works.length)} WORKS</span><span>3 CATEGORIES</span></p></div>
      <div class="hero-gallery" aria-hidden="true"><div class="gallery-backdrop"></div><span class="gallery-caption">STORIES &amp; PLAY</span>
        <div class="gallery-sheet sheet-one"><img src="assets/taikutsu-no-odds.webp" alt="" width="640" height="960"><span>退屈のオッズ</span></div>
        <div class="gallery-sheet sheet-two"><img src="assets/kaketara-okiru.webp" alt="" width="640" height="990" fetchpriority="high"><span>賭けたら起きる。</span></div>
        <div class="gallery-sheet sheet-three"><img src="assets/mada-hayaku-nareru.webp" alt="" width="640" height="960"><span>まだ、速くなれる。</span></div>
        <span class="gallery-sticker">READ.<br>PLAY.<br>REPEAT.<span>↗</span></span><span class="gallery-note">気になる作品から、どうぞ。</span>
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
  <footer class="site-footer"><div class="container footer-inner"><span class="footer-brand">LOCKCOLE WORKS</span><span>漫画・ゲーム・アプリの作品集</span><a href="https://github.com/lockcole6/lockcole6.github.io">GitHub ${arrow}</a></div></footer>
</body>
</html>
`;
await writeFile(resolve(root, 'index.html'), html, 'utf8');
console.log(`Built index.html: ${works.length} works (${categories.map(c => `${c.id}: ${count(c.id)}`).join(', ')})`);
