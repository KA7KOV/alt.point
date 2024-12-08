const fs = require('fs').promises
const path = require('path')

export default async function userProfileHandler(req, res) {
  // Проверяем метод запроса
  if (req.method !== 'POST') {
    console.error('Invalid request method:', req.method)
    res.writeHead(405, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  try {
    // Получаем и проверяем тело запроса
    let userData = {}
    
    try {
      // Если тело запроса уже является объектом, используем его
      if (typeof req.body === 'object' && req.body !== null) {
        userData = req.body
      } else {
        // Иначе пытаемся распарсить JSON
        userData = JSON.parse(req.body)
      }
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid request body' }))
      return
    }

    // Проверяем обязательные поля
    if (!userData.id || !userData.name || !userData.email) {
      console.error('Missing required fields:', userData)
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Missing required fields' }))
      return
    }

    // Путь к файлу с пользователями
    const filePath = path.join(process.cwd(), 'static', 'mock-users.json')

    // Проверяем существование файла
    try {
      await fs.access(filePath)
    } catch (error) {
      console.error('Users file not found:', error)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Users file not found' }))
      return
    }

    // Читаем текущих пользователей
    let usersData
    try {
      const fileContent = await fs.readFile(filePath, 'utf8')
      usersData = JSON.parse(fileContent)
    } catch (error) {
      console.error('Error reading users file:', error)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Error reading users data' }))
      return
    }

    // Находим пользователя для обновления
    const userIndex = usersData.users.findIndex(user => user.id === userData.id)
    
    if (userIndex === -1) {
      console.error('User not found:', userData.id)
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'User not found' }))
      return
    }

    // Сохраняем неизменяемые поля
    const immutableFields = {
      id: usersData.users[userIndex].id,
      username: usersData.users[userIndex].username,
      role: usersData.users[userIndex].role
    }

    // Обновляем пользователя
    usersData.users[userIndex] = {
      ...immutableFields,
      name: userData.name.trim(),
      email: userData.email.trim(),
      phone: (userData.phone || '').trim(),
      website: (userData.website || '').trim()
    }

    // Сохраняем обновленные данные
    try {
      await fs.writeFile(filePath, JSON.stringify(usersData, null, 2))
    } catch (error) {
      console.error('Error writing users file:', error)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Error saving user data' }))
      return
    }

    // Отправляем успешный ответ
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ 
      success: true, 
      user: usersData.users[userIndex]
    }))

  } catch (error) {
    console.error('Unexpected error:', error)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Internal server error' }))
  }
}
