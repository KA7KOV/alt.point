<!-- 
  Компонент навигационной панели
  Отображает меню навигации и кнопки входа/выхода
  Адаптируется под роль пользователя
-->
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <!-- Логотип и название -->
      <a class="navbar-brand" href="/">
        Alt.Point
      </a>

      <!-- Кнопка мобильного меню -->
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Основное меню -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <!-- Пункты меню для авторизованных пользователей -->
          <li class="nav-item">
            <nuxt-link exact no-prefetch active-class="active" class="nav-link" to="/">
              Home
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link active-class="active" class="nav-link" to="/products">
              Items
            </nuxt-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <nuxt-link active-class="active" class="nav-link" to="/users">
              Users
            </nuxt-link>
          </li>
        </ul>

        <!-- Блок авторизации -->
        <ul class="navbar-nav">
          <li class="nav-item" v-if="!isAuthenticated">
            <nuxt-link active-class="active" class="nav-link" to="/login">
              Login
            </nuxt-link>
          </li>
          <template v-else>
            <!-- Информация о пользователе -->
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/profile">
                {{ currentUser.name }} ({{ currentUser.role }})
              </nuxt-link>
            </li>
            <!-- Кнопка выхода -->
            <li class="nav-item">
              <a @click.prevent="logout" class="nav-link" href="#" role="button">
                Logout
              </a>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    // Проверяет, авторизован ли пользователь
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated']
    },

    // Получает данные текущего пользователя
    currentUser() {
      return this.$store.getters['auth/user']
    },

    // Проверяет, является ли пользователь админом
    isAdmin() {
      return this.$store.getters['auth/userRole'] === 'admin'
    }
  },

  methods: {
    // Обработчик выхода из системы
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.nav-link {
  cursor: pointer;
}
</style>
