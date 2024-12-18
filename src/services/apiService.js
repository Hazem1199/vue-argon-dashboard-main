// src/services/apiService.js
import axios from "axios";
import store from "@/store"; // استيراد Vuex store للوصول إلى الـ token

// إنشاء apiClient باستخدام axios
const apiClient = axios.create({
  baseURL: "https://task-com.onrender.com/api", // قاعدة الـ URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor لإضافة الـ token لكل طلب
apiClient.interceptors.request.use(
  (config) => {
    const token = store.getters.token; // جلب الـ token من Vuex
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // إضافة الـ token إلى الـ headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// تصدير الدوال المختلفة للتعامل مع API
export default {
  // GET: جلب البيانات
  getUsers() {
    return apiClient.get("/starts?populate=*");
  },

  // POST: إضافة بيانات جديدة
  addEmail(userData) {
    console.log(userData);
    // const payload = {
    //   data: {
    //     email: userData.email,
    //     role: userData.roleId,
    //   },
    // }
    return apiClient.post("/starts", userData);
  },
  checkEmail(email) {
    console.log(email);
    return apiClient.get(`/starts/check?email=${email}`);
  },
  checkId(id) {
    console.log(id);
    return apiClient.get(`/starts/check-id?id=${id}`);
  },
  checkCredentials(userData) {
    console.log(userData);
    return apiClient.post("/starts/check-credentials", {
      email: userData.data.email,
      password: userData.data.password,
    });
  },

  // PUT: تحديث بيانات موجودة
  updateUser(userId, updatedData) {
    return apiClient.put(`/starts/${userId}`, updatedData);
  },

  updateRole(userId, updatedData) {
    return apiClient.put(`/starts/${userId}`, updatedData);
  },

  // DELETE: حذف مستخدم
  deleteUser(userId) {
    return apiClient.delete(`/starts/${userId}`);
  },

  sendResetPassword(userData) {
    console.log("Email to reset password:", userData);
    return apiClient.post("/forget-pass-emails", userData);
  },
  sendInvitation(userData) {
    console.log("Email to invite:", userData);
    return apiClient.post("/invitation-emails", userData);
  },
  addNewUser(userData) {
    return apiClient.post("/starts", userData);
  },

  getRols() {
    return apiClient.get("/rols").then((response) => {
      console.log("Roles from API:", response.data); // تحقق من البيانات
      return response;
    });
  },
  getPermissions() {
    return apiClient.get("/perms?populate=*");
  },

  getPermissionsByRole(role) {
    return apiClient.get(`/perms?role=${role}`);
  },
  addPermassion(permissionsData) {
    console.log("permissionsData", permissionsData);

    // إرسال البيانات إلى مسار الـ API الخاص بالصلاحيات في Strapi
    return apiClient.post("/perms", {
      data: {
        ...permissionsData, // الصلاحيات بوصفها Boolean مع companyId
      },
    });
  },

  addRoleWithPermissions(roleData) {
    console.log("roleDataapi", roleData);

    // تعديل البيانات المرسلة لتكون داخل كائن 'data' بما يتوافق مع Strapi
    const payload = {
      data: {
        name: roleData.name, // اسم الدور
        companyId: roleData.companyId, // رقم الشركة إذا كان متاحًا
        permissions: roleData.permissions, // إرسال معرفات الصلاحيات
      },
    };

    // إرسال البيانات إلى API
    return apiClient.post("/rols", payload);
  },

  addDepartment(departmentData) {
    console.log("departmentData", departmentData);
    return apiClient.post("/departments", { data: { departmentName: departmentData.departmentName, companyID: departmentData.companyId } });
  },
  getDepartments() {
    return apiClient.get("/departments");
  },
  deleteDepartment(departmentId) {
    return apiClient.delete(`/departments/${departmentId}`);
  },

  updateDepartment(id, department) {
    console.log("department data:", department);
    return apiClient.put(`/departments/${id}`, department); 
    // return apiClient.put(`/starts/${userId}`, updatedData);
// 
  },
  getPositions() {
    return apiClient.get("/positions").then((response) => {
      console.log("Positions from API:", response.data); // Verify the data
      return response;
    });
  },
  addProject(projectData) {
    console.log("Adding project:", projectData);
    return apiClient.post("/projects", { data: { neme: projectData.neme, companyID: projectData.companyId, createdOwner: projectData.createdOwner } }); // تأكد من أن الـ API يتوقع البيانات بهذا الشكل
  },
  getProjects() {
    return apiClient.get("/projects");
  },
  updateProject(project) {
    return apiClient.put(`/projects/${project.id}`, { data: { neme: project.neme } });
  },
  deleteProject(projectId) {
    return apiClient.delete(`/projects/${projectId}`);
  },
};
