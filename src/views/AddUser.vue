<script setup>
import { ref, computed , onBeforeMount , onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonAlert from "@/components/ArgonAlert.vue";
import LanguageSwitcher from "@/views/components/LanguageSwitcher.vue";
const store = useStore();


// console.log("Company ID:", companyId.value);

const companyId = ref(localStorage.getItem("companyId"));


const email = ref(""); 
const showAlert = ref(false);
const errorMessage = ref(""); 
const successMessage = ref(""); 
const showSuccess = ref(false); 

const body = document.getElementsByTagName("body")[0];

onBeforeMount(() => {
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
    addMember: "Add Member",
    email: "Email",
    emailExistsError: "This email is already registered. Please use another email.",
    generalError: "An error occurred while submitting. Please try again later.",
  },
  ar: {
    addMember: "إضافة عضو",
    email: "البريد الإلكتروني",
    emailExistsError: "هذا البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد آخر.",
    generalError: "حدث خطأ أثناء التسجيل. حاول مرة أخرى لاحقًا.",
  },
};

const currentLanguage = computed(() => store.getters.currentLanguage);

const t = (key) => {
  return translations[currentLanguage.value][key];
};

// دالة إرسال البريد الإلكتروني إلى Vuex
const sendInvitation = async () => {
  try {
    // تحقق مما إذا كان البريد الإلكتروني موجودًا
    const emailExists = await store.dispatch("checkEmailExists", email.value);

    if (!emailExists) {
// const companyId = computed(() => store.getters.companyId);
console.log(companyId.value);

      if (store.getters.currentLanguage === "ar") {
        successMessage.value =
          "تم الارسال البريد الإلكتروني لاعادة تعيين كلمة المرور. الرجاء التحقق من بريدك الالكتروني.";
      } else {
        successMessage.value =
          "An email has been sent to reset your password. Please check your email.";
      }

      showSuccess.value = true; // إظهار التنبيه

      const userData = {
        email: email.value,
        email_id: companyId.value
      };
      console.log(userData);
    await store.dispatch("sendInvitation", userData);
    } else {

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
</script>

<template>
  <LanguageSwitcher />
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header pb-0">
            <div class="d-flex align-items-center">
              <p class="mb-0">{{ t("addMember") }}</p>
            </div>
          </div>
          <div class="card-body">
            <form @submit.prevent="sendInvitation">
              <div class="row">
                <div class="col-md-12">
                  <label for="email-input" class="form-control-label">{{ t("email") }}</label>
                  <argon-input
                    id="email-input"
                    type="email"
                    v-model="email"
                    :placeholder="t('email')"
                    required
                  />
                </div>
                <div class="col-md-4 d-flex align-items-end">
                  <argon-button type="submit" color="success" size="sm">
                    {{ t("addMember") }}
                  </argon-button>
                </div>
              </div>
              <argon-alert
                v-if="showAlert"
                color="danger"
                dismissible
                class="mt-3"
              >
                {{ errorMessage }}
              </argon-alert>
              <argon-alert
                v-if="showSuccess"
                color="success"
                dismissible
                class="mt-3"
              >
                {{ successMessage }}
              </argon-alert>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
