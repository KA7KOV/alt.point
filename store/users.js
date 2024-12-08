import mockUsers from '@/static/mock-users.json'

export const state = () => ({
  users: []
})

export const mutations = {
  setUsers(state, users) {
    state.users = users
  },
  updateUser(state, updatedUser) {
    const index = state.users.findIndex(user => user.id === updatedUser.id)
    if (index !== -1) {
      state.users.splice(index, 1, updatedUser)
    }
  }
}

export const actions = {
  async fetch({ commit }) {
    console.log('Fetching users from mock data')
    commit('setUsers', mockUsers.users)
  },
  
  async updateUser({ commit, state }, userData) {
    try {
      console.log('Raw user data:', userData)

      // Проверяем наличие ID
      if (!userData || !userData.id) {
        console.error('Invalid user data:', userData)
        throw new Error('User ID is required')
      }

      // Находим существующего пользователя
      const existingUser = state.users.find(user => user.id === userData.id)
      if (!existingUser) {
        console.error('User not found:', userData.id)
        throw new Error('User not found')
      }

      console.log('Existing user:', existingUser)

      // Создаем объект с обновленными данными
      const updatedUser = {
        ...existingUser,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || existingUser.phone,
        website: userData.website || existingUser.website
      }

      console.log('Sending to API:', updatedUser)

      // Обновляем JSON файл через API
      const response = await this.$axios.$post('/api/userProfile', updatedUser)
      console.log('API response:', response)

      if (!response || !response.success) {
        throw new Error(response?.error || 'Failed to update user')
      }

      // Обновляем пользователя в store
      commit('updateUser', updatedUser)

      return updatedUser
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }
}

export const getters = {
  users: state => state.users,
  getUserById: (state) => (id) => {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id
    return state.users.find(user => user.id === numId)
  },
  getUserByRole: (state) => (role) => {
    return state.users.filter(user => user.role === role)
  }
}
