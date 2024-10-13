<template>
  <div class="card">
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
            <!-- استخدام البيانات القادمة من filteredEmployees -->
            <tr v-for="employee in filteredEmployees" :key="employee.id">
              <td>
                <div class="d-flex px-2 py-1">
                  <div>
                    <!-- <img
                      :src="employee.avatar || '../../assets/img/default-avatar.png'"
                      class="avatar avatar-sm me-3"
                      :alt="employee.name"
                    /> -->
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ employee.name }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs text-secondary mb-0">{{ employee.email }}</p>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ employee.role.name }}</p>
              </td>
              <td class="align-middle">
                <a
                  href="javascript:;"
                  class="text-secondary font-weight-bold text-xs"
                  data-toggle="tooltip"
                  :data-original-title="t('editUser')"
                  >{{ t("edit") }}</a
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

// استدعاء props لاستقبال بيانات الموظفين من المكون الأب
const props = defineProps({
  employees: {
    type: Array,
    required: true,
  },
});

// جلب companyId الحالي من localStorage
const currentCompanyId = localStorage.getItem("companyId");

const store = useStore();

// الترجمات
const translations = {
  en: {
    employeesTable: "Employees Table",
    name: "Name",
    email: "Email",
    role: "Role",
    editUser: "Edit User",
    edit: "Edit",
  },
  ar: {
    employeesTable: "جدول الموظفين",
    name: "الاسم",
    email: "البريد الإلكتروني",
    role: "الدور",
    editUser: "تعديل المستخدم",
    edit: "تعديل",
  },
};

// تصفية الموظفين بناءً على companyId
const filteredEmployees = computed(() => {
  return props.employees.filter(
    (employee) => employee.companyId === currentCompanyId
  );
});

const currentLanguage = computed(() => store.getters.currentLanguage);
const t = (key) => translations[currentLanguage.value][key];
</script>
