<template>
    <div class="card-body px-0 pt-0 pb-2" :key="componentKey">
        <div class="table-responsive p-0">
            <table class="table align-items-center mb-0">
                <thead>
                    <tr>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                            {{ t("projectName") }}
                        </th>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                            {{ t("CreatedBy") }}
                        </th>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                            {{ t("assignManager") }}
                        </th>
                        <!-- <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                            {{ t("viceManager") }}
                        </th> -->
                        <th class="text-secondary opacity-7"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="project in props.projects" :key="project.id">
                        <td>
                            <div class="d-flex px-2 py-1">
                                <div class="d-flex flex-column justify-content-center text-sm">
                                    <h6 class="mb-0 text-sm">{{ project.neme }}</h6>
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="d-flex px-2 py-1">
                                <div class="d-flex flex-column justify-content-center text-sm">
                                    <h6 class="mb-0 text-sm">{{ project.createdOwner }}</h6>
                                </div>
                            </div>
                        </td>
                        
                        <td>
                            <p class="text-xs font-weight-bold mb-0">
                                {{ getManagerName(project) }}
                            </p>
                        </td>
                        <!-- <td>
                            <p class="text-xs font-weight-bold mb-0">
                                {{ getViceManagerName(project) }}
                            </p>
                        </td> -->
                        <td class="align-middle">
                            <a v-show="canEditProject" href="javascript:;"
                                class="text-secondary font-weight-bold text-xs" @click="openEditModal(project)">
                                {{ t("edit") }}
                            </a>
                            <a v-show="canDeleteProject" href="javascript:;"
                                class="text-danger font-weight-bold text-xs ms-2" @click="confirmDelete(project)">
                                {{ t("delete") }}
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div v-if="showEditPopup" class="popup-overlay">
        <transition name="modal-fade">
            <ArgonModal v-if="showEditPopup" :title="t('editProject')" @close="closeEditPopup">
                <template #default>
                    <label>{{ t("projectName") }}:</label>
                    <input v-model="editProjectName" class="form-control" />
                    <div v-if="employees.length > 0">
                        <label>{{ t("assignManager") }}:</label>
                        <argon-select v-model="selectedEmployee" :options="employeeOptions"
                            :placeholder="t('assignManager')" class="form-control" />
                    </div>
                    <!-- <div v-if="employees.length > 0">
                        <label>{{ t("viceManager") }}:</label>
                        <argon-select v-model="selectedEmployee" :options="employeeOptions"
                            :placeholder="t('viceManager')" class="form-control" />
                    </div> -->
                </template>

                <template #footer>
                    <argon-button @click="closeEditPopup">{{ t("close") }}</argon-button>
                    <argon-button @click="updateProject" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"
                            aria-hidden="true"></span>
                        {{ isLoading ? t("saving") : t("update") }}
                    </argon-button>
                </template>

                <template #title>
                    <i class="fas fa-user-edit me-2"></i>
                    {{ t("editProject") }}
                </template>
            </ArgonModal>
        </transition>
    </div>
</template>

<script setup>
import { computed, ref, onBeforeMount, onMounted } from "vue";
import { useStore } from "vuex";
import Swal from "sweetalert2";
import ArgonModal from "@/components/ArgonModal.vue";
import ArgonButton from "@/components/ArgonButton.vue";
// import ArgonAlert from "@/components/ArgonAlert.vue";
import ArgonSelect from "@/components/ArgonSelect.vue";
import {
    savePermissionsToLocalStorage,
    loadPermissionsFromLocalStorage,
    hasPermission,
} from "@/utils/permissions.js"; // استيراد الوحدة

const store = useStore();
const userData = computed(() => store.getters.user);
const currentCompanyId = computed(() => store.getters.companyId);
console.log("currentCompanyId:", currentCompanyId.value);

const currentUserId = computed(() => store.getters.userId);
console.log("currentUserId:", currentUserId.value);

const props = defineProps({
    projects: {
        type: Array,
        required: true,
    },
});


onMounted(() => {
    store.dispatch("fetchPositions");
});

const employees = ref([]);
// const componentKey = ref(0); // متغير لتغيير المفتاح وإعادة تحميل المكون
// const showEditPopup = ref(false);

// const isLoading = ref(false);
// const successMessage = ref("");
const errorMessage = ref("");
// const showSuccess = ref(false);
const showAlert = ref(false);

