export default function({ store, redirect }) {
  // Проверяем, авторизован ли пользователь и является ли он админом
  if (!store.getters['auth/isAuthenticated'] || 
      store.getters['auth/userRole'] !== 'admin') {
    return redirect('/')
  }
}
