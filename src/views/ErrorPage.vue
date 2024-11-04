<template>
  <div class="error-page">
    <h1>{{ errorMessage }}</h1>
    <p>{{ accessDeniedMessage }}</p>
    <router-link to="/dashboard-default" class="home-link">{{ goHomeMessage }}</router-link>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
const store = useStore();

const errorMessage = computed(() => store.getters.currentLanguage === "ar" ? "خطأ" : "Error");
const accessDeniedMessage = computed(() => store.getters.currentLanguage === "ar" ? "الوصول لهذه الصفحة غير مسموح." : "Access to this page is denied.");
const goHomeMessage = computed(() => store.getters.currentLanguage === "ar" ? "العودة إلى الصفحة الرئيسية" : "Go to Home Page");
</script>

<style scoped>
.error-page {
  text-align: center;
  padding: 50px;
}

.error-page h1 {
  font-size: 2.5em;
  color: #ff4d4f;
  margin-bottom: 20px;
}

.error-page p {
  font-size: 1.2em;
  color: #555;
  margin-bottom: 30px;
}

.home-link {
  font-size: 1.1em;
  color: #3498db;
  text-decoration: underline;
}

.home-link:hover {
  color: #2980b9;
}
</style>

