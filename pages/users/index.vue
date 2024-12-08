<template>
  <div class="container mt-4">
    <h1 class="mb-4">Пользователи</h1>

    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Username</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="badge" :class="getRoleBadgeClass(user.role)">
                {{ user.role }}
              </span>
            </td>
            <td>
              <button 
                class="btn btn-primary btn-sm"
                @click="$router.push('/users/' + user.id)"
              >
                Редактировать
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['auth', 'admin'],
  
  async fetch({store}) {
    if (store.getters['users/users'].length === 0) {
      await store.dispatch('users/fetch')
    }
  },

  computed: {
    users() {
      return this.$store.getters['users/users']
    }
  },

  methods: {
    getRoleBadgeClass(role) {
      const classes = {
        admin: 'bg-danger',
        manager: 'bg-warning',
        user: 'bg-info'
      }
      return classes[role] || 'bg-secondary'
    }
  }
}
</script>

<style scoped>
.badge {
  padding: 0.5em 0.75em;
}
</style>
