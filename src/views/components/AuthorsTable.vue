<template>
  <div class="card" :key="componentKey">
    <div class="card-header pb-0">
      <h6>{{ t("employeesTable") }}</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                {{ t("name") }}
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                {{ t("email") }}
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                {{ t("role") }}
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in filteredEmployees" :key="employee.id">
              <td>
                <div class="d-flex px-2 py-1">
                  <div></div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ employee.name }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs text-secondary mb-0">{{ employee.email }}</p>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">
                  {{ employee.role.name }}
                </p>
              </td>
              <td class="align-middle">
                <a v-show="canEditUser" href="javascript:;" class="text-secondary font-weight-bold text-xs" @click="openEditModal(employee)">
                  {{ t("edit") }}
                </a>
                <!-- زرار حذف -->
                <a v-show="canDeleteUser" href="javascript:;" class="text-danger font-weight-bold text-xs ms-2" @click="confirmDelete(employee)">
                  {{ t("delete") }}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <transition name="modal-fade">
      <ArgonModal v-if="isModalOpen" :title="'Edit Employee'" @close="closeModal">
        <template #default>
          <label>{{ t("name") }}:</label>
          <input v-model="selectedEmployee.name" class="form-control" />
          <label>{{ t("role") }}:</label>
          <argon-select v-model="selectedEmployee.roleId" :options="formattedRoles" :placeholder="t('role')" class="form-control" />
        </template>

        <template #footer>
          <argon-button @click="closeModal">{{ t("close") }}</argon-button>
          <argon-button @click="saveChanges" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ isLoading ? t("saving") : t("saveChanges") }}
          </argon-button>
        </template>

        <template #title>
          <i class="fas fa-user-edit me-2"></i>
          Edit Employee
        </template>
      </ArgonModal>
    </transition>

    <argon-alert v-if="successMessage" color="success" dismissible class="mt-3">
      {{ successMessage }}
    </argon-alert>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeMount } from "vue";
import { useStore } from "vuex"; // تأكد من الاستيراد الصحيح
import ArgonModal from "@/components/ArgonModal.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonSelect from "@/components/ArgonSelect.vue";
import ArgonAlert from "@/components/ArgonAlert.vue";
import Swal from "sweetalert2"; // استيراد مكتبة SweetAlert2
import { savePermissionsToLocalStorage, loadPermissionsFromLocalStorage, hasPermission } from "@/utils/permissions.js"; // استيراد الوحدة

const store = useStore(); // تأكد من تهيئة الـ store هنا

const userData = computed(() => store.getters.user);

// استدعاء الصلاحيات من localStorage بناءً على المستخدم الحالي
const permissions = ref(loadPermissionsFromLocalStorage(userData.value?.user?.id) || {});

// في حال عدم وجود صلاحيات في localStorage، جلبها من Vuex
onBeforeMount(() => {
  if (!permissions.value || Object.keys(permissions.value).length === 0) {
    const userRolePermissions = userData.value?.user?.role?.permissions[0] || {};
    permissions.value = userRolePermissions;

    // حفظ الصلاحيات في localStorage بعد التشفير بناءً على المستخدم الحالي
    savePermissionsToLocalStorage(permissions.value, userData.value?.user?.id);
  }
});

// استخدام الصلاحيات للتحكم في ظهور الأزرار
const canEditUser = computed(() => hasPermission(permissions.value, "canEditUser"));
const canDeleteUser = computed(() => hasPermission(permissions.value, "canDeleteUser"));

const props = defineProps({
  employees: {
    type: Array,
    required: true,
  },
});

console.log( "EmployeesProps:", props.employees);


const currentCompanyId = computed(() => store.getters.companyId);
console.log("currentCompanyId:", currentCompanyId.value);

const currentUserId = computed(() => store.getters.userId);
console.log("currentUserId:", currentUserId.value);

const componentKey = ref(0);

const roles = computed(() => store.getters.roles);
console.log("roles:", roles.value);

const formattedRoles = computed(() => {
  return roles.value
    .filter((role) => (role.companyId === currentCompanyId.value || role.companyId === currentUserId.value) && role.companyId !== null)
    .map((role) => ({
      value: role.id,
      label: role.name,
    }));
});

