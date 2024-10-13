<script setup>
import { ref, computed, onBeforeMount, onBeforeUnmount } from "vue";
import { useStore } from "vuex"; // استدعاء Vuex
import { useRouter } from "vue-router"; // استدعاء Vue Router

import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonCheckbox from "@/components/ArgonCheckbox.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonAlert from "@/components/ArgonAlert.vue";

const store = useStore();
const router = useRouter(); // لإنشاء التوجيه

const email = ref(""); // متغير لتخزين البريد الإلكتروني المدخل
const body = document.getElementsByTagName("body")[0];
const errorMessage = ref(""); // لتخزين رسالة الخطأ
const showAlert = ref(false); // حالة التحكم في عرض التنبيه

// إضافة البريد الإلكتروني في Vuex وإرسال الطلب
const submitForm = async () => {
  try {
    // تحقق مما إذا كان البريد الإلكتروني موجودًا
    const emailExists = await store.dispatch("checkEmailExists", email.value);

    if (emailExists) {
      if (store.getters.currentLanguage === "ar") {
        errorMessage.value =
          "هذا البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد آخر.";
      } else {
        errorMessage.value =
          "This email is already registered. Please use another email.";
      }

      showAlert.value = true; // إظهار التنبيه

      // إخفاء التنبيه بعد 3 ثوانٍ
      setTimeout(() => {
        showAlert.value = false;
      }, 3000);
    } else {
      // إذا لم يكن البريد الإلكتروني موجودًا، تابع التسجيل
      await store.dispatch("submitEmail", email.value);
      router.push("/signup");
      showAlert.value = false;
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    errorMessage.value = "حدث خطأ أثناء التسجيل. حاول مرة أخرى لاحقًا.";
    showAlert.value = true;

    // إخفاء التنبيه بعد 3 ثوانٍ
    setTimeout(() => {
      showAlert.value = false;
    }, 3000);
  }
};

onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");

  // تحديث اتجاه النص واللغة عند تحميل المكون
  const isRTL = store.getters.currentLanguage === "ar";
  document
    .querySelector("html")
    .setAttribute("lang", store.getters.currentLanguage);
  document.querySelector("html").setAttribute("dir", isRTL ? "rtl" : "ltr");
  document.querySelector("#app").classList.toggle("rtl", isRTL);
});

onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});

// تعريف الترجمات داخل المكون
const translations = {
  en: {
    myTask: "My Task",
    newOrganization: "New Organization",
    enterDetails: "Enter your new company workspace details",
    email: "Email",
    agreeTerms: "I agree to the Terms and Conditions",
    getStarted: "Get Started",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign In",
    attentionIsNewCurrency: '"Attention is the new currency"',
    effortlessWriting:
      "The more effortless the writing looks, the more effort the writer actually put into the process.",
    errorMessage: errorMessage.value,
  },
  ar: {
    myTask: "مهمتي",
    newOrganization: "منظمة جديدة",
    enterDetails: "أدخل تفاصيل مساحة عمل شركتك الجديدة",
    email: "البريد الإلكتروني",
    agreeTerms: "أوافق على الشروط والأحكام",
    getStarted: "البدء",
    alreadyHaveAccount: "هل لديك حساب بالفعل؟",
    signIn: "تسجيل الدخول",
    attentionIsNewCurrency: '"الانتباه هو العملة الجديدة"',
    effortlessWriting:
      "كلما بدت الكتابة أكثر سهولة، كلما بذل الكاتب مجهودًا أكبر في العملية.",
    errorMessage: errorMessage.value,
  },
};

const currentLanguage = computed(() => store.getters.currentLanguage);

const t = (key) => {
  return translations[currentLanguage.value][key];
};
</script>

<template>
  <div class="container position-sticky top-0 z-index-sticky">
    <div class="row">
      <div class="col-12">
        <!-- Navbar مع زر تبديل اللغة -->
        <navbar
          isBlur="blur border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          :darkMode="true"
          isBtn="bg-gradient-success"
        />
      </div>
    </div>
  </div>
  <main class="main-content mt-0">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <!-- قسم النموذج -->
            <div class="col-xl-4 col-lg-5 col-md-7 d-flex flex-column">
              <div class="card card-plain">
                <div class="card-header text-start pb-0">
                  <h1 class="text-dark mb-2 mt-5">{{ t("myTask") }}</h1>
                  <h3>{{ t("newOrganization") }}</h3>
                  <p class="mb-0">
                    {{ t("enterDetails") }}
                  </p>
                </div>
                <div class="card-body">
                  <form role="form" @submit.prevent="submitForm">
                    <argon-input
                      id="email"
                      type="email"
                      v-model="email"
                      :placeholder="t('email')"
                      :aria-label="t('email')"
                    />
                    <!-- <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p> -->
                    <argon-alert
                      id="alert"
                      v-if="showAlert"
                      color="danger"
                      dismissible
                    >
                      {{ errorMessage }}
                    </argon-alert>
                    <argon-checkbox checked>
                      <label class="form-check-label" for="flexCheckDefault">
                        {{ t("agreeTerms") }}
                      </label>
                    </argon-checkbox>
                    <div class="text-center">
                      <argon-button
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                        >{{ t("getStarted") }}</argon-button
                      >
                    </div>
                  </form>
                </div>
                <div class="card-footer text-center px-lg-2 pt-0 px-1">
                  <p class="mb-4 text-sm mx-auto">
                    {{ t("alreadyHaveAccount") }}
                    <a
                      href="javascript:;"
                      class="text-success text-gradient font-weight-bold"
                      >{{ t("signIn") }}</a
                    >
                  </p>
                </div>
              </div>
            </div>
            <!-- قسم الصورة والنص -->
            <div
              class="col-6 d-none d-lg-flex h-100"
              :class="currentLanguage === 'ar' ? 'ps-0 start-0' : 'pe-0 end-0'"
              style="position: absolute; top: 0"
            >
              <div
                class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden bg-gradient-primary"
                style="
                  background-image: url(&quot;https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg&quot;);
                  background-size: cover;
                "
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4
                  class="mt-5 text-white font-weight-bolder position-relative"
                >
                  {{ t("attentionIsNewCurrency") }}
                </h4>
                <p class="text-white position-relative">
                  {{ t("effortlessWriting") }}
                </p>
              </div>
            </div>
            <!-- نهاية قسم الصورة والنص -->
          </div>
        </div>
      </div>
    </section>
  </main>
  <app-footer />
</template>
