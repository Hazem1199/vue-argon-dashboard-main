<script setup>
import { ref, computed, onBeforeMount, onBeforeUnmount, watch } from "vue";
import { useStore } from "vuex";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonAlert from "@/components/ArgonAlert.vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import LanguageSwitcher from "@/views/components/LanguageSwitcher.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();

// المتغيرات المحلية
const id = ref(
  route.query.id ? Number(atob(decodeURIComponent(route.query.id))) : 0
);
const email = ref("");
const name = ref("");
const password = ref("");
const role = ref(1);
const passwordValid = ref(false);
const showPassword = ref(false);
const showAlert = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const showSuccess = ref(false);
const body = document.getElementsByTagName("body")[0];

// تحميل الأدوار من Vuex عند تحميل المكون
onBeforeMount(async () => {
  await store.dispatch("fetchRoles"); // جلب الأدوار من Vuex
  body.classList.remove("bg-gray-100");
  const isRTL = store.getters.currentLanguage === "ar";
  document
    .querySelector("html")
    .setAttribute("lang", store.getters.currentLanguage);
  document.querySelector("html").setAttribute("dir", isRTL ? "rtl" : "ltr");
  document.querySelector("#app").classList.toggle("rtl", isRTL);
});

// إعادة إعدادات الصفحة عند إلغاء تحميل المكون
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});

// تعريف الترجمات داخل المكون
const translations = {
  en: {
    updateMember: "Add Your Information",
    name: "Name",
    email: "Email",
    password: "Password",
    generalError: "An error occurred while submitting. Please try again later.",
    successUpdate: "User data has been successfully updated.",
    passwordValid: "Password is valid ✅",
    passwordRequirements:
      "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character.",
    emailExists: "This email is already registered. Please use another email.",
  },

  ar: {
    updateMember: "أضف بياناتك",
    name: "الاسم",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    generalError: "حدث خطأ أثناء التحديث. حاول مرة أخرى لاحقًا.",
    successUpdate: "تم تحديث بيانات المستخدم بنجاح.",
    passwordValid: "كلمة المرور مطابقة للشروط ✅",
    passwordRequirements:
      "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل، وتشمل حرفًا كبيرًا، وحرفًا صغيرًا، ورقمًا، وحرفًا خاصًا.",
    emailExists: "هذا البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد آخر.",
  },
};

// Getter لجلب الأدوار من Vuex
// const roles = computed(() => store.getters.roles);

// دالة للتحقق من كلمة المرور
const validatePassword = (password) => {
  const regex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

watch(password, (newPassword) => {
  passwordValid.value = validatePassword(newPassword);
});

const currentLanguage = computed(() => store.getters.currentLanguage);

const t = (key) => {
  return translations[currentLanguage.value][key];
};

// دالة لتحديث بيانات المستخدم
const submitForm = async () => {
  if (!passwordValid.value) {
    errorMessage.value = t("passwordRequirements");
    showAlert.value = true;
    setTimeout(() => {
      showAlert.value = false;
    }, 3000);
    return;
  }

  try {
    const emailExists = await store.dispatch("checkEmailExists", email.value);
    if (emailExists) {
      errorMessage.value = t("emailExists");
      showAlert.value = true;
      setTimeout(() => {
        showAlert.value = false;
      }, 3000);
      return;
    }

    const formData = {
      email: email.value,
      name: name.value,
      password: password.value,
      companyId: id.value,
      roleId: role.value, // هنا نضيف الـ roleId لإرساله للـ backend
    };

    await store.dispatch("addUserInfo", formData);

    successMessage.value = t("successUpdate");
    showSuccess.value = true;

    setTimeout(() => {
      showSuccess.value = false;
      router.push("/signin");
    }, 3000);
  } catch (error) {
    console.error("Error updating user data:", error);
    errorMessage.value = t("generalError");
    showAlert.value = true;
    setTimeout(() => {
      showAlert.value = false;
    }, 3000);
  }
};
</script>

<template>
  <LanguageSwitcher class="my-2 mx-2" />
  <div class="py-4 my-6 container-fluid">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card">
          <div class="card-header pb-0">
            <div class="d-flex align-items-center">
              <p class="mb-0">{{ t("updateMember") }}</p>
            </div>
          </div>
          <div class="card-body">
            <form @submit.prevent="submitForm">
              <div class="row">
                <div class="col-md-6">
                  <label for="name-input" class="form-control-label">{{
                    t("name")
                  }}</label>
                  <argon-input
                    id="name-input"
                    type="text"
                    v-model="name"
                    :placeholder="t('name')"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label for="email-input" class="form-control-label">{{
                    t("email")
                  }}</label>
                  <argon-input
                    id="email-input"
                    type="email"
                    v-model="email"
                    :placeholder="t('email')"
                    required
                  />
                </div>
                <div class="mb-3 position-relative">
                  <div class="position-relative">
                    <argon-input
                      v-model="password"
                      id="password"
                      :type="showPassword ? 'text' : 'password'"
                      :placeholder="t('password')"
                      name="password"
                      size="lg"
                    />
                    <span
                      @click="showPassword = !showPassword"
                      class="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer"
                    >
                      <i
                        :class="
                          showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'
                        "
                      ></i>
                    </span>
                  </div>
                  <p v-if="passwordValid" class="text-success mt-2">
                    {{ t("passwordValid") }}
                  </p>
                  <p v-if="!passwordValid" class="text-danger mt-2">
                    {{ t("passwordRequirements") }}
                  </p>
                </div>
                <!-- <div class="col-md-6">
                    <label for="role-select" class="form-control-label">Role</label>
                    <select id="role-select" v-model="role" class="form-control" required>
                      <option value="" disabled>Select a role</option>
                      <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }}</option>
                    </select>
                  </div> -->
                <div
                  class="col-md-12 d-flex justify-content-center align-items-end mt-3"
                >
                  <argon-button type="submit" color="success" size="sm">{{
                    t("updateMember")
                  }}</argon-button>
                </div>
              </div>
              <argon-alert
                v-if="showAlert"
                color="danger"
                dismissible
                class="mt-3"
                >{{ errorMessage }}</argon-alert
              >
              <argon-alert
                v-if="showSuccess"
                color="success"
                dismissible
                class="mt-3"
                >{{ successMessage }}</argon-alert
              >
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
