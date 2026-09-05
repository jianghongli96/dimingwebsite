const form = document.getElementById('article-form')
const editor = document.getElementById('editor')
const message = document.getElementById('message')
const imageInput = document.getElementById('image-input')
const pageTitle = document.getElementById('page-title')
const pageDescription = document.getElementById('page-description')

const articleId = getArticleId()
const isEdit = Boolean(articleId)
let savedSelection = null

document.getElementById('logout-button').addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' })
  location.href = '/login'
})

document.querySelectorAll('[data-command]').forEach((button) => {
  button.addEventListener('click', () => {
    restoreEditorSelection()
    document.execCommand(button.dataset.command, false)
    saveEditorSelection()
    editor.focus()
  })
})

document.querySelectorAll('[data-block]').forEach((button) => {
  button.addEventListener('click', () => {
    restoreEditorSelection()
    document.execCommand('formatBlock', false, button.dataset.block)
    saveEditorSelection()
    editor.focus()
  })
})

document.getElementById('link-button').addEventListener('click', () => {
  const url = prompt('请输入链接地址')
  if (!url) return
  restoreEditorSelection()
  document.execCommand('createLink', false, url)
  saveEditorSelection()
  editor.focus()
})

editor.addEventListener('keyup', saveEditorSelection)
editor.addEventListener('mouseup', saveEditorSelection)
editor.addEventListener('focus', saveEditorSelection)

imageInput.addEventListener('change', async () => {
  const file = imageInput.files[0]
  if (!file) return

  const uploadData = new FormData()
  uploadData.append('file', file)
  const response = await fetch('/api/uploads', { method: 'POST', body: uploadData })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    message.textContent = data.error || '图片上传失败'
    return
  }

  insertImageAtSelection(data.url)
  editor.focus()
  imageInput.value = ''
})

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const response = await fetch(isEdit ? `/api/admin/articles/${articleId}` : '/api/admin/articles', {
    method: isEdit ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(readForm())
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    message.textContent = data.error || '保存失败'
    return
  }

  location.href = '/admin'
})

initialize()

async function initialize() {
  form.elements.category.value = '行业资讯'
  form.elements.status.value = 'draft'
  editor.innerHTML = '<p>请输入文章正文。</p>'

  if (!isEdit) return

  pageTitle.textContent = '编辑文章'
  pageDescription.textContent = '修改文章内容并保存，系统会保留原有 URL 标识。'

  const response = await fetch(`/api/admin/articles/${articleId}`)
  if (response.status === 401) {
    location.href = '/login'
    return
  }
  if (!response.ok) {
    message.textContent = '文章不存在'
    form.querySelector('button[type="submit"]').disabled = true
    return
  }

  const article = await response.json()
  form.elements.id.value = article.id
  form.elements.title.value = article.title || ''
  form.elements.summary.value = article.summary || ''
  form.elements.category.value = article.category || '行业资讯'
  form.elements.tags.value = (article.tags || []).join(',')
  form.elements.seoTitle.value = article.seoTitle || ''
  form.elements.seoDescription.value = article.seoDescription || ''
  form.elements.status.value = article.status || 'draft'
  editor.innerHTML = article.content || '<p></p>'
}

function readForm() {
  return {
    title: form.elements.title.value,
    summary: form.elements.summary.value,
    category: form.elements.category.value,
    tags: form.elements.tags.value,
    seoTitle: form.elements.seoTitle.value,
    seoDescription: form.elements.seoDescription.value,
    status: form.elements.status.value,
    content: editor.innerHTML
  }
}

function saveEditorSelection() {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  if (!editor.contains(range.commonAncestorContainer)) return
  savedSelection = range.cloneRange()
}

function restoreEditorSelection() {
  if (!savedSelection) return

  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(savedSelection)
}

function insertImageAtSelection(src) {
  restoreEditorSelection()

  const image = document.createElement('img')
  image.src = src
  image.alt = ''

  const paragraph = document.createElement('p')
  paragraph.appendChild(document.createElement('br'))

  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0 || !editor.contains(selection.getRangeAt(0).commonAncestorContainer)) {
    editor.appendChild(image)
    editor.appendChild(paragraph)
    placeCaretInside(paragraph)
    return
  }

  const range = selection.getRangeAt(0)
  range.deleteContents()
  range.insertNode(paragraph)
  range.insertNode(image)
  placeCaretInside(paragraph)
}

function placeCaretInside(node) {
  const range = document.createRange()
  range.selectNodeContents(node)
  range.collapse(true)

  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
  savedSelection = range.cloneRange()
}

function getArticleId() {
  const match = location.pathname.replace(/\/+$/, '').match(/^\/admin\/articles\/(\d+)\/edit$/)
  return match ? Number(match[1]) : null
}
