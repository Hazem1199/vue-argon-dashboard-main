<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import LanguageSwitcher from "@/views/components/LanguageSwitcher.vue";


defineProps({
  btnBackground: {
    type: String,
    default: "",
  },
  isBlur: {
    type: String,
    default: "",
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
  isBtn: { type: String, default: "bg-gradient-light" },
});

const store = useStore();

const translations = {
  en: {
    dashboard: "Dashboard",
    profile: "Profile",
    signUp: "Sign Up",
    signIn: "Sign In",
    freeDownload: "Free Download",
    start: "Start",
  },
  ar: {
    dashboard: "لوحة التحكم",
    profile: "الملف الشخصي",
    signUp: "تسجيل",
    signIn: "تسجيل الدخول",
    freeDownload: "تحميل مجاني",
    start: "ابدأ",
  },
};

const currentLanguage = computed(() => store.getters.currentLanguage);

const t = (key) => {
  return translations[currentLanguage.value][key];
};
</script>

<template>
  
  <!-- Navbar -->
  <nav
    class="navbar navbar-expand-lg top-0 z-index-3 position-absolute mt-4"
    :class="isBlur ? isBlur : 'shadow-none my-2 navbar-transparent w-100'"
  >
    <div class="container ps-2 pe-0">
      <router-link
        class="navbar-brand font-weight-bolder ms-lg-0 ms-3"
        :class="darkMode ? 'text-black' : 'text-white'"
        to="/"
        >Argon Dashboard 2</router-link
      >
      <button
        class="shadow-none navbar-toggler ms-2"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navigation"
        aria-controls="navigation"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="mt-2 navbar-toggler-icon">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </span>
      </button>
      <div class="collapse navbar-collapse" id="navigation">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <router-link
              class="nav-link d-flex align-items-center me-2 active"
              aria-current="page"
              to="/dashboard-default"
            >
              <i
                class="fa fa-chart-pie opacity-6 me-1"
                aria-hidden="true"
                :class="isBlur ? 'text-dark' : 'text-white'"
              ></i>
              {{ t('dashboard') }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link me-2" to="/profile">
              <i
                class="fa fa-user opacity-6 me-1"
                aria-hidden="true"
                :class="isBlur ? 'text-dark' : 'text-white'"
              ></i>
              {{ t('profile') }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link me-2" to="/signup">
              <i
                class="fas fa-user-circle opacity-6 me-1"
                aria-hidden="true"
                :class="isBlur ? 'text-dark' : 'text-white'"
              ></i>
              {{ t('signUp') }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link me-2" to="/signin">
              <i
                class="fas fa-key opacity-6 me-1"
                aria-hidden="true"
                :class="isBlur ? 'text-dark' : 'text-white'"
              ></i>
              {{ t('signIn') }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link me-2" to="/start">
              <i
                class="fas fa-home opacity-6 me-1"
                aria-hidden="true"
                :class="isBlur ? 'text-dark' : 'text-white'"
              ></i>
              {{ t('start') }}
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav d-lg-block d-none align-items-center">
          <!-- تبديل اللغة -->
          <li class="nav-item">
            <LanguageSwitcher />
          </li>
          <!-- التحميل -->
          <li class="nav-item ms-3">
            <a
              href="https://www.creative-tim.com/product/vue-argon-dashboard"
              class="btn btn-sm mb-0 me-1"
              :class="isBtn"
              >{{ t('freeDownload') }}</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <!-- End Navbar -->
</template>
