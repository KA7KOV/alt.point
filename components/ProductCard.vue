<template>
  <div class="product-card">
    <h3 class="product-title">{{ product.name }}</h3>
    <div class="product-price">{{ formatPrice(product.price) }} ₽</div>
    <div v-if="canEdit" class="product-actions">
      <button class="btn btn-edit" @click="$emit('edit', product)">
        Редактировать
      </button>
      <button class="btn btn-delete" @click="$emit('delete', product.id)">
        Удалить
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    formatPrice(price) {
      const numPrice = Number(price)
      return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00'
    }
  }
}
</script>

<style scoped>
.product-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  background: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.product-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.product-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #4a5568;
  margin-bottom: 1rem;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.btn-edit {
  background-color: #4299e1;
  color: white;
}

.btn-edit:hover {
  background-color: #3182ce;
}

.btn-delete {
  background-color: #f56565;
  color: white;
}

.btn-delete:hover {
  background-color: #e53e3e;
}
</style>
