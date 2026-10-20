const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export async function apiRequest(path, { method = 'GET', token, body } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const text = await response.text()
  let data = null
  if (text) {
    try { data = JSON.parse(text) } catch { data = text }
  }

  if (!response.ok) {
    const message = data?.error || data?.message || (typeof data === 'string' ? data : null) || `Request failed (${response.status})`
    throw new Error(message)
  }
  return data
}

export { API_BASE_URL }
