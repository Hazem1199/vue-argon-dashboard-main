<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const sidebarMinimize = () => store.commit("sidebarMinimize");

const minimizeSidebar = () => {
  if (window.innerWidth < 1200) {
    sidebarMinimize();
  }
};

// حالة التحكم في إظهار القائمة المنسدلة
const showDropdown = ref(false);

defineProps({
  to: {
    type: String,
    required: true,
  },
  navText: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="dropdown">
    <router-link :to="to" class="nav-link" @click="minimizeSidebar">
      <div
        class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center"
      >
        <slot name="icon"></slot>
      </div>
      <span class="nav-link-text" :class="isRTL ? ' me-1' : 'ms-1'">{{ navText }}</span>
      <button 
        @click.stop="showDropdown = !showDropdown" 
        class="dropdown-toggle" 
        :class="showDropdown ? 'show' : ''"
      >
        ▼
      </button>
    </router-link>
    <div v-if="showDropdown" class="dropdown-menu" :class="{ show: showDropdown }">
      <router-link to="/option1" class="dropdown-item">Option 1</router-link>
      <router-link to="/option2" class="dropdown-item">Option 2</router-link>
      <router-link to="/option3" class="dropdown-item">Option 3</router-link>
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-toggle {
  border: none;
  background: transparent;
  font-size: 1.2rem;
  transition: transform 0.2s ease;
}

.dropdown-toggle.show {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease, visibility 0.25s ease;
  visibility: hidden;
}

.dropdown-menu.show {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
}

.dropdown-item {
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
  display: block;
  transition: background-color 0.25s, color 0.25s;
}

.dropdown-item:hover {
  background-color: #f1f1f1;
}
</style>