const translations = {
  en: {
    employeesTable: "Employees Table",
    name: "Name",
    email: "Email",
    role: "Role",
    editUser: "Edit User",
    edit: "Edit",
    delete: "Delete", // ترجمة الزرار
    close: "Close",
    saveChanges: "Save changes",
    saving: "Saving...",
    updateSuccess: "Data updated successfully!",
    deleteConfirmationText: "Are you sure you want to delete this user?",
    deleteSuccess: "User deleted successfully!",
  },
  ar: {
    employeesTable: "جدول الموظفين",
    name: "الاسم",
    email: "البريد الإلكتروني",
    role: "الدور",
    editUser: "تعديل المستخدم",
    edit: "تعديل",
    delete: "حذف", // ترجمة الزرار
    close: "إغلاق",
    saveChanges: "حفظ التغييرات",
    saving: "جارٍ الحفظ...",
    updateSuccess: "تم تحديث البيانات بنجاح!",
    deleteConfirmationText: "هل تريد حذف هذا المستخدم؟",  
    deleteSuccess: "تم حذف المستخدم بنجاح!",
  },
};

const filteredEmployees = ref(
  props.employees.filter(
    (employee) =>
      (employee.companyId == currentCompanyId.value || employee.companyId == currentUserId.value ) &&
      employee.id != currentUserId.value && employee.companyId != null
  )
);
console.log( "FilteredEmployees:", filteredEmployees.value);

// تحديث الموظفين تلقائيًا عند تغيير `employees`
watch(
  () => props.employees,
  (newEmployees) => {
    filteredEmployees.value = newEmployees.filter(
      (employee) =>
        (employee.companyId == currentCompanyId.value || employee.companyId == currentUserId.value ) &&
        employee.id != currentUserId.value && employee.companyId != null
    );
  }
);


const currentLanguage = computed(() => store.getters.currentLanguage);
const t = (key) => translations[currentLanguage.value][key];

const isModalOpen = ref(false);
const selectedEmployee = ref(null);
const isLoading = ref(false);
const successMessage = ref("");

const openEditModal = (employee) => {
  console.log("employee:", employee.id);
  selectedEmployee.value = employee;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedEmployee.value = null;
};

const saveChanges = async () => {
  try {
    isLoading.value = true;
    const userId = selectedEmployee.value.id;
    const roleId = selectedEmployee.value.roleId;
    const userName = selectedEmployee.value.name;

    await store.dispatch("updateRole", { userId, roleId, userName });

    isLoading.value = false;
    successMessage.value = t("updateSuccess");
    closeModal();

    await store.dispatch("fetchDataFromApi"); // جلب البيانات الجديدة
    componentKey.value += 1; // تغيير المفتاح لإعادة تحميل المكون

    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    console.error("Error saving changes:", error);
    isLoading.value = false;
  }
};

// دالة تأكيد الحذف
const confirmDelete = (employee) => {
  Swal.fire({
    title: t("deleteConfirmationTitle"),
    text: t("deleteConfirmationText"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: t("delete"),
    cancelButtonText: t("close"),
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteEmployee(employee.id); // إذا تم تأكيد الحذف
    }
  });
};

// دالة الحذف
const deleteEmployee = async (employeeId) => {
  try {
    await store.dispatch("deleteEmployee", employeeId); // استدعاء Vuex لحذف الموظف
    await store.dispatch("fetchDataFromApi"); // جلب البيانات الجديدة بعد الحذف
    
    successMessage.value = t("deleteSuccess");
    setTimeout(() => {
      successMessage.value = "";
      componentKey.value += 1; // تحديث المفتاح لإعادة تحميل المكون
    }, 3000);
  } catch (error) {
    console.error("Error deleting employee:", error);
  }
};

// تحديث الموظفين تلقائيًا عند تغيير `employees`
watch(
  () => props.employees,
  (newEmployees) => {
    filteredEmployees.value = [...newEmployees];
  }
);

onMounted(() => {
  store.dispatch("fetchRoles");
});
</script>



<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: ease-in-out opacity 0.5s;
}
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}
.spinner-border {
  margin-right: 5px;
}
</style>