const fetchEmployees = async () => {
    try {
        // جلب بيانات الموظفين من الـ Vuex store
        await store.dispatch("fetchDataFromApi");

        console.log("Employees Data:", employees.value);


        componentKey.value += 1; // تحديث المفتاح لإعادة تحميل المكون
        return employees.value = store.getters.dataFromApi.filter(
            (employee) =>
                (employee.companyId == currentCompanyId.value || employee.companyId == currentUserId.value) &&
                employee.companyId != null
        );
    } catch (error) {
        console.error("Error fetching employees data:", error);

        // عرض رسالة خطأ بناءً على اللغة
        if (store.getters.currentLanguage === "ar") {
            errorMessage.value = "حدث خطأ أثناء جلب بيانات الموظفين. حاول مرة أخرى لاحقًا.";
        } else {
            errorMessage.value = "An error occurred while fetching employees data. Please try again later.";
        }

        showAlert.value = true; // إظهار التنبيه بالخطأ

        // إخفاء التنبيه بعد 3 ثوانٍ
        setTimeout(() => {
            showAlert.value = false;
        }, 3000);
    }
};

const componentKey = ref(0);
const permissions = ref(
    loadPermissionsFromLocalStorage(userData.value?.user?.id) || {}
);

onBeforeMount(() => {
    savePermissionsToLocalStorage(permissions.value, userData.value?.user?.id);
    fetchEmployees();
});

const showEditPopup = ref(false);
const editProjectName = ref("");
const currentEditingProjectId = ref(null);

console.log("props.projects:", props.projects);

const currentLanguage = computed(() => store.getters.currentLanguage);
const t = (key) => translations[currentLanguage.value][key];

const canEditProject = computed(() =>
    hasPermission(permissions.value, "canEditProject")
);
const canDeleteProject = computed(() =>
    hasPermission(permissions.value, "canDeleteProject")
);

const openEditModal = (project) => {
    console.log(project);
    currentEditingProjectId.value = project.id;
    editProjectName.value = project.neme;
    showEditPopup.value = true;
};

const closeEditPopup = () => {
    showEditPopup.value = false;
    editProjectName.value = "";
    currentEditingProjectId.value = null;
};

const isLoading = ref(false);

const updateProject = async () => {
    isLoading.value = true;
    const project = {
        id: currentEditingProjectId.value,
        neme: editProjectName.value,
    };

    try {
        await store.dispatch("updateProject", project);
        closeEditPopup();
        componentKey.value += 1;
        await store.dispatch("fetchProjects");
    } catch (error) {
        console.error("Error updating project:", error);
    } finally {
        isLoading.value = false;
    }
};

// const saveChanges = async () => {
//     componentKey.value += 1;
// }

const confirmDelete = (project) => {
    Swal.fire({
        title: t("deleteConfirmationTitle"),
        text: t("deleteConfirmationText"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: t("delete"),
        cancelButtonText: t("close"),
    }).then(async (result) => {
        if (result.isConfirmed) {
            await deleteProject(project.id);
        }
    });
};

const deleteProject = async (projectId) => {
    console.log(projectId);
    try {
        await store.dispatch("deleteProject", projectId);
        await store.dispatch("fetchProjects");
        componentKey.value += 1;
    } catch (error) {
        console.error("Error deleting project:", error);
    }
};

const translations = {
    en: {
        projectTable: "Projects Table",
        projectName: "Project Name",
        edit: "Edit",
        delete: "Delete",
        deleteConfirmationTitle: "Delete Project",
        deleteConfirmationText: "Are you sure you want to delete this project?",
        close: "Close",
        saving: "Saving...",
        update: "Update",
        assignManager: "Manager",
        viceManager: "Vice Manager",
        CreatedBy : "Created By",
    },
    ar: {
        projectTable: "جدول المشاريع",
        projectName: "اسم المشروع",
        edit: "تعديل",
        delete: "حذف",
        deleteConfirmationTitle: "حذف المشروع",
        deleteConfirmationText: "هل تريد حذف هذا المشروع؟",
        close: "إغلاق",
        saving: "يتم الحفظ...",
        update: "تحديث",
        assignManager: "المدير",
        viceManager: "مدير مساعد",
        CreatedBy: "منشء بواسطة",
    },
};

const selectedEmployee = ref(null);
console.log(selectedEmployee.value)

// Transform employees data into options for the select component
const employeeOptions = computed(() => {
    return employees.value.map(employee => ({
        label: employee.name, // Adjust the property name as needed
        value: employee.id   // Adjust the property name as needed
    }));
});

// Function to get the manager's name
const getManagerName = (project) => {
    const manager = project.employees.find(emp => emp.position.name === 'Manager');
    return manager ? manager.name : 'No Manager';
};

// Function to get the vice manager's name
// const getViceManagerName = (project) => {
//     const viceManager = project.employees.find(emp => emp.position.name === 'Vice Manager');
//     return viceManager ? viceManager.name : 'No Vice Manager';
// };
</script>
