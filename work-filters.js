const workList = document.getElementById('work-list');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderSummary(summary) {
  const escaped = escapeHtml(summary);
  const linked = escaped.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  return linked.replace(/\n/g, '<br>');
}

async function loadPosts() {
  const response = await fetch('data/work-posts.json');
  const posts = await response.json();

  workList.innerHTML = posts
    .map((post) => (
      '<li class="work-entry">' +
        '<p class="work-title"><a href="' + escapeHtml(post.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(post.title) + '</a></p>' +
        '<p class="work-meta">' + escapeHtml(post.publisher) + ', ' + escapeHtml(post.date) + '</p>' +
        '<p class="work-summary">' + renderSummary(post.summary) + '</p>' +
      '</li>'
    ))
    .join('');
}

loadPosts();
