// Импортируем модули для работы с файловой системой
const fs = require('fs').promises
const path = require('path')

// Путь к файлу с данными пользователей
const USERS_FILE = path.join(process.cwd(), 'static', 'mock-users.json')

/**
 * Читает данные пользователей из JSON файла
 * @returns {Promise<Object>} Объект с массивом пользователей
 */
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading users:', error)
    return { users: [] }
  }
}

/**
 * Записывает данные пользователей в JSON файл
 * @param {Array} users Массив пользователей для сохранения
 * @returns {Promise<boolean>} Успешность операции
 */
async function writeUsers(users) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify({ users }, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error writing users:', error)
    return false
  }
}

/**
 * Проверяет, что объект пользователя содержит все необходимые поля
 * и они имеют правильный тип данных
 * @param {Object} user Объект пользователя для проверки
 * @returns {boolean} Результат проверки
 */
function isValidUser(user) {
  return user &&
    typeof user.id === 'number' &&
    typeof user.username === 'string' &&
    typeof user.role === 'string' &&
    ['admin', 'manager', 'user'].includes(user.role)
}

/**
 * Обработчик API запросов для управления пользователями
 * Поддерживает методы:
 * - GET: получение списка пользователей или конкретного пользователя
 * - PUT: обновление данных пользователя
 */
module.exports = async function (req, res) {
  // Устанавливаем тип контента как JSON
  res.setHeader('Content-Type', 'application/json')

  try {
    // Получаем текущие данные пользователей
    const { users } = await readUsers()

    // Обработка GET запроса
    if (req.method === 'GET') {
      // Если указан ID пользователя в URL
      const userId = parseInt(req.url.split('/').pop())
      if (!isNaN(userId)) {
        // Ищем пользователя по ID
        const user = users.find(u => u.id === userId)
        if (user) {
          res.end(JSON.stringify(user))
        } else {
          res.statusCode = 404
          res.end(JSON.stringify({ error: 'User not found' }))
        }
      } else {
        // Возвращаем список всех пользователей
        res.end(JSON.stringify({ users }))
      }
    }
    // Обработка PUT запроса
    else if (req.method === 'PUT') {
      const userId = parseInt(req.url.split('/').pop())
      if (isNaN(userId)) {
        res.statusCode = 400
        res.end(JSON.stringify({ error: 'Invalid user ID' }))
        return
      }

      // Получаем данные из тела запроса
      const userData = req.body

      // Проверяем существование пользователя
      const userIndex = users.findIndex(u => u.id === userId)
      if (userIndex === -1) {
        res.statusCode = 404
        res.end(JSON.stringify({ error: 'User not found' }))
        return
      }

      // Защищаем неизменяемые поля
      const currentUser = users[userIndex]
      const updatedUser = {
        ...currentUser,
        ...userData,
        // Защищаем критические поля от изменения
        id: currentUser.id,
        username: currentUser.username,
        role: currentUser.role
      }

      // Проверяем валидность данных
      if (!isValidUser(updatedUser)) {
        res.statusCode = 400
        res.end(JSON.stringify({ error: 'Invalid user data' }))
        return
      }

      // Обновляем пользователя в массиве
      users[userIndex] = updatedUser

      // Сохраняем обновленные данные
      const success = await writeUsers(users)
      
      if (success) {
        res.end(JSON.stringify(updatedUser))
      } else {
        res.statusCode = 500
        res.end(JSON.stringify({ error: 'Failed to save user data' }))
      }
    }
    // Если метод не поддерживается
    else {
      res.statusCode = 405
      res.end(JSON.stringify({ error: 'Method not allowed' }))
    }
  } catch (error) {
    // Логируем ошибку и возвращаем 500
    console.error('Users API error:', error)
    res.statusCode = 500
    res.end(JSON.stringify({ error: 'Server error' }))
  }
}
