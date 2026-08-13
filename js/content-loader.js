document.addEventListener('DOMContentLoaded', () => {
  const lists = [...document.querySelectorAll('[data-article-list]')];
  if (!lists.length) return;

  const endpoint = window.SITE_CONFIG?.contentEndpoint || 'data/articles.json';
  const filterRoot = document.querySelector('#article-filters');
  let articles = [];
  let activeFilter = 'all';

  const text = value => {
    const decoder = document.createElement('textarea');
    decoder.innerHTML = String(value ?? '');
    return decoder.value;
  };
  const byNewest = (a, b) => text(b.date).localeCompare(text(a.date));

  function appendText(parent, tagName, value, className) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = text(value);
    parent.append(element);
    return element;
  }

  function articleCard(article, index) {
    const row = document.createElement('article');
    row.className = 'publication';
    row.dataset.category = text(article.category).toLowerCase();

    const href = `article.html?id=${encodeURIComponent(text(article.id))}`;
    const visual = document.createElement('a');
    visual.className = `pub-visual visual-${index % 4 + 1}`;
    visual.href = href;
    visual.setAttribute('aria-label', `Read ${text(article.title)}`);
    appendText(visual, 'span', String(index + 1).padStart(2, '0'));
    appendText(visual, 'b', article.category || 'Article');

    const copy = document.createElement('div');
    copy.className = 'pub-copy';
    appendText(copy, 'span', `${text(article.category || 'Article')} · ${text(article.date)}`, 'eyebrow');
    const heading = document.createElement('h3');
    const titleLink = appendText(heading, 'a', article.title || 'Untitled article');
    titleLink.href = href;
    copy.append(heading);
    appendText(copy, 'p', article.summary || 'Read the full analysis.');

    const meta = document.createElement('div');
    meta.className = 'pub-meta';
    if (article.readTime) appendText(meta, 'span', `${text(article.readTime)} read`);
    (Array.isArray(article.tags) ? article.tags : []).forEach(tag => appendText(meta, 'span', tag));
    copy.append(meta);
    const readLink = appendText(copy, 'a', 'Read article →', 'text-link');
    readLink.href = href;
    row.append(visual, copy);
    return row;
  }

  function renderLists() {
    lists.forEach(list => {
      const limit = Number.parseInt(list.dataset.limit || '', 10);
      const filtered = articles.filter(article =>
        activeFilter === 'all' || text(article.category).toLowerCase() === activeFilter
      );
      const visible = Number.isFinite(limit) ? filtered.slice(0, limit) : filtered;
      list.replaceChildren();
      list.setAttribute('aria-busy', 'false');
      if (!visible.length) {
        appendText(list, 'p', 'No published articles are available in this category.', 'empty-state');
        return;
      }
      visible.forEach((article, index) => list.append(articleCard(article, index)));
    });
  }

  function renderFilters() {
    if (!filterRoot) return;
    const categories = [...new Set(articles.map(article => text(article.category)).filter(Boolean))];
    filterRoot.replaceChildren();
    [['all', 'All'], ...categories.map(category => [category.toLowerCase(), category])].forEach(([value, label]) => {
      const button = appendText(filterRoot, 'button', label);
      button.type = 'button';
      button.dataset.filter = value;
      button.classList.toggle('active', value === activeFilter);
      button.addEventListener('click', () => {
        activeFilter = value;
        [...filterRoot.querySelectorAll('button')].forEach(item => item.classList.toggle('active', item === button));
        renderLists();
      });
    });
  }

  const separator = endpoint.includes('?') ? '&' : '?';
  fetch(`${endpoint}${separator}v=${Date.now()}`, { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error('Content data unavailable');
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('Content data has an invalid format');
      articles = data
        .filter(article => article && typeof article === 'object' && !['draft', 'review'].includes(text(article.status).toLowerCase()))
        .sort(byNewest);
      document.documentElement.dataset.articleCount = String(articles.length);
      renderFilters();
      renderLists();
    })
    .catch(() => {
      document.documentElement.dataset.articleCount = 'unavailable';
      lists.forEach(list => {
        list.replaceChildren();
        list.setAttribute('aria-busy', 'false');
        appendText(list, 'p', 'Articles are temporarily unavailable. Please try again shortly.', 'empty-state');
      });
    });
});
