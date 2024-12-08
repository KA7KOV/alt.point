<template>
  <div class="profile-page">
    <div class="container py-5">
      <div class="row">
        <div class="col-lg-8 mx-auto">
          <div class="profile-card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h2 class="mb-0">Профиль пользователя</h2>
              <button v-if="!isEditing" class="btn btn-primary" @click="startEdit">
                Редактировать
              </button>
            </div>
            <div class="card-body">
              <div v-if="!isEditing" class="profile-info">
                <div class="info-item">
                  <i class="fas fa-user"></i>
                  <div class="info-content">
                    <label>Полное имя:</label>
                    <p>{{ currentUser.name }}</p>
                  </div>
                </div>

                <div class="info-item">
                  <i class="fas fa-at"></i>
                  <div class="info-content">
                    <label>Имя пользователя:</label>
                    <p>{{ currentUser.username }}</p>
                  </div>
                </div>

                <div class="info-item">
                  <i class="fas fa-envelope"></i>
                  <div class="info-content">
                    <label>Email:</label>
                    <p>{{ currentUser.email }}</p>
                  </div>
                </div>

                <div class="info-item">
                  <i class="fas fa-phone"></i>
                  <div class="info-content">
                    <label>Телефон:</label>
                    <p>{{ currentUser.phone }}</p>
                  </div>
                </div>

                <div class="info-item">
                  <i class="fas fa-globe"></i>
                  <div class="info-content">
                    <label>Веб-сайт:</label>
                    <p>{{ currentUser.website }}</p>
                  </div>
                </div>

                <div class="info-item">
                  <i class="fas fa-user-tag"></i>
                  <div class="info-content">
                    <label>Роль:</label>
                    <p>{{ currentUser.role }}</p>
                  </div>
                </div>
              </div>

              <div v-else class="edit-form">
                <form @submit.prevent="saveProfile">
                  <div class="form-group mb-3">
                    <label>Полное имя:</label>
                    <input type="text" class="form-control" v-model="editedUser.name" required>
                  </div>

                  <div class="form-group mb-3">
                    <label>Email:</label>
                    <input type="text" class="form-control" v-model="editedUser.email" required>
                  </div>

                  <div class="form-group mb-3">
                    <label>Телефон:</label>
                    <input type="text" class="form-control" v-model="editedUser.phone">
                  </div>

                  <div class="form-group mb-3">
                    <label>Веб-сайт:</label>
                    <input type="text" class="form-control" v-model="editedUser.website">
                  </div>

                  <div class="buttons mt-4">
                    <button type="submit" class="btn btn-primary me-2">Сохранить</button>
                    <button type="button" class="btn btn-secondary" @click="cancelEdit">Отмена</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',
  middleware: ['auth'],
  data() {
    return {
      isEditing: false,
      editedUser: null
    }
  },
  computed: {
    currentUser() {
      const user = this.$store.getters['auth/user']
      console.log('Current user from auth store:', user)
      return user
    }
  },
  methods: {
    startEdit() {
      const user = this.currentUser
      console.log('Starting edit with user:', user)
      
      if (!user || !user.id) {
        console.error('Invalid user data:', user)
        this.$router.push('/login')
        return
      }

      // Создаем копию пользователя для редактирования
      this.editedUser = {
        id: parseInt(user.id, 10),
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        website: user.website || '',
        username: user.username,
        role: user.role
      }
      
      console.log('Created edited user:', this.editedUser)
      this.isEditing = true
    },
    async saveProfile() {
      try {
        console.log('Current user:', this.currentUser)
        console.log('Edited user:', this.editedUser)

        if (!this.editedUser || !this.editedUser.id) {
          throw new Error('No user data to save')
        }

        // Проверяем обязательные поля
        if (!this.editedUser.name || !this.editedUser.email) {
          alert('Заполните обязательные поля')
          return
        }

        // Создаем объект для обновления
        const updatedUser = {
          id: this.editedUser.id,
          name: this.editedUser.name.trim(),
          email: this.editedUser.email.trim(),
          phone: (this.editedUser.phone || '').trim(),
          website: (this.editedUser.website || '').trim(),
          username: this.currentUser.username,
          role: this.currentUser.role
        }

        console.log('Sending update:', updatedUser)

        // Обновляем пользователя в users store
        await this.$store.dispatch('users/updateUser', updatedUser)
        
        // Обновляем текущего пользователя в auth store
        this.$store.commit('auth/setUser', updatedUser)
        
        this.isEditing = false
        this.editedUser = null
      } catch (error) {
        console.error('Error updating profile:', error)
        alert('Ошибка при сохранении профиля: ' + error.message)
      }
    },
    cancelEdit() {
      this.isEditing = false
      this.editedUser = null
    }
  },
  // Загружаем список пользователей при монтировании компонента
  async mounted() {
    await this.$store.dispatch('users/fetch')
  }
}
</script>

<style scoped>
.profile-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-body {
  padding: 1.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.info-item i {
  width: 24px;
  margin-right: 1rem;
  color: #4a5568;
}

.info-content label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.25rem;
  display: block;
}

.info-content p {
  margin: 0;
  color: #2d3748;
}

.edit-form {
  max-width: 500px;
}

.form-group label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.buttons {
  display: flex;
  gap: 1rem;
}
</style>
