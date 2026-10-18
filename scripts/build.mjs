import { readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const works = JSON.parse(await readFile(resolve(root, 'works.json'), 'utf8'));
const categories = [
  { id: 'games', label: 'ゲーム' },
  { id: 'manga', label: '漫画' },
  { id: 'apps', label: 'アプリ' }
];
const ids = new Set();
for (const work of works) {
  for (const field of ['id', 'category', 'title', 'description', 'url', 'art', 'action', 'image', 'imageAlt']) {
    if (typeof work[field] !== 'string' || !work[field]) throw new Error('Missing ' + field);
  }
  if (ids.has(work.id) || !/^[a-z0-9-]+$/.test(work.id)) throw new Error('Invalid or duplicate ID: ' + work.id);
  ids.add(work.id);
  if (!categories.some(c => c.id === work.category)) throw new Error('Invalid category: ' + work.category);
  if (new URL(work.url).protocol !== 'https:') throw new Error('HTTPS URL required: ' + work.id);
  if (!['cover', 'town', 'screenshot', 'record'].includes(work.art)) throw new Error('Invalid art: ' + work.id);
  if (!/^assets\/[a-z0-9-]+\.webp$/.test(work.image)) throw new Error('Invalid image: ' + work.id);
  if (work.position && !/^(center|top|bottom|left|right|\d+(?:\.\d+)?%)(\s+(center|top|bottom|left|right|\d+(?:\.\d+)?%))?$/.test(work.position)) {
    throw new Error('Invalid image position: ' + work.id);
  }
  await access(resolve(root, work.image));
}
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
const arrow = '<svg class="work-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 5 7 7-7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function row(work, eager) {
  return [
    '<li class="work-item">',
    '  <a class="work-link" href="' + escape(work.url) + '" aria-label="' + escape(work.title) + '：' + escape(work.action) + '">',
    '    <span class="work-thumbnail art-' + escape(work.art) + '"><img src="' + escape(work.image) + '" alt="' + escape(work.imageAlt) + '" loading="' + (eager ? 'eager' : 'lazy') + '" decoding="async"' + (eager ? ' fetchpriority="high"' : '') + (work.position ? ' style="object-position:' + escape(work.position) + '"' : '') + '></span>',
    '    <div class="work-info"><h3>' + escape(work.title) + '</h3><p>' + escape(work.description) + '</p></div>',
    '    ' + arrow,
    '  </a>',
    '</li>'
  ].join('\n');
}
const firstWork = works.find(work => work.category === categories[0].id);
const navigation = categories.map(c => '<a href="#' + c.id + '">' + c.label + '</a>').join('');
const sections = categories.map(category => [
  '<section class="genre-section" id="' + category.id + '" aria-labelledby="' + category.id + '-title">',
  '  <h2 id="' + category.id + '-title">' + category.label + '</h2>',
  '  <ul class="work-list">' + works.filter(work => work.category === category.id).map(work => row(work, work === firstWork)).join('\n') + '</ul>',
  '</section>'
].join('\n')).join('\n');

const html = [
  '<!doctype html>',
  '<html lang="ja">',
  '<head>',
  '  <meta charset="utf-8">',
  '  <meta name="viewport" content="width=device-width, initial-scale=1">',
  '  <title>LOCKCOLE WORKS — ゲーム・漫画・アプリ</title>',
  '  <meta name="description" content="lockcoleの作品ポータル。ブラウザゲーム、オリジナル漫画、スプリント記録アプリを、ジャンルごとに楽しめます。">',
  '  <meta name="theme-color" content="#1c201f">',
  '  <link rel="canonical" href="https://lockcole6.github.io/">',
  '  <meta property="og:type" content="website">',
  '  <meta property="og:locale" content="ja_JP">',
  '  <meta property="og:title" content="LOCKCOLE WORKS — ゲーム・漫画・アプリ">',
  '  <meta property="og:description" content="ゲーム、漫画、アプリ。気になる作品から、どうぞ。">',
  '  <meta property="og:url" content="https://lockcole6.github.io/">',
  '  <meta property="og:image" content="https://lockcole6.github.io/assets/mofumofu-game.webp">',
  '  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">',
  '  <link rel="stylesheet" href="styles.css?v=4">',
  '</head>',
  '<body id="top">',
  '  <a class="skip-link" href="#works">作品一覧へスキップ</a>',
  '  <header class="site-header container">',
  '    <h1><a class="brand" href="./">LOCKCOLE WORKS</a></h1>',
  '    <nav aria-label="ジャンルへ移動">' + navigation + '</nav>',
  '  </header>',
  '  <main class="container" id="works" tabindex="-1" aria-label="作品一覧">',
  sections,
  '  </main>',
  '  <footer class="site-footer container"><span>LOCKCOLE WORKS</span><a href="https://github.com/lockcole6/lockcole6.github.io">GitHub <span aria-hidden="true">↗</span></a></footer>',
  '</body>',
  '</html>',
  ''
].join('\n');
await writeFile(resolve(root, 'index.html'), html, 'utf8');
console.log('Built index.html: ' + works.length + ' works');
