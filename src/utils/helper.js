import { store } from "@/store";
import { ref } from "vue";
const showAlert = ref(false);


export const fetchDepartments = async (currentCompanyId, currentUserId, departments, componentKey, errorMessage, t, ) => {
  try {
    await store.dispatch("fetchDepartments");
    departments.value = store.getters.departments.filter(
      (department) =>
        (department.companyID == currentCompanyId.value ||
          department.companyID == currentUserId.value) &&
        department.companyID != null
    );
    componentKey.value += 1;
  } catch (error) {
    showAlert.value = true;
    errorMessage.value = t("generalError");
  }
};
