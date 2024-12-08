export default function({store, redirect, route}) {
  // Если пользователь не авторизован и пытается зайти на защищенную страницу
  if (!store.getters['auth/isAuthenticated']) {
    // Если это не страница логина, редиректим на логин
    if (route.path !== '/login') {
      redirect('/login')
    }
  } else if (route.path === '/login') {
    // Если пользователь авторизован и пытается зайти на страницу логина,
    // редиректим на главную
    redirect('/')
  }
}
