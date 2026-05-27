const searchInput = document.getElementById('work-search');
const tagContainer = document.querySelector('.tag-filters');
const workList = document.getElementById('work-list');
const emptyMessage = document.getElementById('empty-message');
const selectedTags = new Set();
const defaultTags = ['data', 'policy', 'design', 'macro', 'micro'];
let posts = [];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeTag(tag) {
  return tag.trim().toLowerCase();
}

function tagLabel(tag) {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

async function loadPosts() {
  const response = await fetch('data/work-posts.json');
  posts = await response.json();
  renderCards();
  renderTagFilters();
  filterCards();
}

function renderCards() {
  workList.innerHTML = posts
    .map((post) => {
      const tags = (post.tags || []).map(normalizeTag);
      const visibleTags = tags
        .map((tag) => '<span>' + escapeHtml(tagLabel(tag)) + '</span>')
        .join('');
      const imageAlt = post.imageAlt || post.title + ' preview image';

      return '<article class="blog-card" data-tags="' + escapeHtml(tags.join(',')) + '" data-title="' + escapeHtml(post.title) + '" data-summary="' + escapeHtml(post.summary) + '">' +
        '<div class="blog-card-content">' +
          '<p class="blog-date">' + escapeHtml(post.date) + '</p>' +
          '<h2>' + escapeHtml(post.title) + '</h2>' +
          '<p>' + escapeHtml(post.summary) + '</p>' +
          (visibleTags ? '<div class="post-tags">' + visibleTags + '</div>' : '') +
          '<a class="btn" href="' + escapeHtml(post.url) + '" target="_blank" rel="noopener noreferrer">Learn More</a>' +
        '</div>' +
        '<img class="blog-preview" src="' + escapeHtml(post.image) + '" alt="' + escapeHtml(imageAlt) + '">' +
      '</article>';
    })
    .join('');
}

function renderTagFilters() {
  const tags = Array.from(
    new Set([
      ...defaultTags,
      ...posts.flatMap((post) => (post.tags || []).map(normalizeTag)),
    ]),
  );

  tagContainer.innerHTML = '';
  tags.forEach((tag) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tag-filter';
    button.textContent = tagLabel(tag);
    button.dataset.tag = tag;
    button.addEventListener('click', () => {
      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
        button.classList.remove('active');
      } else {
        selectedTags.add(tag);
        button.classList.add('active');
      }
      filterCards();
    });
    tagContainer.appendChild(button);
  });
}

function filterCards() {
  const query = searchInput.value.trim().toLowerCase();
  const cards = Array.from(document.querySelectorAll('.blog-card'));
  let visibleCount = 0;

  cards.forEach((card) => {
    const cardTags = card.dataset.tags
      .split(',')
      .map(normalizeTag)
      .filter(Boolean);
    const searchableText = [
      card.dataset.title,
      card.dataset.summary,
      card.textContent,
    ]
      .join(' ')
      .toLowerCase();

    const matchesSearch = !query || searchableText.includes(query);
    const matchesTags =
      selectedTags.size === 0 ||
      Array.from(selectedTags).every((tag) => cardTags.includes(tag));

    const isVisible = matchesSearch && matchesTags;
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  emptyMessage.hidden = visibleCount !== 0;
}

searchInput.addEventListener('input', filterCards);
loadPosts();
