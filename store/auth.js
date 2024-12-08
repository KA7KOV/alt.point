// Импортируем моковые данные пользователей
import mockUsers from '@/static/mock-users.json'

// Начальное состояние store
export const state = () => ({
  user: null // Текущий авторизованный пользователь
})

// Мутации для изменения состояния
export const mutations = {
  // Устанавливает данные пользователя
  setUser(state, user) {
    state.user = user
  },
  
  // Очищает данные пользователя при выходе
  clearUser(state) {
    state.user = null
  }
}

// Actions для асинхронных операций
export const actions = {
  // Авторизация пользователя
  async login({ commit }, { username, password }) {
    try {
      // Ищем пользователя в mock данных
      const user = mockUsers.users.find(u => u.username === username)
      
      // Проверяем учетные данные
      if (!user || password !== '123456') {
        throw new Error('Invalid credentials')
      }

      // Сохраняем пользователя в store
      commit('setUser', user)
      return user
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  // Выход из системы
  async logout({ commit }) {
    commit('clearUser')
  },

  // Инициализация состояния авторизации
  async init({ commit }) {
    try {
      // Проверяем, что мы на клиенте и localStorage доступен
      if (process.client && window.localStorage) {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          const user = JSON.parse(savedUser)
          // Проверяем, что пользователь существует в mock данных
          const validUser = mockUsers.users.find(u => u.id === user.id)
          if (validUser) {
            commit('setUser', validUser)
          } else {
            // Если пользователь не найден, очищаем localStorage
            localStorage.removeItem('user')
          }
        }
      }
    } catch (error) {
      console.error('Init error:', error)
      if (process.client && window.localStorage) {
        localStorage.removeItem('user')
      }
    }
  }
}

// Геттеры для получения данных из store
export const getters = {
  // Проверяет, авторизован ли пользователь
  isAuthenticated: state => !!state.user,
  
  // Возвращает данные текущего пользователя
  user: state => state.user,
  
  // Возвращает роль текущего пользователя
  userRole: state => state.user ? state.user.role : null
}
