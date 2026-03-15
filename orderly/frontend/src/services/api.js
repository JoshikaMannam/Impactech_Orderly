const CATEGORIES = [
  'Breakfast',
  'Chaat',
  'Starters',
  'Veg Curry',
  'Non-Veg Curry',
  'Breads',
  'Rice',
  'Combos',
  'Pizza',
  'Burgers',
  'Sides',
  'Desserts',
  'Beverages',
]

const QUANTITY_WORDS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
}

const STORAGE_KEY = 'orderly_mock_state_v1'

const wait = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms))
const clone = (value) => JSON.parse(JSON.stringify(value))
const nowIso = () => new Date().toISOString()

function seededMenu() {
  const targetByCategory = {
    Breakfast: 13,
    Chaat: 12,
    Starters: 12,
    'Veg Curry': 12,
    'Non-Veg Curry': 12,
    Breads: 12,
    Rice: 13,
    Combos: 12,
    Pizza: 12,
    Burgers: 12,
    Sides: 12,
    Desserts: 12,
    Beverages: 13,
  }

  const base = {
    Breakfast: [
      ['Masala Dosa', 120, true],
      ['Idli Sambar', 95, true],
      ['Poori Bhaji', 110, true],
    ],
    Chaat: [['Pani Puri', 80, true], ['Dahi Puri', 90, true]],
    Starters: [['Paneer Tikka', 220, true], ['Chicken Tikka', 260, true]],
    'Veg Curry': [['Paneer Butter Masala', 240, true], ['Kadai Paneer', 235, true]],
    'Non-Veg Curry': [['Butter Chicken', 290, true], ['Chicken Curry', 270, true]],
    Breads: [['Butter Naan', 45, true], ['Garlic Naan', 55, true]],
    Rice: [['Chicken Biryani', 280, true], ['Veg Biryani', 220, true], ['Jeera Rice', 150, true]],
    Combos: [['Mini Meal Combo', 260, true], ['Family Combo', 620, true]],
    Pizza: [['Margherita Pizza', 260, true], ['Farmhouse Pizza', 330, true]],
    Burgers: [['Veg Burger', 140, true], ['Chicken Burger', 180, true]],
    Sides: [['French Fries', 120, false], ['Masala Fries', 140, true]],
    Desserts: [['Gulab Jamun', 90, true], ['Brownie', 130, true]],
    Beverages: [['Masala Chai', 40, true], ['Cold Coffee', 110, true], ['Fresh Lime Soda', 90, true]],
  }

  let id = 1
  const list = []

  for (const category of CATEGORIES) {
    const seeded = base[category] || []
    for (const [name, price, available] of seeded) {
      list.push({ id: id++, name, category, price, available })
    }

    const needed = targetByCategory[category] - seeded.length
    for (let i = 1; i <= needed; i += 1) {
      const price = 80 + ((i * 23 + category.length * 11) % 260)
      list.push({
        id: id++,
        name: `${category} Special ${i}`,
        category,
        price,
        available: i % 10 !== 0,
      })
    }
  }

  return list
}

function buildInitialState() {
  const menu = seededMenu()
  const byName = (name) => menu.find((item) => item.name === name)

  const firstOrderItems = [
    { ...byName('Chicken Biryani'), qty: 1 },
    { ...byName('Butter Naan'), qty: 2 },
  ]

  const secondOrderItems = [{ ...byName('Paneer Tikka'), qty: 1 }]
  const thirdOrderItems = [{ ...byName('Margherita Pizza'), qty: 1 }]

  const makeOrder = (id, status, items, minutesAgo) => ({
    id,
    user_id: 1,
    status,
    items: items.map((i) => ({ id: i.id, name: i.name, category: i.category, price: i.price, qty: i.qty })),
    total_price: items.reduce((sum, i) => sum + i.price * i.qty, 0),
    created_at: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
    updated_at: nowIso(),
  })

  return {
    users: [
      { id: 1, name: 'Demo Customer', email: 'customer@orderly.app', password: 'demo123', role: 'customer' },
      { id: 2, name: 'Demo Staff', email: 'staff@orderly.app', password: 'demo123', role: 'staff' },
    ],
    menu,
    specials: menu
      .filter((item) => ['Masala Dosa', 'Chicken Biryani', 'Paneer Tikka', 'Margherita Pizza', 'Cold Coffee'].includes(item.name))
      .map((item) => item.id),
    orders: [
      makeOrder(1, 'received', firstOrderItems, 5),
      makeOrder(2, 'cancelled', secondOrderItems, 65),
      makeOrder(3, 'completed', thirdOrderItems, 140),
    ],
    history: [],
    nextOrderId: 4,
    nextUserId: 3,
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return buildInitialState()
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.menu) || !Array.isArray(parsed.orders)) {
      return buildInitialState()
    }
    return parsed
  } catch {
    return buildInitialState()
  }
}

