<template>
  <button @click="toggleLanguage" class="btn btn-outline-primary btn-sm mb-0">
    {{ currentLanguage === 'ar' ? 'English' : 'العربية' }}
  </button>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'LanguageSwitcher',
  setup() {
    const store = useStore();

    const currentLanguage = computed(() => store.getters.currentLanguage);

    const toggleLanguage = () => {
      const newLanguage = currentLanguage.value === 'ar' ? 'en' : 'ar';
      store.dispatch('changeLanguage', newLanguage);

      // تحديث اتجاه النص واللغة
      const isRTL = newLanguage === 'ar';
      document.querySelector('html').setAttribute('lang', newLanguage);
      document.querySelector('html').setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      document.querySelector('#app').classList.toggle('rtl', isRTL);
    };

    return {
      currentLanguage,
      toggleLanguage,
    };
  },
};
</script>
