<script setup>
import { ref, computed, onBeforeMount, onBeforeUnmount, watch , onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router"; // استدعاء Vue Router

// import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonSelect from "@/components/ArgonSelect.vue";
import ArgonCheckbox from "@/components/ArgonCheckbox.vue";
import ArgonButton from "@/components/ArgonButton.vue";

const store = useStore();
const router = useRouter(); // لإنشاء التوجيه
const userId = computed(() => store.getters.userId);
const dataFromApi = computed(() => store.state.dataFromApi);

const email = computed(() => store.getters.email);

// تعريف المتغيرات لتخزين القيم المدخلة
const name = ref("");
const companyName = ref("");
const password = ref("");
const passwordValid = ref(false); // للتحقق من صحة كلمة المرور
const showPassword = ref(false); // للتحكم في إظهار كلمة المرور

// دالة التحقق من قوة كلمة المرور
const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// مراقبة إدخال كلمة المرور والتحقق منها
watch(password, (newPassword) => {
  passwordValid.value = validatePassword(newPassword);
});

// إرسال البيانات عند الضغط على الزر
const submitForm = async () => {
  if (!passwordValid.value) {
    console.error("Password does not meet the requirements");
    return;
  }

  try {
    const formData = {
      name: name.value,
      companyname: companyName.value,
      password: password.value,
      companySize: selectedCompanySize.value,
      industry: selectedIndustry.value,
    };

    if (userId.value) {
      await store.dispatch("updateUserData", { userId: userId.value, formData });
      router.push("/signin");
    } else {
      console.error("No user ID found");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};

// جلب بيانات المستخدم
onMounted(() => {
  console.log("User ID:", userId.value);
  if (userId.value) {
    store.dispatch("fetchDataFromApi", userId.value);
  }
});

console.log(dataFromApi.value);

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
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});

// تعريف الترجمات داخل المكون
const translations = {
  en: {
    name: "User Name *",
    myTask: "My Task",
    newOrganization: "New Organization",
    enterDetails: "Enter your new company workspace details",
    companyName: "Company Name *",
    email: "Email",
    password: "Password *",
    repeatPassword: "Repeat Password",
    phone: "Phone",
    companySize: "Company Size",
    industry: "Industry",
    agreeTerms: "I agree to the Terms and Conditions",
    signUp: "Sign Up",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign In",
    attentionIsNewCurrency: '"Attention is the new currency"',
    effortlessWriting:
      "The more effortless the writing looks, the more effort the writer actually put into the process.",
    finance: "Finance",
    manufacturing: "Manufacturing",
    retail: "Retail",
    other: "Other",
    passwordRequirements: "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character.",
    passwordValid: "Password is valid ✅",
  },
  ar: {
    name: "*أسم المستخدم",
    myTask: "مهمتي",
    newOrganization: "منظمة جديدة",
    enterDetails: "أدخل تفاصيل مساحة عمل شركتك الجديدة",
    companyName: "*اسم الشركة",
    email: "البريد الإلكتروني",
    password: "*كلمة المرور",
    repeatPassword: "تأكيد كلمة المرور",
    phone: "الهاتف",
    companySize: "حجم الشركة",
    industry: "الصناعة",
    agreeTerms: "أوافق على الشروط والأحكام",
    signUp: "تسجيل",
    alreadyHaveAccount: "هل لديك حساب بالفعل؟",
    signIn: "تسجيل الدخول",
    attentionIsNewCurrency: '"الانتباه هو العملة الجديدة"',
    effortlessWriting:
      "كلما بدت الكتابة أكثر سهولة، كلما بذل الكاتب مجهودًا أكبر في العملية.",
    finance: "المالية",
    manufacturing: "التصنيع",
    retail: "التجزئة",
    other: "أخرى",
    passwordRequirements: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل، وتشمل حرفًا كبيرًا، حرفًا صغيرًا، رقمًا، وحرفًا خاصًا.",
    passwordValid: "كلمة المرور مطابقة للشروط ✅",
  },
};

const currentLanguage = computed(() => store.getters.currentLanguage);

const t = (key) => {
  return translations[currentLanguage.value][key];
};

// تعريف المتغيرات والخيارات للـ `<argon-select>`
const selectedCompanySize = ref("");
const companySizeOptions = [
  { value: "1", label: "1-10" },
  { value: "2", label: "11-50" },
  { value: "3", label: "51-100" },
  { value: "4", label: "101-500" },
];

const selectedIndustry = ref("");
const industryOptions = computed(() => [
  { value: "1", label: t("finance") },
  { value: "2", label: t("manufacturing") },
  { value: "3", label: t("retail") },
  { value: "4", label: t("other") },
]);
</script>

<template>
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
                  <p class="mb-0">{{ t("enterDetails") }}</p>
                </div>
                <div class="card-body">
                  <form role="form" @submit.prevent="submitForm">
                    <argon-input
                      id="name"
                      type="text"
                      :placeholder="t('name')"
                      :aria-label="t('name')"
                      v-model="name"
                    />
                    <argon-input
                      id="companyName"
                      type="text"
                      :placeholder="t('companyName')"
                      :aria-label="t('companyName')"
                      v-model="companyName"
                    />
                    <argon-input
                      id="email"
                      class="email"
                      type="email"
                      :placeholder="t('email')"
                      :aria-label="t('email')"
                      v-model="email"
                    />
                    <div class="position-relative mb-3">
                      <div class="position-relative">
                        <argon-input
                        id="password"
                        :type="showPassword ? 'text' : 'password'"
                        :placeholder="t('password')"
                        :aria-label="t('password')"
                        v-model="password"
                      />
                      <span
                        @click="showPassword = !showPassword"
                        class="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer"
                      >
                        <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                      </span>
                      </div>
                      <p v-if="passwordValid" class="text-success mt-2">
                        {{ t("passwordValid") }}
                      </p>
                      <p v-if="!passwordValid" class="text-danger mt-2">
                        {{ t("passwordRequirements") }}
                      </p>
                    </div>
                    <!-- <argon-input
                      id="repeat-password"
                      type="password"
                      :placeholder="t('repeatPassword')"
                      :aria-label="t('repeatPassword')"
                      v-model="repeatPassword"
                    /> -->
                    <!-- استخدام الـ argon-select للـ Company Size -->
                    <argon-select
                      id="company-size"
                      v-model="selectedCompanySize"
                      :options="companySizeOptions"
                      :placeholder="t('companySize')"
                      :aria-label="t('companySize')"
                    />
                    <!-- استخدام الـ argon-select للـ Industry -->
                    <argon-select
                      id="industry"
                      v-model="selectedIndustry"
                      :options="industryOptions"
                      :placeholder="t('industry')"
                      :aria-label="t('industry')"
                    />
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
                        :disabled="!passwordValid || companyName === ''"
                      >{{ t("signUp") }}</argon-button>
                    </div>
                  </form>
                </div>
                <div class="card-footer text-center px-lg-2 pt-0 px-1">
                  <p class="mb-4 text-sm mx-auto">
                    {{ t("alreadyHaveAccount") }}
                    <a href="javascript:;" class="text-success text-gradient font-weight-bold">{{ t("signIn") }}</a>
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
                style="background-image: url(&quot;https://ik.imagekit.io/ts7pphpbz3/Gemini.jpg?updatedAt=1726592261487&quot;); background-size: cover;"
              >
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
      </div>
    </section>
  </main>
  <app-footer />
</template>

<style>
.email {
  pointer-events: none;
}
</style>