const state = loadState()

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function itemByNameApprox(input) {
  const normalized = input.trim().toLowerCase()
  const exact = state.menu.find((item) => item.name.toLowerCase() === normalized)
  if (exact) return exact
  return state.menu.find((item) => normalized.includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(normalized))
}

function orderById(orderId) {
  return state.orders.find((order) => order.id === Number(orderId))
}

function recomputeOrder(order) {
  order.total_price = order.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  order.updated_at = nowIso()
}

function ensureOrder(orderId) {
  const existing = orderId ? orderById(orderId) : null
  if (existing) return existing

  const created = {
    id: state.nextOrderId++,
    user_id: 1,
    status: 'received',
    items: [],
    total_price: 0,
    created_at: nowIso(),
    updated_at: nowIso(),
  }
  state.orders.unshift(created)
  persistState()
  return created
}

function extractQuantity(text) {
  const digit = text.match(/\b(\d{1,2})\b/)
  if (digit) return Math.max(1, Math.min(20, Number(digit[1])))

  const lowered = text.toLowerCase()
  for (const [word, value] of Object.entries(QUANTITY_WORDS)) {
    if (lowered.includes(` ${word} `) || lowered.startsWith(`${word} `) || lowered.endsWith(` ${word}`)) {
      return value
    }
  }

  return 1
}

function detectIntent(text) {
  const lowered = text.toLowerCase()
  if (lowered.includes('replace ') && lowered.includes(' with ')) return 'REPLACE_ITEM'
  if (lowered.includes('cancel my order') || lowered.includes('cancel order')) return 'CANCEL_ORDER'
  if (lowered.includes('track') || lowered.includes('status')) return 'TRACK_ORDER'
  if (lowered.includes('show my cart') || lowered.includes('view order') || lowered.includes('show my order') || lowered.includes('what is in my order')) return 'VIEW_ORDER'
  if (lowered.includes('remove ') || lowered.includes('delete ') || lowered.includes('cancel the ')) return 'REMOVE_ITEM'
  if (lowered.includes('available') || lowered.startsWith('is ')) return 'CHECK_ITEM'
  return 'ADD_ITEM'
}

function chooseRecommendations(items = []) {
  const usedCategories = new Set(items.map((item) => item.category))
  const candidates = state.menu.filter((item) => item.available && !usedCategories.has(item.category))
  return candidates.slice(0, 3).map((item) => `${item.name} (Rs ${item.price})`)
}

function rejectWith(message, status = 400) {
  return Promise.reject({ response: { status, data: { detail: message } } })
}

export const authApi = {
  register: async (payload) => {
    await wait()
    const exists = state.users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())
    if (exists) return rejectWith('Email already registered', 409)

    const user = {
      id: state.nextUserId++,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role || 'customer',
    }
    state.users.push(user)
    persistState()
    return clone({ id: user.id, name: user.name, email: user.email, role: user.role })
  },

  login: async ({ email, password }) => {
    await wait()
    const user = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!user) return rejectWith('Invalid email or password', 401)

    return clone({
      access_token: `mock-token-${user.id}`,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  },
}

export const menuApi = {
  getAll: async () => {
    await wait()
    return clone(state.menu)
  },

  search: async (name = '') => {
    await wait()
    const q = name.trim().toLowerCase()
    return clone(state.menu.filter((item) => item.name.toLowerCase().includes(q)))
  },

  getByCategory: async (name = '') => {
    await wait()
    const normalized = name.trim().toLowerCase()
    return clone(state.menu.filter((item) => item.category.toLowerCase() === normalized))
  },

  getSpecials: async () => {
    await wait()
    return clone(state.menu.filter((item) => state.specials.includes(item.id)))
  },

  updateSpecials: async (items) => {
    await wait()
    const ids = Array.isArray(items) ? items : Array.isArray(items?.items) ? items.items : []
    state.specials = ids.map((id) => Number(id)).filter((id) => state.menu.some((item) => item.id === id))
    persistState()
    return clone({ ok: true, specials: state.menu.filter((item) => state.specials.includes(item.id)) })
  },
}

