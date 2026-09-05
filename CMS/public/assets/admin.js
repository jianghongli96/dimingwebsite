const listEl = document.getElementById('article-list')
const message = document.getElementById('message')

document.getElementById('logout-button').addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' })
  location.href = '/login'
})

loadArticles()

async function loadArticles() {
  const response = await fetch('/api/admin/articles')
  if (response.status === 401) {
    location.href = '/login'
    return
  }

  const articles = await response.json()
  renderList(articles)
}

function renderList(articles) {
  if (!articles.length) {
    listEl.innerHTML = `
      <tr>
        <td class="empty-state" colspan="6">暂无文章，点击右上角创建文章。</td>
      </tr>
    `
    return
  }

  listEl.innerHTML = articles
    .map(
      (article) => `
        <tr>
          <td>
            <strong>${escapeHtml(article.title)}</strong>
            <small>${escapeHtml(article.summary || '暂无摘要')}</small>
          </td>
          <td>${escapeHtml(article.category || '行业资讯')}</td>
          <td><span class="status-pill ${article.status === 'published' ? 'published' : 'draft'}">${article.status === 'published' ? '已发布' : '草稿'}</span></td>
          <td>${formatDate(article.updatedAt || article.createdAt)}</td>
          <td><code>${escapeHtml(article.slug)}</code></td>
          <td>
            <div class="table-actions">
              <a class="table-link" href="/admin/articles/${article.id}/edit">编辑</a>
              <button class="table-danger" type="button" data-delete-id="${article.id}">删除</button>
            </div>
          </td>
        </tr>
      `
    )
    .join('')

  listEl.querySelectorAll('[data-delete-id]').forEach((button) => {
    button.addEventListener('click', () => deleteArticle(Number(button.dataset.deleteId)))
  })
}

async function deleteArticle(id) {
  if (!confirm('确认删除这篇文章？此操作不可恢复。')) return

  const response = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' })
  if (!response.ok) {
    message.textContent = '删除失败'
    return
  }

  message.textContent = '文章已删除'
  await loadArticles()
}

function formatDate(value) {
  return value ? String(value).slice(0, 10) : '-'
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
