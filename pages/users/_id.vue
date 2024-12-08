<template>
  <div class="container mt-4">
    <div v-if="user" class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h2 class="mb-0">Редактирование пользователя</h2>
        <button class="btn btn-secondary" @click="$router.push('/users')">
          Назад к списку
        </button>
      </div>
      <div class="card-body">
        <form @submit.prevent="saveUser">
          <div class="mb-3">
            <label class="form-label">Имя</label>
            <input 
              v-model="editedUser.name" 
              class="form-control"
              required
            >
          </div>

          <div class="mb-3">
            <label class="form-label">Username</label>
            <input 
              v-model="editedUser.username" 
              class="form-control"
              required
            >
          </div>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input 
              v-model="editedUser.email" 
              type="email"
              class="form-control"
              required
            >
          </div>

          <div class="mb-3">
            <label class="form-label">Телефон</label>
            <input 
              v-model="editedUser.phone" 
              class="form-control"
            >
          </div>

          <div class="mb-3">
            <label class="form-label">Веб-сайт</label>
            <input 
              v-model="editedUser.website" 
              class="form-control"
            >
          </div>

          <div class="mb-3">
            <label class="form-label">Роль</label>
            <select 
              v-model="editedUser.role"
              class="form-select"
              required
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary">
              Сохранить
            </button>
            <button type="button" class="btn btn-outline-secondary" @click="resetForm">
              Сбросить
            </button>
          </div>
        </form>
      </div>
    </div>
    <div v-else class="alert alert-danger">
      Пользователь не найден
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['auth', 'admin'],
  
  data() {
    return {
      editedUser: null
    }
  },

  computed: {
    user() {
      return this.$store.getters['users/getUserById'](this.$route.params.id)
    }
  },

  watch: {
    user: {
      immediate: true,
      handler(newUser) {
        if (newUser) {
          this.editedUser = { ...newUser }
        }
      }
    }
  },

  methods: {
    async saveUser() {
      try {
        await this.$store.dispatch('users/updateUser', this.editedUser)
        this.$router.push('/users')
      } catch (error) {
        console.error('Error saving user:', error)
      }
    },

    resetForm() {
      if (this.user) {
        this.editedUser = { ...this.user }
      }
    }
  }
}
</script>