export const ordersApi = {
  create: async ({ user_id = 1 } = {}) => {
    await wait()
    const order = {
      id: state.nextOrderId++,
      user_id,
      status: 'received',
      items: [],
      total_price: 0,
      created_at: nowIso(),
      updated_at: nowIso(),
    }
    state.orders.unshift(order)
    persistState()
    return clone(order)
  },

  addItem: async ({ order_id, item_name, quantity = 1 }) => {
    await wait()
    const menuItem = itemByNameApprox(item_name || '')
    if (!menuItem) return rejectWith(`${item_name} is not on the menu.`)
    if (!menuItem.available) return rejectWith(`${menuItem.name} is currently unavailable.`)

    const order = ensureOrder(order_id)
    const existing = order.items.find((item) => item.id === menuItem.id)
    if (existing) {
      existing.qty += quantity
    } else {
      order.items.push({
        id: menuItem.id,
        name: menuItem.name,
        category: menuItem.category,
        price: menuItem.price,
        qty: quantity,
      })
    }
    recomputeOrder(order)
    persistState()
    return clone(order)
  },

  removeItem: async ({ order_id, item_name, quantity = 1 }) => {
    await wait()
    const order = orderById(order_id)
    if (!order) return rejectWith('Order not found', 404)

    const target = order.items.find((item) => item.name.toLowerCase().includes(String(item_name || '').toLowerCase()))
    if (!target) return rejectWith(`${item_name} is not in your order.`)

    target.qty -= quantity
    if (target.qty <= 0) {
      order.items = order.items.filter((item) => item.id !== target.id)
    }
    recomputeOrder(order)
    persistState()
    return clone(order)
  },

  track: async (orderId) => {
    await wait()
    const order = orderById(orderId)
    if (!order) return rejectWith('Order not found', 404)
    return clone(order)
  },

  cancel: async (orderId) => {
    await wait()
    const order = orderById(orderId)
    if (!order) return rejectWith('Order not found', 404)
    order.status = 'cancelled'
    order.updated_at = nowIso()
    persistState()
    return clone(order)
  },

  history: async (userId) => {
    await wait()
    return clone(state.history.filter((entry) => entry.user_id === Number(userId)))
  },

  getByStatus: async (status) => {
    await wait()
    return clone(
      state.orders
        .filter((order) => order.status === status)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    )
  },

  updateStatus: async (orderId, status) => {
    await wait()
    const order = orderById(orderId)
    if (!order) return rejectWith('Order not found', 404)
    order.status = status
    order.updated_at = nowIso()
    persistState()
    return clone(order)
  },
}

