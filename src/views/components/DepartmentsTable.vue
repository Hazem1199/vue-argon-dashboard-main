<template>
  <div class="card-body px-0 pt-0 pb-2" :key="componentKey">
    <div class="table-responsive p-0">
      <table class="table align-items-center mb-0">
        <thead>
          <tr>
            <th
              class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
            >
              {{ t("departmentName") }}
            </th>
            <th
              class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
            >
              {{ t("assignManager") }}
            </th>
            <th
              class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
            >
              {{ t("viceManager") }}
            </th>
            <th class="text-secondary opacity-7"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="department in props.departments" :key="department.id">
            <td>
              <div class="d-flex px-2 py-1">
                <div class="d-flex flex-column justify-content-center text-sm">
                  <h6 class="mb-0 text-sm">{{ department.departmentName }}</h6>
                </div>
              </div>
            </td>
            <td>
              <p class="text-xs font-weight-bold mb-0">
                {{ getManagerName(department) }}
              </p>
              <!-- <a href="javascript:;"  class="btn btn-link text-dark px-3 mb-0"><i class="fa fa-edit"></i></a> -->
            </td>
            <td>
              <p class="text-xs font-weight-bold mb-0">
                {{ getViceManagerName(department) }}
              </p>
            </td>
            <td class="align-middle">
              <a
                v-show="canEditDepartment"
                href="javascript:;"
                class="text-secondary font-weight-bold text-xs"
                @click="openEditModal(department)"
              >
                {{ t("edit") }}
              </a>
              <a
                v-show="canDeleteDepartment"
                href="javascript:;"
                class="text-danger font-weight-bold text-xs ms-2"
                @click="confirmDelete(department)"
              >
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
      <ArgonModal
        v-if="showEditPopup"
        :title="t('editDepartment')"
        @close="closeEditPopup"
      >
        <template #default>
          <label>{{ t("departmentName") }}:</label>
          <input
            v-model="selectedDepartment.departmentName"
            class="form-control"
          />
          <div v-if="employees.length > 0">
            <label>{{ t("assignManager") }}:</label>
            <argon-select
              v-model="selectedManager"
              :options="employeeOptions"
              :placeholder="t('assignManager')"
              class="form-control"
            />
          </div>
          <div v-if="employees.length > 0">
            <label>{{ t("viceManager") }}:</label>
            <argon-select
              v-model="selectedViceManager"
              :options="employeeOptions"
              :placeholder="t('viceManager')"
              class="form-control"
            />
          </div>
        </template>

        <template #footer>
          <argon-button @click="closeEditPopup">{{ t("close") }}</argon-button>
          <argon-button @click="updateDepartment" :disabled="isLoading">
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            {{ isLoading ? t("saving") : t("update") }}
          </argon-button>
        </template>

        <template #title>
          <i class="fas fa-user-edit me-2"></i>
          {{ t("editDepartment") }}
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
  departments: {
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
// const editDepartmentName = ref("");
// const currentEditingDepartmentId = ref(null);
// const isLoading = ref(false);
// const successMessage = ref("");
const errorMessage = ref("");
// const showSuccess = ref(false);
const showAlert = ref(false);
// const selectedEmployeeId = ref(null);  // متغير لتحديد ID الموظف
// const selectedPosition = ref(null);  // متغير لتحديد المنصب الجديد


const fetchEmployees = async () => {
  try {
    // جلب بيانات الموظفين من الـ Vuex store
    await store.dispatch("fetchDataFromApi");

    console.log("Employees Data:", employees.value);

    componentKey.value += 1; // تحديث المفتاح لإعادة تحميل المكون
    return (employees.value = store.getters.dataFromApi.filter(
      (employee) =>
        (employee.companyId == currentCompanyId.value ||
          employee.companyId == currentUserId.value) &&
        employee.companyId != null
    ));
  } catch (error) {
    console.error("Error fetching employees data:", error);

    // عرض رسالة خطأ بناءً على اللغة
    if (store.getters.currentLanguage === "ar") {
      errorMessage.value =
        "حدث خطأ أثناء جلب بيانات الموظفين. حاول مرة أخرى لاحقًا.";
    } else {
      errorMessage.value =
        "An error occurred while fetching employees data. Please try again later.";
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
// const editDepartmentName = ref("");
const currentEditingDepartmentId = ref(null);
const selectedManager = ref(null);
const selectedViceManager = ref(null);

const selectedDepartment = ref(null);
// const selectedPosition = ref(null);

console.log("props.departments:", props.departments);

const currentLanguage = computed(() => store.getters.currentLanguage);
const t = (key) => translations[currentLanguage.value][key];

const canEditDepartment = computed(() =>
  hasPermission(permissions.value, "canEditDepartment")
);
const canDeleteDepartment = computed(() =>
  hasPermission(permissions.value, "canDeleteDepartment")
);

// const openEditModal = (department) => {
//   selectedDepartment.value = department;

//   // تأكد من أن department.employees غير فارغة
//   if (department.employees && department.employees.length > 0) {
//     const manager = department.employees.find(
//       (emp) => emp.position.name === "Manager"
//     );
//     const viceManager = department.employees.find(
//       (emp) => emp.position.name === "Vice Manager"
//     );

//     // console.log("manager:", manager);
//     // console.log("viceManager:", viceManager);

//     // تحديد المدير ونائب المدير
//     selectedManager.value = manager ? manager.id : null;
//     selectedViceManager.value = viceManager ? viceManager.id : null;

//     console.log("selectedManager:", selectedManager.value);
//     console.log("selectedViceManager:", selectedViceManager.value);
//   } else {
//     // في حالة عدم وجود موظفين
//     selectedManager.value = null;
//     selectedViceManager.value = null;
//   }

//   showEditPopup.value = true;
// };

const openEditModal = (department) => {
  selectedDepartment.value = department;
  selectedManager.value = department.managerId;
  selectedViceManager.value = department.viceManagerId;
  showEditPopup.value = true;
};


const closeEditPopup = () => {
  showEditPopup.value = false;
  selectedDepartment.value = null;
  currentEditingDepartmentId.value = null;
};

const isLoading = ref(false);

const updateDepartment = async () => {
  isLoading.value = true; // تعيين حالة التحميل

  // تجهيز البيانات التي سيتم إرسالها
  const departmentData = {
    departmentName: selectedDepartment.value.departmentName, // اسم القسم
    managerId: selectedManager.value, // ID المدير
    viceManagerId: selectedViceManager.value, // ID نائب المدير
    employees: selectedDepartment.value.employees.map(emp => {
      if (emp.position.name === "Manager") {
        emp.id = selectedManager.value; // تغيير الـ id للمدير
      } else if (emp.position.name === "Vice Manager") {
        emp.id = selectedViceManager.value; // تغيير الـ id لنائب المدير
      }
      return emp; // إرجاع الموظف المعدل
    }),
  };

  try {
    // استخدام Vuex لإرسال الطلب لتحديث القسم
    const result = await store.dispatch('updateDepartment', {
      departmentId: selectedDepartment.value.id, // معرف القسم
      departmentName: departmentData.departmentName, // اسم القسم
      managerId: departmentData.managerId, // معرف المدير
      viceManagerId: departmentData.viceManagerId, // معرف نائب المدير
      employees: [
        {
          id: departmentData.managerId,
          position: {
            id: 1,
          },
        },
      ]
    });

    // إذا كانت الاستجابة ناجحة
    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: result.message,
        showConfirmButton: false,
        timer: 1500,
      });

      // غلق نافذة التعديل
      closeEditPopup();
    } else {
      // في حالة حدوث خطأ
      Swal.fire({
        icon: 'error',
        title: result.message,
        showConfirmButton: true,
      });
    }
  } catch (error) {
    console.error("Error updating department:", error);

    // عرض رسالة الخطأ
    Swal.fire({
      icon: 'error',
      title: 'Error updating department',
      text: error.message,
    });
  } finally {
    isLoading.value = false; // إيقاف حالة التحميل
  }
};


// const saveChanges = async () => {
//     componentKey.value += 1;
// }

const confirmDelete = (department) => {
  Swal.fire({
    title: t("deleteConfirmationTitle"),
    text: t("deleteConfirmationText"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: t("delete"),
    cancelButtonText: t("close"),
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteDepartment(department.id);
    }
  });
};

const deleteDepartment = async (departmentId) => {
  console.log(departmentId);
  try {
    await store.dispatch("deleteDepartment", departmentId);
    await store.dispatch("fetchDepartments");
    componentKey.value += 1;
  } catch (error) {
    console.error("Error deleting department:", error);
  }
};

const translations = {
  en: {
    departmentsTable: "Departments Table",
    departmentName: "Department Name",
    edit: "Edit",
    delete: "Delete",
    deleteConfirmationTitle: "Delete Department",
    deleteConfirmationText: "Are you sure you want to delete this department?",
    close: "Close",
    saving: "Saving...",
    update: "Update",
    assignManager: "Manager",
    viceManager: "Vice Manager",
  },
  ar: {
    departmentsTable: "جدول الأقسام",
    departmentName: "اسم القسم",
    edit: "تعديل",
    delete: "حذف",
    deleteConfirmationTitle: "حذف القسم",
    deleteConfirmationText: "هل تريد حذف هذا القسم؟",
    close: "إغلاق",
    saving: "يتم الحفظ...",
    update: "تحديث",
    assignManager: "المدير",
    viceManager: "مدير مساعد",
  },
};

// const selectedEmployee = ref(null);
// console.log(selectedEmployee.value)

// Transform employees data into options for the select component
const employeeOptions = computed(() => {
  return employees.value.map((employee) => ({
    label: employee.name, // Adjust the property name as needed
    value: employee.id, // Adjust the property name as needed
  }));
});

// Function to get the manager's name
const getManagerName = (department) => {
  const manager = department.employees.find(
    (emp) => emp.position.name === "Manager"
  );
  return manager ? manager.name : "No Manager";
};

// Function to get the vice manager's name
const getViceManagerName = (department) => {
  const viceManager = department.employees.find(
    (emp) => emp.position.name === "Vice Manager"
  );
  return viceManager ? viceManager.name : "No Vice Manager";
};
</script>
