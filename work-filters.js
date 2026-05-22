const searchInput = document.getElementById('work-search');
const cards = Array.from(document.querySelectorAll('.blog-card'));
const tagContainer = document.querySelector('.tag-filters');
const selectedTags = new Set();

const defaultTags = ['data', 'policy', 'design', 'macro', 'micro'];
const tags = Array.from(
  new Set([
    ...defaultTags,
    ...cards.flatMap((card) =>
      card.dataset.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ]),
);

tags.forEach((tag) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'tag-filter';
  button.textContent = tag;
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

function filterCards() {
  const query = searchInput.value.trim().toLowerCase();

  cards.forEach((card) => {
    const cardTags = card.dataset.tags
      .split(',')
      .map((tag) => tag.trim())
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

    card.hidden = !(matchesSearch && matchesTags);
  });
}

searchInput.addEventListener('input', filterCards);
