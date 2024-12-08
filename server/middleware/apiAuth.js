/**
 * Middleware для проверки аутентификации API запросов
 * Проверяет наличие пользователя в сессии или запросе и его права доступа
 * для определенных эндпоинтов
 */
const apiAuthMiddleware = function (req, res, next) {
  // Пропускаем GET запросы
  if (req.method === 'GET') {
    return next()
  }

  // Получаем пользователя из сессии или запроса
  const user = req.session?.user || req.user

  // Проверяем авторизацию для POST запросов к API products
  if (req.url.startsWith('/api/products')) {
    const isAuthorized = user && ['admin', 'manager'].includes(user.role)

    if (!isAuthorized) {
      res.statusCode = 403
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Unauthorized: Insufficient permissions' }))
      return
    }
  }

  // Проверяем авторизацию для updateUser API
  if (req.url.startsWith('/api/updateUser')) {
    if (!user) {
      res.statusCode = 401
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Unauthorized: Please log in' }))
      return
    }

    // Проверяем, что пользователь обновляет свой профиль или является админом
    const userData = req.body
    const isAuthorized = user.role === 'admin' || user.id === userData.id

    if (!isAuthorized) {
      res.statusCode = 403
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Unauthorized: Can only update own profile' }))
      return
    }
  }

  next()
}

module.exports = apiAuthMiddleware
