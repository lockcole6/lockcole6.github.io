const filters = document.querySelector('.filters');
const buttons = [...document.querySelectorAll('[data-filter]')];
const sections = [...document.querySelectorAll('[data-category]')];
const resultCount = document.querySelector('#result-count');

function filterWorks(category) {
  let total = 0;
  for (const section of sections) {
    const visible = category === 'all' || section.dataset.category === category;
    section.hidden = !visible;
    if (visible) total += section.querySelectorAll('.work-card').length;
  }
  for (const button of buttons) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === category));
  }
  const label = category === 'all' ? '全' : `${buttons.find(b => b.dataset.filter === category).childNodes[0].textContent.trim()} `;
  resultCount.textContent = `${label}${total}作品`;
}

for (const button of buttons) {
  button.addEventListener('click', () => filterWorks(button.dataset.filter));
}
for (const link of document.querySelectorAll('[data-jump]')) {
  link.addEventListener('click', () => filterWorks('all'));
}
window.addEventListener('hashchange', () => {
  if (sections.some(section => `#${section.id}` === location.hash && section.hidden)) filterWorks('all');
});
filters.hidden = false;
