<script setup>
import { ref, computed, onBeforeMount, watch } from "vue";
import { useStore } from "vuex";
// import ArgonInput from "@/components/ArgonInput.vue";
import ArgonModal from "@/components/ArgonModal.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonAlert from "@/components/ArgonAlert.vue";
import LanguageSwitcher from "@/views/components/LanguageSwitcher.vue";
import ProjectsTable from "@/views/components/ProjectsTable.vue";
import Swal from "sweetalert2";
const store = useStore();
const showAlert = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const showSuccess = ref(false);
const projectName = ref("");
const showPopup = ref(false);
const projects = ref([]);
const componentKey = ref(0);
const body = document.getElementsByTagName("body")[0];
const isLoading = ref(false);

onBeforeMount(async () => {
  body.classList.remove("bg-gray-100");
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

  await fetchProjects();
});

const currentCompanyId = computed(() => store.getters.companyId);
console.log("currentCompanyId:", currentCompanyId.value);

const currentUserId = computed(() => store.getters.userId);
console.log("currentUserId:", currentUserId.value);

const userName = computed(() => store.getters.userName);

const fetchProjects = async () => {
  isLoading.value = true;
  try {
    await store.dispatch("fetchProjects");
    projects.value = store.getters.projects.filter(
      (project) =>
        (project.companyID == currentCompanyId.value ||
          project.companyID == currentUserId.value) &&
        project.companyID != null
    );
    componentKey.value += 1;
  } catch (error) {
    showAlert.value = true;
    errorMessage.value = t("generalError");
  } finally {
    isLoading.value = false;
  }
};
// const departmentsGetters = computed(() => store.getters.departments.filter(
//   department => department.companyID == store.getters.companyId
// ));
// console.log("departmentsGetters", departmentsGetters.value);

watch(
  () => store.getters.projects,
  (newData) => {
    projects.value = [...newData];
    componentKey.value += 1; // إعادة تحميل المكون عند حدوث أي تحديث في البيانات
  }
);

const currentLanguage = computed(() => store.getters.currentLanguage);

const t = (key) => {
  return translations[currentLanguage.value][key];
};

const openPopup = () => {
  showPopup.value = true;
};

const closePopup = () => {
  showPopup.value = false;
};

const addProject = async () => {
  const companyIId =
    currentCompanyId.value !== null
      ? currentCompanyId.value
      : currentUserId.value;

  if (projectName.value) {
    isLoading.value = true;
    const project = {
      neme: projectName.value,
      companyId: companyIId,
      createdOwner: userName.value,
    };
    try {
      await store.dispatch("addProject", project);
      showSuccess.value = true;
      setTimeout(() => {
        showSuccess.value = false;
      }, 3000);
      successMessage.value = t("projectAdded");
      closePopup();
      await fetchProjects();
      componentKey.value += 1;
    } catch (error) {
      showAlert.value = true;
      setTimeout(() => {
        showAlert.value = false;
      }, 3000);
      errorMessage.value = t("projectAddedError");
    } finally {
      isLoading.value = false;
    }
  } else {
    Swal.fire({
      title: t("projectNameRequired"),
      icon: "warning",
    });
    isLoading.value = false;
  }
};

const translations = {
  en: {
    addMember: "Add Member",
    email: "Email",
    emailExistsError:
      "This email is already registered. Please use another email.",
    generalError: "An error occurred while submitting. Please try again later.",
    invalidCompanyIdOrUserId: "Invalid Company ID or User ID.",
    projectDeleted: "Project deleted successfully.",
    projectAdded: "Project added successfully.",
    deleteConfirmationTitle: "Delete Project",
    deleteConfirmationText: "Are you sure you want to delete this Project?",
    delete: "Delete",
    addProject: "Add Project",
    projectName: "Project Name",
    close: "Close",
    add: "Add",
    projectsTable: "Projects ",
    projectNameRequired: "Please enter the project name.",
    projectAddedError:
      "An error occurre while adding the project. Please try again later.",
  },
  ar: {
    addMember: "اضافة عضو",
    email: "البريد الالكتروني",
    emailExistsError:
      "هذا البريد الالكتروني مسجل بالفعل. يرجى استخدام بريد الكتروني اخر.",
    generalError: "حدث خطأ في التقديم. يرجى المحاولة مرة اخرى في وقت لاحق.",
    invalidCompanyIdOrUserId: "معرف الشركة غير صحيح.",
    projectDeleted: "تم حذف المشروع بنجاح.",
    projectAdded: "تم اضافة المشروع بنجاح.",
    deleteConfirmationTitle: "حذف المشروع",
    deleteConfirmationText: "هل تريد حذف هذا المشروع؟",
    delete: "حذف",
    addProject: "اضافة مشروع",
    projectName: "اسم المشروع",
    close: "اغلاق",
    add: "اضافة",
    projectsTable: "المشاريع",
    projectNameRequired: "يرجى ادخال اسم المشروع.",
    projectAddedError:
      "حدث خطأ في اضافة المشروع. يرجى المحاولة مرة اخرى في وقت لاحق.",
  },
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
              <p class="mb-0">{{ t("projectsTable") }}</p>
              <argon-button class="ml-auto mx-2" @click="openPopup">
                <i class="fas fa-plus"></i>
              </argon-button>
            </div>
          </div>
          <div class="card-body">
            <form @submit.prevent>
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
            <div v-if="isLoading" class="text-center">
              <span
                class="spinner-border"
                role="status"
                aria-hidden="true"
              ></span>
            </div>
            <projects-table v-else :projects="projects" :key="componentKey" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showPopup" class="popup-overlay">
    <transition name="modal-fade">
      <ArgonModal v-if="showPopup" :title="t('addProject')" @close="closePopup">
        <template #default>
          <label>{{ t("projectName") }}:</label>
          <input v-model="projectName" class="form-control" />
        </template>

        <template #footer>
          <argon-button @click="closePopup">{{ t("close") }}</argon-button>
          <argon-button @click="addProject" :disabled="isLoading">
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            {{ isLoading ? t("saving") : t("add") }}
          </argon-button>
        </template>

        <template #title>
          <i class="fas fa-user-edit me-2"></i>
          {{ t("addProject") }}
        </template>
      </ArgonModal>
    </transition>
  </div>
</template>

<style>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
