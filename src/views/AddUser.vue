<script setup>
import { ref, computed, onBeforeMount, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonAlert from "@/components/ArgonAlert.vue";
import LanguageSwitcher from "@/views/components/LanguageSwitcher.vue";
const store = useStore();

// console.log("Company ID:", companyId.value);



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
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});

onBeforeUnmount(() => {
  // store.state.hideConfigButton = false;
  // store.state.showNavbar = true;
  // store.state.showSidenav = true;
  // store.state.showFooter = true;
  // body.classList.add("bg-gray-100");
});

// تعريف الترجمات داخل المكون
const translations = {
  en: {
    addMember: "Add Member",
    email: "Email",
    emailExistsError:
      "This email is already registered. Please use another email.",
    generalError: "An error occurred while submitting. Please try again later.",
    invalidCompanyIdOrUserId: "Invalid Company ID or User ID.",
    invitationSent: "Invitation sent successfully.",
  },
  ar: {
    addMember: "إضافة عضو",
    email: "البريد الإلكتروني",
    emailExistsError:
      "هذا البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد آخر.",
    generalError: "حدث خطأ أثناء التسجيل. حاول مرة أخرى لاحقًا.",
    invalidCompanyIdOrUserId: "معرف الشركة او المستخدم غير صحيح.",
    invitationSent: "تم ارسال الدعوة بنجاح.",
  },
};

const currentLanguage = computed(() => store.getters.currentLanguage);

const t = (key) => {
  return translations[currentLanguage.value][key];
};

const companyIdRef = computed(() => store.getters.companyId);
const userIdRef = computed(() => store.getters.userId);

const sendInvitation = async () => {
  const companyId = companyIdRef.value;
  const userId = userIdRef.value;
  console.log("companyId:", companyId, "userId:", userId);


  try {
    const emailExists = await store.dispatch("checkEmailExists", email.value);

    if (emailExists) {
      showAlert.value = true;
      errorMessage.value = t("emailExistsError");

      setTimeout(() => {
        showAlert.value = false;
      }, 3000);

      return;
    }

    const userData = {
      email: email.value,
      emailId: companyId ?? userId,
    };

    await store.dispatch("sendInvitation", userData);

    showSuccess.value = true;
    successMessage.value = t("invitationSent");
  } catch (error) {
    console.error("Error submitting form:", error);
    showAlert.value = true;
    errorMessage.value = t("generalError");

    setTimeout(() => {
      showAlert.value = false;
    }, 3000);
  }
};

// إضافة المراقبة للتأكد من تحميل `companyId` و`userId`
// watch([companyId, userId], ([newCompanyId, newUserId]) => {
//   console.log("Updated companyId:", newCompanyId);
//   console.log("Updated userId:", newUserId);
// });
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
            <form @submit.prevent>
              <div class="row">
                <div class="col-md-12">
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
                  <argon-button class="mt-4 col-md-3 mx-auto" type="submit" color="success" size="sm" @click="sendInvitation">
                    {{ t("addMember") }}
                  </argon-button>
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

