<!-- 
  Компонент страницы авторизации
  Позволяет пользователю войти в систему, используя имя пользователя и пароль
  После успешной авторизации перенаправляет на главную страницу
-->
<template>
  <section>
    <!-- Форма авторизации -->
    <div v-if="error" class="alert alert-danger mb-3">
      {{ error }}
    </div>
    <form @submit.prevent="onSubmit">
      <h1>Login page</h1>
      <!-- Поле для имени пользователя -->
      <div class="form-group mb-3">
        <label for="username" class="form-label">Username</label>
        <input 
          type="text" 
          class="form-control" 
          id="username"
          v-model="form.username"
          required
        >
        <small class="form-text text-muted">
          admin/manager/user
        </small>
      </div>

      <!-- Поле для пароля -->
      <div class="form-group mb-3">
        <label for="password" class="form-label">Password</label>
        <input 
          type="password" 
          class="form-control" 
          id="password"
          v-model="form.password"
          required
        >
        <small class="form-text text-muted">
          123456
        </small>
      </div>

      <!-- Кнопка входа -->
      <div class="d-flex justify-content-between align-items-center">
        <button 
          class="btn btn-primary" 
          type="submit"
          :disabled="loading"
        >
          {{ loading ? 'Loading...' : 'Login' }}
        </button>
        <nuxt-link to="/" class="text-decoration-none">To home page</nuxt-link>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  layout: 'empty',
  // Имя компонента для отладки
  name: 'LoginPage',

  // Локальное состояние компонента
  data() {
    return {
      form: {
        username: '', // Имя пользователя
        password: '' // Пароль
      },
      loading: false,
      error: null   // Сообщение об ошибке
    }
  },

  methods: {
    // Обработчик отправки формы авторизации
    async onSubmit() {
      try {
        // Очищаем предыдущие ошибки
        this.error = null
        this.loading = true

        // Пытаемся авторизоваться через Vuex action
        await this.$store.dispatch('auth/login', this.form)

        // После успешной авторизации перенаправляем на главную
        this.$router.push('/')
      } catch (error) {
        // В случае ошибки показываем сообщение
        this.error = 'Неверное имя пользователя или пароль'
        console.error('Login error:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
form {
  width: 500px;
  margin: 0 auto;
  padding: 20px;
}
</style>
