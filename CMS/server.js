import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { createServer } from 'node:http'
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const publicDir = resolve(rootDir, 'public')
const dataDir = resolve(process.env.CMS_DATA_DIR || resolve(rootDir, 'data'))
const uploadDir = resolve(process.env.CMS_UPLOAD_DIR || resolve(rootDir, 'uploads'))
const dbPath = resolve(dataDir, 'cms.sqlite')

const port = Number(process.env.PORT || 4000)
const sessionSecret = process.env.CMS_SESSION_SECRET || 'diming-cms-local-secret-change-in-production'
const defaultAdminUser = process.env.CMS_ADMIN_USER || 'admin'
const defaultAdminPassword = process.env.CMS_ADMIN_PASSWORD || 'Diming@2026'
const sessions = new Map()

mkdirSync(dataDir, { recursive: true })
mkdirSync(uploadDir, { recursive: true })

const db = new DatabaseSync(dbPath)
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT DEFAULT '',
    category TEXT DEFAULT '行业资讯',
    tags TEXT DEFAULT '',
    seo_title TEXT DEFAULT '',
    seo_description TEXT DEFAULT '',
    content TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'draft',
    published_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`)

seedAdmin()

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`)
    const pathname = decodeURIComponent(url.pathname)
    const routePath = normalizeRoutePath(pathname)

    if (routePath === '/') return redirect(res, '/admin')
    if (routePath === '/login' && req.method === 'GET') return serveStatic(res, 'login.html')
    if (routePath === '/admin' && req.method === 'GET') return requireAdmin(req, res, () => serveStatic(res, 'admin.html'))
    if (routePath === '/admin/articles/new' && req.method === 'GET') {
      return requireAdmin(req, res, () => serveStatic(res, 'article-form.html'))
    }
    if (/^\/admin\/articles\/\d+\/edit$/.test(routePath) && req.method === 'GET') {
      return requireAdmin(req, res, () => serveStatic(res, 'article-form.html'))
    }
    if (pathname.startsWith('/assets/') && req.method === 'GET') return serveStatic(res, pathname.slice(1))
    if (pathname.startsWith('/uploads/') && req.method === 'GET') return serveUpload(res, pathname.replace('/uploads/', ''))

    if (routePath === '/api/login' && req.method === 'POST') return handleLogin(req, res)
    if (routePath === '/api/logout' && req.method === 'POST') return handleLogout(req, res)
    if (routePath === '/api/me' && req.method === 'GET') return json(res, 200, { authenticated: Boolean(getSession(req)) })
    if (routePath === '/api/uploads' && req.method === 'POST') {
      return requireAdmin(req, res, () => handleUpload(req, res))
    }

    if (routePath === '/api/articles' && req.method === 'GET') return handlePublicArticleList(res)
    if (routePath.startsWith('/api/articles/') && req.method === 'GET') {
      return handlePublicArticleDetail(res, routePath.replace('/api/articles/', ''))
    }

    if (routePath === '/api/admin/articles' && req.method === 'GET') {
      return requireAdmin(req, res, () => handleAdminArticleList(res))
    }
    if (routePath === '/api/admin/articles' && req.method === 'POST') {
      return requireAdmin(req, res, () => handleAdminArticleSave(req, res))
    }
    if (isAdminArticleItemPath(routePath) && req.method === 'GET') {
      return requireAdmin(req, res, () => handleAdminArticleGet(res, getIdFromPath(routePath)))
    }
    if (isAdminArticleItemPath(routePath) && req.method === 'PUT') {
      return requireAdmin(req, res, () => handleAdminArticleSave(req, res, getIdFromPath(routePath)))
    }
    if (isAdminArticleItemPath(routePath) && req.method === 'DELETE') {
      return requireAdmin(req, res, () => handleAdminArticleDelete(res, getIdFromPath(routePath)))
    }

    return json(res, 404, { error: 'Not found' })
  } catch (error) {
    console.error(error)
    return json(res, 500, { error: 'Server error' })
  }
})

server.listen(port, () => {
  console.log(`DIMING CMS running at http://localhost:${port}`)
  console.log(`Admin login: ${defaultAdminUser} / ${defaultAdminPassword}`)
})

function seedAdmin() {
  const count = db.prepare('SELECT COUNT(*) AS count FROM admins').get().count
  if (count > 0) return

  db.prepare('INSERT INTO admins (username, password_hash, created_at) VALUES (?, ?, ?)').run(
    defaultAdminUser,
    hashPassword(defaultAdminPassword),
    new Date().toISOString()
  )
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':')
  const actual = Buffer.from(hash, 'hex')
  const expected = scryptSync(password, salt, 64)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

