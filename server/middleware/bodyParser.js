const bodyParser = require('body-parser')

// Создаем middleware для парсинга JSON
const jsonParser = bodyParser.json()

// Оборачиваем middleware в промис для использования с async/await
const parseBody = (req, res) => {
  return new Promise((resolve, reject) => {
    jsonParser(req, res, (err) => {
      if (err) {
        console.error('Error parsing body:', err)
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

// Экспортируем middleware
module.exports = async function(req, res, next) {
  // Пропускаем не-POST запросы
  if (req.method !== 'POST') {
    return next()
  }

  try {
    // Парсим тело запроса
    await parseBody(req, res)
    next()
  } catch (error) {
    // В случае ошибки отправляем 400 Bad Request
    console.error('Body parsing error:', error)
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Invalid request body' }))
  }
}
