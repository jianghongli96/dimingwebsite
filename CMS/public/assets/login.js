const form = document.getElementById('login-form')
const message = document.getElementById('message')

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  message.textContent = ''

  const formData = new FormData(form)
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: formData.get('username'),
      password: formData.get('password')
    })
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    message.textContent = data.error || '登录失败'
    return
  }

  location.href = '/admin'
})
