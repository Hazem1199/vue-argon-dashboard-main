<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{ title }}</h5>
        <button type="button" class="btn-close" @click="closeModal">×</button>
      </div>
      <div class="modal-body">
        <slot></slot> <!-- هنا يتم تخصيص محتوى الـ modal -->
      </div>
      <div class="modal-footer">
        <!-- <button type="button" class="btn btn-secondary" @click="closeModal">Close</button> -->
        <slot name="footer"></slot> <!-- تخصيص محتوى الفوتر -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Modal Title',
  },
  modelValue: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['close', 'update:modelValue']);

const isOpen = ref(!props.modelValue);
console.log(isOpen.value);

const closeModal = () => {
  isOpen.value = false;
  emit('update:modelValue', false); // لإغلاق الـ modal
  emit('close'); // إطلاق الحدث 'close'
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin-top: 10px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
