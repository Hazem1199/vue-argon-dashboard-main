<script setup>
import { ref, computed, onBeforeMount, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonAlert from "@/components/ArgonAlert.vue";
import LanguageSwitcher from "@/views/components/LanguageSwitcher.vue";

const store = useStore();

// المدخلات
const roleName = ref(""); // تغيرنا من email إلى roleName لإدخال اسم الدور
const showAlert = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const showSuccess = ref(false);
const showAccordion = ref(false); // التحكم في عرض الأذونات
const selectedPermissions = ref([]); // لتخزين الأذونات المختارة
const permissionsList = ref([]); // لتخزين قائمة الـ keys فقط للأذونات

// قائمة الحقول المستثناة
const excludedFields = ["createdAt", "updatedAt", "rols" , "id"];

const companyId = computed(() => store.getters.companyId);
const userId = computed(() => store.getters.userId);



// الترجمة
const translations = {
  en: {
    addRole: "Add Role",
    role: "Role",
    addPermission: "Add Permissions",
    emailExistsError:
      "This email is already registered. Please use another email.",
    generalError: "An error occurred while submitting. Please try again later.",
    permissionAdded: "Permission added successfully.",
    submit: "Submit",
    savePermissions: "Save Permissions",
    roleSaved: "Role and permissions saved successfully!",
  },
  ar: {
    addRole: "إضافة الأدوار",
    role: "الدور",
    addPermission: "إضافة أذونات",
    emailExistsError:
      "هذا البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد آخر.",
    generalError: "حدث خطأ أثناء التسجيل. حاول مرة أخرى لاحقًا.",
    permissionAdded: "تمت إضافة الأذونات بنجاح.",
    submit: "إرسال",
    savePermissions: "حفظ الأذونات",
    roleSaved: "تم حفظ الدور والأذونات بنجاح!",
  },
};

// التحقق من اللغة الحالية
const currentLanguage = computed(() => store.getters.currentLanguage);

// دالة الترجمة
const t = (key) => {
  return translations[currentLanguage.value][key];
};

// تفعيل الأكورديون للأذونات
const toggleAccordion = () => {
  showAccordion.value = !showAccordion.value;
};

// دالة جلب الأذونات من الـ API
const fetchPermissions = async () => {
  try {
    const response = await store.dispatch("fetchPermissions"); // جلب الأذونات من Vuex
    const uniquePermissions = new Set();
    console.log("response", response);

    // استخراج الـ keys فقط مع استثناء الحقول المحددة
    response.forEach((perm) => {
      Object.keys(perm)
        .filter((key) => !excludedFields.includes(key)) // استثناء الحقول المحددة
        .forEach((key) => uniquePermissions.add(key));
    });

    permissionsList.value = [...uniquePermissions]; // تخزين الـ keys بعد الفلترة
  } catch (error) {
    console.error("Error fetching permissions:", error);
    errorMessage.value = t("generalError");
    showAlert.value = true;
  }
};


const submitRoleAndPermissions = async () => {
  try {
    // 1. بناء كائن الصلاحيات على هيئة key-value مع الـ boolean values
    const permissionsObject = {};
    permissionsList.value.forEach((permission) => {
      permissionsObject[permission] = selectedPermissions.value.includes(permission);
    });

    // 2. إرسال الصلاحيات المختارة إلى API لجلب الـ IDs الخاصة بها
    const permissionsData = {
      ...permissionsObject, // إرسال كل الصلاحيات كـ boolean
    };

    // استدعاء الدالة الخاصة بإضافة الصلاحيات
    const savedPermissionsResponse = await store.dispatch("addPermissions", permissionsData);

        console.log("API response for saved permissions:", savedPermissionsResponse);


    // 3. الحصول على الـ ID الخاص بالصلاحيات المضافة من استجابة API
    const savedPermissionId = savedPermissionsResponse; // التأكد من أن الاستجابة تحتوي على id

    if (!savedPermissionId) {
      throw new Error("Failed to retrieve permission ID from response");
    }

    const companyIId = companyId.value !== null ? companyId.value : userId.value;

    // 4. بناء بيانات الدور مع الصلاحيات التي تم إضافتها (ربط الدور بالصلاحيات المضافة)
    const roleData = {
      name: roleName.value,
      companyId: companyIId,
      permissions: [savedPermissionId], // إرسال معرفات الصلاحيات
    };

    // 5. استدعاء الدالة الخاصة بإضافة الدور وربط الصلاحيات به
    await store.dispatch("addRoleWithPermissions", roleData);

    // عرض رسالة نجاح
    successMessage.value = t("roleSaved");
    showSuccess.value = true;

    // إعادة ضبط المدخلات
    roleName.value = "";
    selectedPermissions.value = [];

    setTimeout(() => {
      showSuccess.value = false;
    }, 3000);
  } catch (error) {
    console.error("Error submitting role and permissions:", error);
    errorMessage.value = t("generalError");
    showAlert.value = true;

    // إخفاء رسالة الخطأ بعد 3 ثوانٍ
    setTimeout(() => {
      showAlert.value = false;
    }, 3000);
  }
};









onBeforeMount(async () => {
  const body = document.getElementsByTagName("body")[0];
  body.classList.remove("bg-gray-100");

  const isRTL = store.getters.currentLanguage === "ar";
  document
    .querySelector("html")
    .setAttribute("lang", store.getters.currentLanguage);
  document.querySelector("html").setAttribute("dir", isRTL ? "rtl" : "ltr");
  document.querySelector("#app").classList.toggle("rtl", isRTL);

  // جلب الأذونات عند تحميل الصفحة
  await fetchPermissions();
});

onBeforeUnmount(() => {
  const body = document.getElementsByTagName("body")[0];
  body.classList.add("bg-gray-100");
});
</script>

<template>
  <LanguageSwitcher />
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header pb-0">
            <div class="d-flex align-items-center">
              <p class="mb-0">{{ t("addRole") }}</p>
            </div>
          </div>
          <div class="card-body">
            <form @submit.prevent>
              <div class="row">
                <div class="col-md-12">
                  <label for="role-input" class="form-control-label">{{
                    t("role")
                  }}</label>
                  <argon-input
                    id="role-input"
                    v-model="roleName"
                    :placeholder="t('addRole')"
                    required
                  />
                </div>
              </div>

              <!-- زر لإظهار/إخفاء الأذونات -->
              <argon-button
                class="mt-3"
                variant="gradient"
                color="info"
                size="sm"
                @click="toggleAccordion"
              >
                {{ t("addPermission") }}
              </argon-button>

              <!-- Accordion للأذونات -->
              <div v-if="showAccordion" class="mt-3">
                <div
                  v-for="permission in permissionsList"
                  :key="permission"
                  class="form-check"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="permission"
                    :value="permission"
                    v-model="selectedPermissions"
                  />
                  <label class="form-check-label" :for="permission">
                    {{ permission }}
                  </label>
                </div>
              </div>

              <!-- زر لحفظ الأذونات -->
              <argon-button
                class="mt-3 mx-3"
                variant="gradient"
                color="success"
                size="sm"
                type="submit"
                @click="submitRoleAndPermissions"
              >
                {{ t("savePermissions") }}
              </argon-button>

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
