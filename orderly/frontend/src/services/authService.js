import { authApi } from './api'

const TOKEN_KEY = 'orderly_token'
const USER_KEY = 'orderly_user'

export async function login(email, password) {
  const data = await authApi.login({ email, password })
  localStorage.setItem(TOKEN_KEY, data.access_token)
  localStorage.setItem(USER_KEY, JSON.stringify(data.user))
  return data.user
}

export async function register(name, email, password, role = 'customer') {
  const data = await authApi.register({ name, email, password, role })
  return data
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getCurrentUser() {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function isAuthenticated() {
  return !!getToken()
}