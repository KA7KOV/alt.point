// Импортируем модули для работы с файловой системой
const fs = require('fs').promises
const path = require('path')

// Путь к файлу с данными о товарах
const PRODUCTS_FILE = path.join(process.cwd(), 'static', 'stationery.json')

/**
 * Читает данные о товарах из JSON файла
 * @returns {Promise<Object>} Объект с массивом товаров
 */
async function readProducts() {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading products:', error)
    return { items: [] }
  }
}

/**
 * Записывает данные о товарах в JSON файл
 * @param {Array} products Массив товаров для сохранения
 * @returns {Promise<boolean>} Успешность операции
 */
async function writeProducts(products) {
  try {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify({ items: products }, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error writing products:', error)
    return false
  }
}

/**
 * Обработчик API запросов для управления товарами
 * Поддерживает методы:
 * - GET: получение списка товаров
 * - POST: обновление списка товаров
 */
module.exports = async function (req, res) {
  // Устанавливаем тип контента как JSON
  res.setHeader('Content-Type', 'application/json')

  try {
    // Проверяем существование файла
    try {
      await fs.access(PRODUCTS_FILE)
    } catch (error) {
      // Если файл не существует, создаем его с пустым массивом
      await writeProducts([])
    }

    // Обработка GET запроса
    if (req.method === 'GET') {
      const data = await readProducts()
      res.end(JSON.stringify(data))
    } 
    // Обработка POST запроса
    else if (req.method === 'POST') {
      // Получаем данные из тела запроса
      const products = req.body

      // Проверяем, что данные являются массивом
      if (!Array.isArray(products)) {
        res.statusCode = 400
        res.end(JSON.stringify({ error: 'Products must be an array' }))
        return
      }

      // Проверяем формат каждого товара
      const isValidProduct = (product) => {
        return product 
          && typeof product.id === 'number'
          && typeof product.name === 'string'
          && typeof product.price === 'number'
      }

      // Если формат данных неверный, возвращаем ошибку
      if (!products.every(isValidProduct)) {
        res.statusCode = 400
        res.end(JSON.stringify({ error: 'Invalid product format' }))
        return
      }

      // Сохраняем продукты
      const success = await writeProducts(products)
      
      if (success) {
        // Если сохранение успешно, возвращаем успех
        res.statusCode = 200
        res.end(JSON.stringify({ success: true }))
      } else {
        // Если произошла ошибка при сохранении, возвращаем ошибку
        res.statusCode = 500
        res.end(JSON.stringify({ error: 'Failed to save products' }))
      }
    } 
    // Если метод не поддерживается
    else {
      res.statusCode = 405
      res.end(JSON.stringify({ error: 'Method not allowed' }))
    }
  } catch (error) {
    // Логируем ошибку и возвращаем 500
    console.error('Products API error:', error)
    res.statusCode = 500
    res.end(JSON.stringify({ error: 'Server error' }))
  }
}
