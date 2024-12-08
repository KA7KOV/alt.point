<template>
  <div class="product-edit-modal">
    <div class="modal-backdrop" @click="$emit('close')"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ product.id ? 'Редактировать товар' : 'Добавить товар' }}</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>
      <form @submit.prevent="saveProduct" class="edit-form">
        <div class="form-group">
          <label>Название:</label>
          <input 
            type="text" 
            v-model="editedProduct.name" 
            required
            class="form-control"
          >
        </div>
        <div class="form-group">
          <label>Цена:</label>
          <input 
            type="number" 
            v-model="editedProduct.price" 
            required
            step="0.01"
            min="0"
            class="form-control"
          >
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Отмена</button>
          <button type="submit" class="btn btn-primary">Сохранить</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductEdit',
  props: {
    product: {
      type: Object,
      default: () => ({
        id: null,
        name: '',
        price: 0
      })
    }
  },
  data() {
    return {
      editedProduct: { ...this.product }
    }
  },
  methods: {
    saveProduct() {
      const productData = {
        ...this.editedProduct,
        price: Number(this.editedProduct.price)
      }
      this.$emit('save', productData)
    }
  }
}
</script>

<style scoped>
.product-edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  z-index: 1001;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}
</style>
