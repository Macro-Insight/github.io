document.addEventListener('DOMContentLoaded', async () => {
  const root = document.querySelector('#article-detail');
  if (!root) return;

  const endpoint = window.SITE_CONFIG?.contentEndpoint || 'data/articles.json';
  const id = new URLSearchParams(location.search).get('id');
  const decode = value => {
    const decoder = document.createElement('textarea');
    decoder.innerHTML = String(value ?? '');
    return decoder.value;
  };
  const appendText = (parent, tagName, value, className) => {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = decode(value);
    parent.append(element);
    return element;
  };
  const appendRichParagraphs = (parent, value) => {
    if (!value) return;
    const container = document.createElement('div');
    container.innerHTML = `<p>${String(value)}</p>`;
    [...container.childNodes].forEach(node => parent.append(node));
  };

  try {
    const separator = endpoint.includes('?') ? '&' : '?';
    const response = await fetch(`${endpoint}${separator}v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Content data unavailable');
    const articles = await response.json();
    if (!Array.isArray(articles) || !articles.length) throw new Error('No articles available');
    const article = articles.find(item => item?.id === id) || (!id ? [...articles].sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')))[0] : null);
    if (!article) throw new Error('Article not found');

    root.replaceChildren();
    const back = appendText(root, 'a', '← All articles', 'text-link');
    back.href = 'articles.html';
    appendText(root, 'p', `${article.category || 'Article'} · ${article.date || ''}`, 'eyebrow');
    appendText(root, 'h1', article.title || 'Untitled article');
    appendText(root, 'p', article.summary || '', 'dek');

    const meta = document.createElement('div');
    meta.className = 'pub-meta';
    if (article.readTime) appendText(meta, 'span', `${article.readTime} read`);
    (Array.isArray(article.tags) ? article.tags : []).forEach(tag => appendText(meta, 'span', tag));
    root.append(meta);

    const body = document.createElement('div');
    body.className = 'article-body';
    const fields = article.body && typeof article.body === 'object' ? article.body : {};
    appendRichParagraphs(body, fields.intro);
    if (fields.heading1) appendText(body, 'h2', fields.heading1);
    appendRichParagraphs(body, fields.section1);
    if (fields.quote) appendRichParagraphs(appendText(body, 'blockquote', ''), fields.quote);
    if (fields.heading2) appendText(body, 'h2', fields.heading2);
    appendRichParagraphs(body, fields.section2);
    if (fields.close) {
      const close = document.createElement('p');
      appendText(close, 'strong', 'Closing note. ');
      const content = document.createElement('span');
      content.innerHTML = String(fields.close);
      close.append(...content.childNodes);
      body.append(close);
    }
    root.append(body);
    document.title = `${decode(article.title)} · Lior`;
  } catch (error) {
    root.replaceChildren();
    appendText(root, 'h1', error.message === 'Article not found' ? 'Article not found.' : 'Article data could not be loaded.');
    appendText(root, 'p', error.message === 'Article not found' ? 'The requested article may have moved or is no longer available.' : 'Please try again shortly.');
    const back = appendText(root, 'a', 'Back to articles');
    back.href = 'articles.html';
  }
});
