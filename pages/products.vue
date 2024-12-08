<!-- 
  Компонент страницы управления товарами
  Позволяет просматривать, добавлять, редактировать и удалять канцелярские товары
  Доступ к редактированию имеют только пользователи с ролями admin и manager
-->
<template>
  <div class="products-page">
    <!-- Заголовок страницы и кнопка добавления -->
    <div class="page-header">
      <h1 class="page-title">Канцелярские товары</h1>
      <button v-if="canEdit" class="btn btn-add" @click="addProduct">
        Добавить товар
      </button>
    </div>

    <!-- Сетка товаров -->
    <div class="products-grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :canEdit="canEdit"
        class="product-item"
        @edit="editProduct"
        @delete="deleteProduct"
      />
    </div>

    <!-- Модальное окно редактирования -->
    <ProductEdit
      v-if="showEditModal"
      :product="editingProduct"
      @save="saveProduct"
      @close="closeEditModal"
    />
  </div>
</template>

<script>
import ProductCard from '~/components/ProductCard.vue'
import ProductEdit from '~/components/ProductEdit.vue'

export default {
  name: 'ProductsPage',
  
  // Регистрируем используемые компоненты
  components: {
    ProductCard,
    ProductEdit
  },

  // Локальное состояние компонента
  data() {
    return {
      showEditModal: false,  // Флаг отображения модального окна
      editingProduct: null   // Редактируемый товар
    }
  },

  // Загрузка данных при инициализации страницы
  async asyncData({ $axios }) {
    try {
      const { items } = await $axios.$get('/api/products')
      return { products: items }
    } catch (error) {
      console.error('Error loading products:', error)
      return { products: [] }
    }
  },

  // Вычисляемые свойства
  computed: {
    // Получаем текущего пользователя из store
    currentUser() {
      return this.$store.getters['auth/user']
    },
    
    // Проверяем права на редактирование
    canEdit() {
      const role = this.$store.getters['auth/userRole']
      return ['admin', 'manager'].includes(role)
    }
  },

  methods: {
    // Открывает модальное окно для добавления нового товара
    addProduct() {
      const maxId = Math.max(...this.products.map(p => p.id), 0)
      this.editingProduct = {
        id: maxId + 1,
        name: '',
        price: 0
      }
      this.showEditModal = true
    },

    // Открывает модальное окно для редактирования товара
    editProduct(product) {
      this.editingProduct = { ...product }
      this.showEditModal = true
    },

    // Сохраняет новый или обновленный товар
    async saveProduct(product) {
      try {
        if (!this.canEdit) {
          this.$router.push('/login')
          return
        }

        // Проверяем и форматируем данные продукта
        const productData = {
          id: parseInt(product.id, 10),
          name: product.name.trim(),
          price: parseFloat(product.price)
        }

        // Проверяем обязательные поля
        if (!productData.name || isNaN(productData.price)) {
          throw new Error('Заполните все обязательные поля')
        }

        // Обновляем локальный массив продуктов
        const index = this.products.findIndex(p => p.id === productData.id)
        const updatedProducts = index === -1 ? 
          [...this.products, productData] : 
          this.products.map(p => p.id === productData.id ? productData : p)
        
        // Отправляем обновленный список на сервер
        await this.$axios.$post('/api/products', updatedProducts)
        
        // Обновляем состояние после успешного сохранения
        this.products = updatedProducts
        this.closeEditModal()
      } catch (error) {
        console.error('Error saving product:', error)
        alert(error.message || 'Ошибка при сохранении товара')
      }
    },

    // Удаляет товар
    async deleteProduct(productId) {
      try {
        if (!this.canEdit) {
          this.$router.push('/login')
          return
        }

        if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
          return
        }

        // Удаляем продукт из локального массива
        const updatedProducts = this.products.filter(p => p.id !== productId)
        
        // Отправляем обновленный список на сервер
        await this.$axios.$post('/api/products', updatedProducts)
        
        // Обновляем состояние после успешного удаления
        this.products = updatedProducts
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Ошибка при удалении товара')
      }
    },

    // Закрывает модальное окно редактирования
    closeEditModal() {
      this.showEditModal = false
      this.editingProduct = null
    }
  }
}
</script>

<style scoped>
/* Стили компонента */
.products-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.btn-add {
  padding: 0.5rem 1rem;
  background-color: #48bb78;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.btn-add:hover {
  background-color: #38a169;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.product-item {
  height: 100%;
}

@media (max-width: 640px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .products-page {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