export const voiceApi = {
  process: async (transcript, orderId) => {
    await wait(120)

    const text = String(transcript || '').trim()
    if (!text) return rejectWith('Please say your order clearly.')

    const intent = detectIntent(text)
    const quantity = extractQuantity(text)

    if (intent === 'CHECK_ITEM') {
      const item = itemByNameApprox(text)
      if (!item) {
        return { intent, message: 'That item is not on the menu.', order_id: orderId || null }
      }
      if (!item.available) {
        return { intent, message: `${item.name} is currently unavailable.`, item: clone(item), order_id: orderId || null }
      }
      return { intent, message: `${item.name} is available for Rs ${item.price}.`, item: clone(item), order_id: orderId || null }
    }

    if (intent === 'VIEW_ORDER') {
      const order = orderById(orderId)
      if (!order || order.items.length === 0) {
        return { intent, message: 'Your cart is empty right now.', order_id: orderId || null }
      }
      const summary = order.items.map((i) => `${i.qty} x ${i.name}`).join(', ')
      return {
        intent,
        message: `Your order has ${summary}. Total is Rs ${order.total_price.toFixed(2)}.`,
        order: clone(order),
        order_id: order.id,
      }
    }

    if (intent === 'TRACK_ORDER') {
      const order = orderById(orderId)
      if (!order) {
        return { intent, message: 'No active order found to track.', order_id: orderId || null }
      }
      return { intent, message: `Your order status is ${order.status}.`, order: clone(order), order_id: order.id }
    }

    if (intent === 'CANCEL_ORDER') {
      const order = orderById(orderId)
      if (!order) {
        return { intent, message: 'No active order found to cancel.', order_id: orderId || null }
      }
      order.status = 'cancelled'
      order.updated_at = nowIso()
      persistState()
      return { intent, message: 'Your order has been cancelled.', order: clone(order), order_id: order.id }
    }

    if (intent === 'REPLACE_ITEM') {
      const match = text.match(/replace\s+(.+?)\s+with\s+(.+)/i)
      if (!match) {
        return { intent, message: 'Please say: replace item A with item B.', order_id: orderId || null }
      }

      const oldItem = itemByNameApprox(match[1])
      const newItem = itemByNameApprox(match[2])
      const order = orderById(orderId)
      if (!order) {
        return { intent, message: 'No active order found for replacement.', order_id: orderId || null }
      }

      if (!oldItem || !newItem) {
        return { intent, message: 'Could not identify one of the items to replace.', order_id: order.id }
      }

      const existing = order.items.find((item) => item.id === oldItem.id)
      if (!existing) {
        return { intent, message: `${oldItem.name} is not in your cart.`, order_id: order.id }
      }

      order.items = order.items.filter((item) => item.id !== oldItem.id)
      const added = order.items.find((item) => item.id === newItem.id)
      if (added) added.qty += quantity
      else {
        order.items.push({ id: newItem.id, name: newItem.name, category: newItem.category, price: newItem.price, qty: quantity })
      }

      recomputeOrder(order)
      persistState()
      return {
        intent,
        message: `Replaced ${oldItem.name} with ${newItem.name}.`,
        item: { id: newItem.id, name: newItem.name, price: newItem.price, qty: quantity },
        order: clone(order),
        order_id: order.id,
      }
    }

    if (intent === 'REMOVE_ITEM') {
      const order = orderById(orderId)
      if (!order) {
        return { intent, message: 'No active order found. Please add items first.', order_id: orderId || null }
      }

      const item = itemByNameApprox(text)
      if (!item) {
        return { intent, message: 'I could not identify which item to remove.', order_id: order.id }
      }

      const existing = order.items.find((entry) => entry.id === item.id)
      if (!existing) {
        return { intent, message: `${item.name} is not in your cart.`, order_id: order.id }
      }

      existing.qty -= quantity
      if (existing.qty <= 0) {
        order.items = order.items.filter((entry) => entry.id !== item.id)
      }
      recomputeOrder(order)
      persistState()

      return {
        intent,
        message: `Removed ${item.name} from your order.`,
        item: { id: item.id, name: item.name, price: item.price, qty: 1 },
        order: clone(order),
        order_id: order.id,
      }
    }

    const item = itemByNameApprox(text)
    if (!item) {
      return { intent: 'ADD_ITEM', message: 'That item is not on the menu.', order_id: orderId || null }
    }
    if (!item.available) {
      return {
        intent: 'ADD_ITEM',
        message: `${item.name} is currently unavailable.`,
        item: clone(item),
        order_id: orderId || null,
      }
    }

    const order = ensureOrder(orderId)
    const existing = order.items.find((entry) => entry.id === item.id)
    if (existing) existing.qty += quantity
    else {
      order.items.push({ id: item.id, name: item.name, category: item.category, price: item.price, qty: quantity })
    }

    recomputeOrder(order)
    persistState()

    return {
      intent: 'ADD_ITEM',
      message: `Added ${quantity} x ${item.name} to your order.`,
      item: { id: item.id, name: item.name, price: item.price, qty: quantity },
      order: clone(order),
      order_id: order.id,
    }
  },
}

const api = {
  post: async (url, payload) => {
    await wait(80)

    if (url === '/recommendations') {
      const recommendations = chooseRecommendations(payload?.items || [])
      return { data: { recommendations } }
    }

    if (url === '/voice/process') {
      const data = await voiceApi.process(payload?.transcript, payload?.order_id)
      return { data }
    }

    return rejectWith(`Unsupported mock route: POST ${url}`, 404)
  },
}

export default api