async function handleLogin(req, res) {
  const body = await readJson(req)
  const username = String(body.username || '').trim()
  const password = String(body.password || '')
  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username)

  if (!admin || !verifyPassword(password, admin.password_hash)) {
    return json(res, 401, { error: '用户名或密码错误' })
  }

  const token = createSessionToken()
  sessions.set(token, { adminId: admin.id, username: admin.username, expiresAt: Date.now() + 1000 * 60 * 60 * 8 })
  setCookie(res, 'cms_session', token, { httpOnly: true, sameSite: 'Strict', path: '/', maxAge: 60 * 60 * 8 })
  return json(res, 200, { ok: true })
}

function handleLogout(req, res) {
  const sessionToken = getCookie(req, 'cms_session')
  if (sessionToken) sessions.delete(sessionToken)
  setCookie(res, 'cms_session', '', { httpOnly: true, sameSite: 'Strict', path: '/', maxAge: 0 })
  return json(res, 200, { ok: true })
}

function handlePublicArticleList(res) {
  const rows = db
    .prepare(
      `SELECT id, title, slug, summary, category, tags, seo_title, seo_description, status, published_at, created_at, updated_at
       FROM articles
       WHERE status = 'published'
       ORDER BY COALESCE(published_at, created_at) DESC`
    )
    .all()
  return json(res, 200, rows.map(formatArticle))
}

function handlePublicArticleDetail(res, slug) {
  const article = db
    .prepare(
      `SELECT *
       FROM articles
       WHERE slug = ? AND status = 'published'
       LIMIT 1`
    )
    .get(slug)
  if (!article) return json(res, 404, { error: 'Article not found' })
  return json(res, 200, formatArticle(article))
}

function handleAdminArticleList(res) {
  const rows = db
    .prepare(
      `SELECT id, title, slug, summary, category, tags, status, published_at, created_at, updated_at
       FROM articles
       ORDER BY updated_at DESC`
    )
    .all()
  return json(res, 200, rows.map(formatArticle))
}

function handleAdminArticleGet(res, id) {
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(id)
  if (!article) return json(res, 404, { error: 'Article not found' })
  return json(res, 200, formatArticle(article))
}

