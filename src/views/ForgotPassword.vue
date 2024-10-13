<script setup>
import { ref, computed, onBeforeMount, onBeforeUnmount } from "vue";
import { useStore } from "vuex";

import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonInput from "@/components/ArgonInput.vue";
// import ArgonSwitch from "@/components/ArgonSwitch.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonAlert from "@/components/ArgonAlert.vue"; // لإضافة تنبيه في حالة الخطأ

const store = useStore();
const email = ref(""); // البريد الإلكتروني المدخل
const showAlert = ref(false); // حالة التحكم في عرض التنبيه
const errorMessage = ref(""); // رسالة الخطأ التي ستظهر عند الفشل

const successMessage = ref(""); // رسالة النجا�� التي ست��هر عند التمام

const showSuccess = ref(false); // حالة التحكم في عرض النجا��


const body = document.getElementsByTagName("body")[0];

onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");

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

// دالة التحقق من البريد الإلكتروني وكلمة المرور
const sendResetPasswordEmail = async () => {
  try {
    // تحقق مما إذا كان البريد الإلكتروني موجودًا
    const emailExists = await store.dispatch("checkEmailExists", email.value);

    if (!emailExists) {
      if (store.getters.currentLanguage === "ar") {
        errorMessage.value =
          "هذا البريد الإلكتروني ليس مسجل . يرجى استخدام بريد مسجل بالفعل.";
      } else {
        errorMessage.value =
          "This email is not registered. Please use an already registered email.";
      }

      showAlert.value = true; // إظهار التنبيه

      // إخفاء التنبيه بعد 3 ثوانٍ
      setTimeout(() => {
        showAlert.value = false;
      }, 3000);
    } else {

const ids = computed(() => store.getters.userId);
console.log("User ID:", ids.value);


      if (store.getters.currentLanguage === "ar") {
        successMessage.value =
          "تم الارسال البريد الإلكتروني لاعادة تعيين كلمة المرور. الرجاء التحقق من بريدك الالكتروني.";
      } else {
        successMessage.value =
          "Password reset email has been sent. Please check your email.";
      }

      showSuccess.value = true; // إظهار التنبيه

      const userData = {
        email: email.value,
        email_id: ids.value
      };
      console.log(userData);
    await store.dispatch("sendResetPassword", userData);
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

const translations = {
  en: {
    signIn: "Sign In",
    enterEmailAndPassword: "Enter your email and password to sign in",
    enterEmail: "Enter your email",
    email: "Email",
    password: "Password",
    rememberMe: "Remember me",
    dontHaveAccount: "Don't have an account?",
    signUp: "Sign Up",
    attentionIsNewCurrency: '"Attention is the new currency"',
    effortlessWriting:
      "The more effortless the writing looks, the more effort the writer actually put into the process.",
    forgotPassword: "Forgot password",
    send: "send",
  },
  ar: {
    signIn: "تسجيل الدخول",
    enterEmailAndPassword: "أدخل بريدك الإلكتروني وكلمة المرور لتسجيل الدخول",
    enterEmail: "أدخل بريدك الإلكتروني",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    rememberMe: "تذكرني",
    dontHaveAccount: "ليس لديك حساب؟",
    signUp: "تسجيل",
    attentionIsNewCurrency: '"الانتباه هو العملة الجديدة"',
    effortlessWriting:
      "كلما بدت الكتابة أكثر سهولة، كلما بذل الكاتب مجهودًا أكبر في العملية.",
    forgotPassword: "نسيت كلمة المرور",
    send: "ارسال",
  },
};

const currentLanguage = computed(() => store.getters.currentLanguage);

const t = (key) => {
  return translations[currentLanguage.value][key];
};
</script>

<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          :darkMode="true"
          isBtn="bg-gradient-success"
        />
      </div>
    </div>
  </div>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <!-- قسم النموذج -->
            <div
              class="col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0 mx-auto"
              :class="currentLanguage === 'ar' ? 'order-2' : ''"
            >
              <div class="card card-plain">
                <div
                  class="pb-0 card-header"
                  :class="currentLanguage === 'ar' ? 'text-end' : 'text-start'"
                >
                  <h4 class="font-weight-bolder">{{ t("forgotPassword") }}</h4>
                  <p class="mb-0">{{ t("enterEmail") }}</p>
                </div>
                <div class="card-body">
                  <form role="form" @submit.prevent="sendResetPasswordEmail">
                    <div class="mb-3">
                      <argon-input
                        v-model="email"
                        id="email"
                        type="email"
                        :placeholder="t('email')"
                        name="email"
                        size="lg"
                      />
                    </div>
                    <!-- <argon-switch id="rememberMe" name="remember-me">
                      {{ t("rememberMe") }}
                    </argon-switch> -->
                    <argon-alert v-if="showAlert" color="danger">
                      {{ errorMessage }}
                    </argon-alert>
                    <argon-alert v-if="showSuccess" color="success">
                      {{ successMessage }}
                    </argon-alert>
                    <div class="text-center">
                      <argon-button
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                        >{{ t("send") }}</argon-button
                      >
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <!-- قسم الصورة والنص -->
          <div
            class="col-6 d-none d-lg-flex h-100 justify-content-center flex-column text-center my-auto top-0 position-absolute"
            :class="currentLanguage === 'ar' ? 'start-0 ps-0' : 'end-0 pe-0'"
          >
            <div
              class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
              style="
                background-image: url(&quot;https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg&quot;);
                background-size: cover;
              "
            >
              <span class="mask bg-gradient-success opacity-6"></span>
              <h4 class="mt-5 text-white font-weight-bolder position-relative">
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
    </section>
  </main>
</template>
