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
    return apiClient.get("/rols");
  },
  getPermissions() {
    return apiClient.get("/perms?populate=*");
  },

  getPermissionsByRole(role) {
    return apiClient.get(`/perms?role=${role}`);
  },
};