async function handleAdminArticleSave(req, res, id) {
  const body = await readJson(req)
  const now = new Date().toISOString()
  const title = String(body.title || '').trim()
  const status = body.status === 'published' ? 'published' : 'draft'
  const publishedAt = status === 'published' ? body.publishedAt || now : null

  if (!title) return json(res, 400, { error: '标题不能为空' })

  const existingArticle = id ? db.prepare('SELECT slug FROM articles WHERE id = ?').get(id) : null
  const slug = existingArticle?.slug || createUniqueSlug(slugify(title) || createFallbackSlug(), id)

  const values = {
    title,
    slug,
    summary: String(body.summary || '').trim(),
    category: String(body.category || '行业资讯').trim(),
    tags: Array.isArray(body.tags) ? body.tags.join(',') : String(body.tags || '').trim(),
    seoTitle: String(body.seoTitle || '').trim(),
    seoDescription: String(body.seoDescription || '').trim(),
    content: String(body.content || ''),
    status,
    publishedAt,
    now
  }

  try {
    if (id) {
      db.prepare(
        `UPDATE articles
         SET title = ?, slug = ?, summary = ?, category = ?, tags = ?, seo_title = ?, seo_description = ?,
             content = ?, status = ?, published_at = ?, updated_at = ?
         WHERE id = ?`
      ).run(
        values.title,
        values.slug,
        values.summary,
        values.category,
        values.tags,
        values.seoTitle,
        values.seoDescription,
        values.content,
        values.status,
        values.publishedAt,
        values.now,
        id
      )
      return handleAdminArticleGet(res, id)
    }

    const result = db
      .prepare(
        `INSERT INTO articles
         (title, slug, summary, category, tags, seo_title, seo_description, content, status, published_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        values.title,
        values.slug,
        values.summary,
        values.category,
        values.tags,
        values.seoTitle,
        values.seoDescription,
        values.content,
        values.status,
        values.publishedAt,
        values.now,
        values.now
      )
    return handleAdminArticleGet(res, result.lastInsertRowid)
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) return json(res, 409, { error: 'URL 标识生成冲突，请重新保存' })
    throw error
  }
}

function handleAdminArticleDelete(res, id) {
  db.prepare('DELETE FROM articles WHERE id = ?').run(id)
  return json(res, 200, { ok: true })
}

async function handleUpload(req, res) {
  const contentType = req.headers['content-type'] || ''
  const boundary = contentType.match(/boundary=(.+)$/)?.[1]
  if (!boundary) return json(res, 400, { error: '缺少上传边界' })

  const buffer = await readBody(req)
  const file = parseMultipartFile(buffer, boundary)
  if (!file) return json(res, 400, { error: '没有找到上传文件' })

  const allowed = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp'])
  const ext = extname(file.filename).toLowerCase()
  if (!allowed.has(ext)) return json(res, 400, { error: '仅支持 png、jpg、jpeg、gif、webp 图片' })
  if (file.content.length > 8 * 1024 * 1024) return json(res, 400, { error: '图片不能超过 8MB' })

  const safeName = `${Date.now()}-${randomBytes(6).toString('hex')}${ext}`
  writeFileSync(join(uploadDir, safeName), file.content)
  return json(res, 201, { url: `/uploads/${safeName}` })
}

function parseMultipartFile(buffer, boundary) {
  const marker = `--${boundary}`
  const body = buffer.toString('binary')
  const parts = body.split(marker)

  for (const part of parts) {
    if (!part.includes('filename=')) continue
    const [rawHeaders, rawContent] = part.split('\r\n\r\n')
    if (!rawHeaders || rawContent === undefined) continue

    const filename = rawHeaders.match(/filename="([^"]+)"/)?.[1] || 'upload'
    const contentStart = Buffer.byteLength(part.split('\r\n\r\n')[0] + '\r\n\r\n', 'binary')
    const partBuffer = Buffer.from(part, 'binary')
    let content = partBuffer.subarray(contentStart)
    if (content.subarray(-2).toString('binary') === '\r\n') content = content.subarray(0, -2)
    return { filename, content }
  }
  return null
}

function formatArticle(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    category: row.category,
    tags: row.tags ? row.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    content: row.content,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

function requireAdmin(req, res, next) {
  if (!getSession(req)) {
    if ((req.headers.accept || '').includes('text/html')) return redirect(res, '/login')
    return json(res, 401, { error: 'Unauthorized' })
  }
  return next()
}

function getSession(req) {
  const sessionToken = getCookie(req, 'cms_session')
  if (!sessionToken) return null
  const session = sessions.get(sessionToken)
  if (!session) return null
  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionToken)
    return null
  }
  return session
}

function createSessionToken() {
  const raw = randomBytes(32).toString('hex')
  const signature = createHmac('sha256', sessionSecret).update(raw).digest('hex')
  return `${raw}.${signature}`
}

function getCookie(req, name) {
  const cookie = req.headers.cookie || ''
  return cookie
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.slice(name.length + 1)
}

function setCookie(res, name, value, options) {
  const parts = [`${name}=${value}`]
  if (options.httpOnly) parts.push('HttpOnly')
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`)
  if (options.path) parts.push(`Path=${options.path}`)
  if (typeof options.maxAge === 'number') parts.push(`Max-Age=${options.maxAge}`)
  res.setHeader('Set-Cookie', parts.join('; '))
}

function normalizeRoutePath(pathname) {
  if (pathname === '/') return pathname
  return pathname.replace(/\/+$/, '')
}

function isAdminArticleItemPath(pathname) {
  return /^\/api\/admin\/articles\/\d+$/.test(pathname)
}

function getIdFromPath(pathname) {
  return Number(pathname.split('/').filter(Boolean).at(-1))
}

function createUniqueSlug(baseSlug, id) {
  let candidate = baseSlug
  let index = 2

  while (slugExists(candidate, id)) {
    candidate = `${baseSlug}-${index}`
    index += 1
  }

  return candidate
}

function slugExists(slug, id) {
  if (id) {
    return Boolean(db.prepare('SELECT id FROM articles WHERE slug = ? AND id != ?').get(slug, id))
  }
  return Boolean(db.prepare('SELECT id FROM articles WHERE slug = ?').get(slug))
}

function createFallbackSlug() {
  return `article-${new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)}`
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-\u4e00-\u9fa5]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function serveStatic(res, relativePath) {
  const target = resolve(publicDir, normalize(relativePath))
  if (!target.startsWith(publicDir) || !existsSync(target) || !statSync(target).isFile()) return json(res, 404, { error: 'Not found' })
  streamFile(res, target)
}

function serveUpload(res, filename) {
  const target = resolve(uploadDir, normalize(filename))
  if (!target.startsWith(uploadDir) || !existsSync(target) || !statSync(target).isFile()) return json(res, 404, { error: 'Not found' })
  streamFile(res, target)
}

function streamFile(res, target) {
  res.writeHead(200, {
    'Content-Type': mimeTypes[extname(target).toLowerCase()] || 'application/octet-stream'
  })
  createReadStream(target).pipe(res)
}

function redirect(res, location) {
  res.writeHead(302, { Location: location })
  res.end()
}

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(payload))
}

async function readJson(req) {
  const body = await readBody(req)
  if (!body.length) return {}
  return JSON.parse(body.toString('utf8'))
}

function readBody(req) {
  return new Promise((resolveBody, rejectBody) => {
    const chunks = []
    let total = 0
    req.on('data', (chunk) => {
      total += chunk.length
      if (total > 12 * 1024 * 1024) {
        rejectBody(new Error('Request body too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolveBody(Buffer.concat(chunks)))
    req.on('error', rejectBody)
  })
}
