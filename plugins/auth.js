export default function ({ store, redirect }) {
  // Инициализируем состояние авторизации при запуске приложения
  store.dispatch('auth/init')

  // Добавляем слушатель для сохранения пользователя в localStorage
  if (process.client && window.localStorage) {
    // При изменении пользователя
    store.subscribe((mutation, state) => {
      if (mutation.type === 'auth/setUser' && state.auth.user) {
        // Проверяем наличие необходимых полей
        const user = state.auth.user
        if (!user.id || !user.username || !user.role) {
          console.error('Invalid user data:', user)
          store.commit('auth/clearUser')
          localStorage.removeItem('user')
          return
        }

        // Сохраняем только необходимые поля
        const userData = {
          id: parseInt(user.id, 10),
          username: user.username,
          name: user.name || '',
          email: user.email || '',
          role: user.role,
          phone: user.phone || '',
          website: user.website || ''
        }

        localStorage.setItem('user', JSON.stringify(userData))
      }
      if (mutation.type === 'auth/clearUser') {
        localStorage.removeItem('user')
      }
    })

    // При изменении пользователей
    store.subscribe((mutation, state) => {
      if (mutation.type === 'users/updateUser') {
        const updatedUser = mutation.payload
        const currentUser = state.auth.user

        // Если обновился текущий пользователь, обновляем auth store
        if (currentUser && currentUser.id === updatedUser.id) {
          store.commit('auth/setUser', updatedUser)
        }
      }
    })
  }
}
