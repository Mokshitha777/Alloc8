import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from './api.js'

const emptyRegister = { name: '', email: '', password: '' }
const emptyLogin = { email: '', password: '' }

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

function StatCard({ label, value, note }) {
  return <div className="stat-card"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>
}

function App() {
  const [mode, setMode] = useState('login')
  const [login, setLogin] = useState(emptyLogin)
  const [register, setRegister] = useState(emptyRegister)
  const [token, setToken] = useState(() => sessionStorage.getItem('alloc8_token') || '')
  const [user, setUser] = useState(null)
  const [resources, setResources] = useState([])
  const [requests, setRequests] = useState([])
  const [allocations, setAllocations] = useState([])
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState(null)
  const [requestForm, setRequestForm] = useState({
    resourceType: 'ROOM',
    startTime: '',
    endTime: '',
    priority: 1,
  })
  const [resourceForm, setResourceForm] = useState({ name: '', type: 'ROOM', capacity: 1 })

  const counts = useMemo(() => ({
    resources: resources.length,
    pending: requests.filter(item => item.status === 'PENDING').length,
    allocated: requests.filter(item => item.status === 'ALLOCATED').length,
  }), [resources, requests])

  async function loadDashboard(currentToken = token) {
    if (!currentToken) return
    setLoading(true)
    setNotice(null)
    try {
      const [userData, resourceData, requestData, allocationData] = await Promise.all([
        apiRequest('/api/users', { token: currentToken }),
        apiRequest('/api/resources', { token: currentToken }),
        apiRequest('/api/requests', { token: currentToken }),
        apiRequest('/api/allocations', { token: currentToken }),
      ])
      setUser(Array.isArray(userData) ? userData[0] || null : userData)
      setResources(Array.isArray(resourceData) ? resourceData : [])
      setRequests(Array.isArray(requestData) ? requestData : [])
      setAllocations(Array.isArray(allocationData) ? allocationData : [])
    } catch (error) {
      setNotice({ type: 'error', text: `${error.message}. Check that the backend is running and your account has access.` })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) loadDashboard(token)
    // Intentionally load on initial token / login state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function handleLogin(event) {
    event.preventDefault()
    setLoading(true)
    setNotice(null)
    try {
      const data = await apiRequest('/api/auth/login', { method: 'POST', body: login })
      if (!data?.token) throw new Error('Login response did not contain a token')
      sessionStorage.setItem('alloc8_token', data.token)
      setToken(data.token)
      setNotice({ type: 'success', text: 'Logged in successfully.' })
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(event) {
    event.preventDefault()
    setLoading(true)
    setNotice(null)
    try {
      await apiRequest('/api/users/register', { method: 'POST', body: register })
      setNotice({ type: 'success', text: 'Account created. You can now log in.' })
      setMode('login')
      setLogin({ email: register.email, password: register.password })
      setRegister(emptyRegister)
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    sessionStorage.removeItem('alloc8_token')
    setToken('')
    setUser(null)
    setResources([])
    setRequests([])
    setAllocations([])
    setNotice(null)
  }

  async function submitRequest(event) {
    event.preventDefault()
    setLoading(true)
    setNotice(null)
    try {
      if (!user?.id) throw new Error('Could not determine your user ID. Check GET /api/users response.')
      if (!requestForm.startTime || !requestForm.endTime) throw new Error('Choose a start and end time.')
      await apiRequest('/api/requests', {
        method: 'POST',
        token,
        body: {
          userId: user.id,
          resourceType: requestForm.resourceType,
          startTime: new Date(requestForm.startTime).toISOString().slice(0, 19),
          endTime: new Date(requestForm.endTime).toISOString().slice(0, 19),
          priority: Number(requestForm.priority),
        },
      })
      setNotice({ type: 'success', text: 'Allocation request submitted.' })
      await loadDashboard(token)
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function createResource(event) {
    event.preventDefault()
    setLoading(true)
    setNotice(null)
    try {
      await apiRequest('/api/resources', {
        method: 'POST',
        token,
        body: { ...resourceForm, capacity: Number(resourceForm.capacity) },
      })
      setNotice({ type: 'success', text: 'Resource created.' })
      setResourceForm({ name: '', type: 'ROOM', capacity: 1 })
      await loadDashboard(token)
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <main className="auth-shell">
        <section className="auth-visual">
          <div className="brand"><span className="brand-mark">A</span><span>Alloc<span className="brand-accent">8</span></span></div>
          <div className="visual-copy">
            <p className="eyebrow">SMART RESOURCE ALLOCATION</p>
            <h1>Make every<br /><em>resource count.</em></h1>
            <p className="muted large">One clear space to request, manage, and allocate resources without the chaos.</p>
          </div>
          <div className="visual-footer"><span className="pulse-dot" /> Allocation, made thoughtful.</div>
          <div className="decor decor-one" /><div className="decor decor-two" />
        </section>
        <section className="auth-panel">
          <div className="mobile-brand"><span className="brand-mark">A</span><span>Alloc<span className="brand-accent">8</span></span></div>
          <div className="auth-card">
            <p className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'GET STARTED'}</p>
            <h2>{mode === 'login' ? 'Sign in to Alloc8' : 'Create your account'}</h2>
            <p className="muted">{mode === 'login' ? 'Enter your details to access your workspace.' : 'A few details and your workspace is ready.'}</p>
            {notice && <div className={`notice ${notice.type}`}>{notice.text}</div>}
            <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="form-stack">
              {mode === 'register' && <label>Full name<input value={register.name} onChange={e => setRegister({ ...register, name: e.target.value })} placeholder="Your name" required /></label>}
              <label>Email address<input type="email" value={mode === 'login' ? login.email : register.email} onChange={e => mode === 'login' ? setLogin({ ...login, email: e.target.value }) : setRegister({ ...register, email: e.target.value })} placeholder="you@example.com" required /></label>
              <label>Password<input type="password" minLength={mode === 'register' ? 8 : undefined} value={mode === 'login' ? login.password : register.password} onChange={e => mode === 'login' ? setLogin({ ...login, password: e.target.value }) : setRegister({ ...register, password: e.target.value })} placeholder={mode === 'register' ? 'At least 8 characters' : 'Enter your password'} required /></label>
              <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'} <span>↗</span></button>
            </form>
            <p className="switch-mode">{mode === 'login' ? "New to Alloc8?" : 'Already have an account?'} <button type="button" onClick={() => { setNotice(null); setMode(mode === 'login' ? 'register' : 'login') }}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></p>
          </div>
          <p className="auth-foot">Built for better use of shared resources.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">A</span><span>Alloc<span className="brand-accent">8</span></span></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav">
          <a className="active" href="#overview"><span>◫</span> Overview</a>
          <a href="#resources"><span>▦</span> Resources</a>
          <a href="#requests"><span>⇄</span> My requests</a>
          <a href="#allocations"><span>✓</span> Allocations</a>
        </nav>
        <div className="sidebar-bottom"><div className="user-avatar">{(user?.name || 'U').slice(0, 1).toUpperCase()}</div><div className="user-mini"><strong>{user?.name || 'Alloc8 user'}</strong><span>{user?.role || 'USER'}</span></div><button className="icon-button" title="Sign out" onClick={logout}>↪</button></div>
      </aside>
      <section className="main-content">
        <header className="topbar"><div><span className="breadcrumb">Workspace /</span> <strong>Overview</strong></div><div className="topbar-right"><span className="status-pill"><i /> API connected</span><button className="avatar-button" onClick={logout} title="Sign out">{(user?.name || 'U').slice(0, 1).toUpperCase()}</button></div></header>
        <div className="page-content" id="overview">
          <div className="page-heading"><div><p className="eyebrow">YOUR WORKSPACE</p><h1>Good to see you{user?.name ? `, ${user.name.split(' ')[0]}` : ''}.</h1><p className="muted">Here's what's happening with your resources today.</p></div><button className="secondary-button" onClick={() => loadDashboard(token)} disabled={loading}>↻ Refresh</button></div>
          {notice && <div className={`notice ${notice.type}`}>{notice.text}</div>}
          <div className="stats-grid"><StatCard label="Total resources" value={counts.resources} note="Across your workspace" /><StatCard label="Pending requests" value={counts.pending} note="Awaiting allocation" /><StatCard label="Allocated requests" value={counts.allocated} note="Successfully assigned" /></div>
          <div className="content-grid">
            <section className="panel" id="resources"><div className="panel-heading"><div><h2>Resources</h2><p className="muted">Available resources from your backend</p></div><span className="count-badge">{resources.length}</span></div>
              {resources.length ? <div className="resource-list">{resources.map(resource => <div className="resource-row" key={resource.id}><div className="resource-icon">▦</div><div className="resource-details"><strong>{resource.name}</strong><span>{resource.type} · Capacity {resource.capacity}</span></div><span className={`tag ${String(resource.status).toLowerCase()}`}>{resource.status}</span></div>)}</div> : <div className="empty-state"><div className="empty-icon">▦</div><strong>No resources yet</strong><span>Create a resource as an admin or refresh after adding one.</span></div>}
            </section>
            <section className="panel" id="requests"><div className="panel-heading"><div><h2>Request a resource</h2><p className="muted">Choose when you need it</p></div><span className="tiny-label">NEW REQUEST</span></div>
              <form className="form-stack compact" onSubmit={submitRequest}>
                <label>Resource type<select value={requestForm.resourceType} onChange={e => setRequestForm({ ...requestForm, resourceType: e.target.value })}><option>ROOM</option><option>PROJECTOR</option><option>VEHICLE</option><option>DESK</option><option>OTHER</option></select></label>
                <div className="two-col"><label>Start time<input type="datetime-local" value={requestForm.startTime} onChange={e => setRequestForm({ ...requestForm, startTime: e.target.value })} required /></label><label>End time<input type="datetime-local" value={requestForm.endTime} onChange={e => setRequestForm({ ...requestForm, endTime: e.target.value })} required /></label></div>
                <label>Priority<select value={requestForm.priority} onChange={e => setRequestForm({ ...requestForm, priority: e.target.value })}><option value="1">1 — Normal</option><option value="2">2 — Medium</option><option value="3">3 — High</option><option value="4">4 — Urgent</option><option value="5">5 — Critical</option></select></label>
                <button className="primary-button" type="submit" disabled={loading}>Submit request <span>↗</span></button>
              </form>
            </section>
          </div>
          <section className="panel table-panel" id="allocations"><div className="panel-heading"><div><h2>Recent activity</h2><p className="muted">Your latest requests and allocations</p></div></div>
            {requests.length ? <div className="table-wrap"><table><thead><tr><th>Request</th><th>Resource type</th><th>Schedule</th><th>Priority</th><th>Status</th></tr></thead><tbody>{requests.map(item => <tr key={item.id}><td>REQ-{String(item.id).padStart(3, '0')}</td><td>{item.resourceType}</td><td>{formatDate(item.startTime)} – {formatDate(item.endTime)}</td><td><span className="priority">P{item.priority}</span></td><td><span className={`tag ${String(item.status).toLowerCase()}`}>{item.status}</span></td></tr>)}</tbody></table></div> : <div className="empty-state slim"><strong>No activity yet</strong><span>Submit a request to see it appear here.</span></div>}
            <div className="allocation-foot"><span>{allocations.length} allocation record(s)</span><span>Updated from Alloc8 API</span></div>
          </section>
          {user?.role === 'ADMIN' && <section className="panel admin-panel"><div className="panel-heading"><div><h2>Admin · Add a resource</h2><p className="muted">This action requires the ADMIN role.</p></div></div><form className="form-stack compact" onSubmit={createResource}><div className="two-col"><label>Resource name<input value={resourceForm.name} onChange={e => setResourceForm({ ...resourceForm, name: e.target.value })} required placeholder="Conference Room A" /></label><label>Type<select value={resourceForm.type} onChange={e => setResourceForm({ ...resourceForm, type: e.target.value })}><option>ROOM</option><option>PROJECTOR</option><option>VEHICLE</option><option>DESK</option><option>OTHER</option></select></label></div><label>Capacity<input type="number" min="1" value={resourceForm.capacity} onChange={e => setResourceForm({ ...resourceForm, capacity: e.target.value })} required /></label><button className="primary-button" type="submit" disabled={loading}>Create resource <span>↗</span></button></form></section>}
        </div>
      </section>
    </main>
  )
}

export default App
