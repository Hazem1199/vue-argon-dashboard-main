// src/store/index.js
import { createStore } from "vuex";
import apiClient from "@/services/apiService"; // الاستيراد الصحيح

// دوال التشفير وفك التشفير
const encryptData = (data) => {
  return btoa(encodeURIComponent(JSON.stringify(data)));
};

const decryptData = (encryptedData) => {
  try {
    return JSON.parse(decodeURIComponent(atob(encryptedData)));
  } catch (error) {
    console.error("Error decrypting data:", error);
    return null;
  }
};

export default createStore({
  state: {
    hideConfigButton: false,
    isPinned: false,
    showConfig: false,
    sidebarType: "bg-white",
    isRTL: localStorage.getItem("language") === "ar",
    mcolor: "",
    darkMode: false,
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    layout: "default",
    language: localStorage.getItem("language") || "en",
    email: "",
    companyEmail: "",
    companyId: null,
    user: null,
    permId: null,
    userId: null, // هنا سيتم حفظ الـ id
    dataFromApi: [],
    roles: [],
    updateRole: [],
    nameOfRoles: [],
    permissions: [],
    token:
      "d2d25b8a0d6f8fa0ebce3488fc1f4dfcd8703b6cc43c48d6ce673428a05a6d36c51ce3af8e8689e5afcb9f00676e9065be21d14760243ce2ac551d67dfd5f73e77aeee80b23a0b922cda371315eb7d3b6fad6b70ee0aa91872caae7c30d0d0485502ad0c37881eecd3b8eeadee651adaed3075ecde115934c16b3e85fc0c2f61", // إضافة الـ token هنا
  },
  mutations: {
    // تحميل بيانات المستخدم من `localStorage` عند بدء التشغيل
    LOAD_USER_FROM_STORAGE(state) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        state.user = decryptData(storedUser);
      }
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        state.userId = decryptData(storedUserId);
      }
      const storedCompanyId = localStorage.getItem("companyId");
      console.log("storedCompanyId", storedCompanyId);
      if (storedCompanyId) {
        state.companyId = decryptData(storedCompanyId);
      }
      const storedEmail = localStorage.getItem("email");
      if (storedEmail) {
        state.email = decryptData(storedEmail);
      }
      const storedName = localStorage.getItem("userName");
      if (storedName) {
        state.name = decryptData(storedName);
      }
    },

    // حفظ بيانات المستخدم الجديدة مع تصفير البيانات القديمة
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem("user", encryptData(user));
      // localStorage.setItem("userName", encryptData(user.user.name));
      // localStorage.setItem("name1", user.user.name);
      sessionStorage.setItem("role", user.user.role.name);
    },
    SET_USER_ID(state, id) {
      state.userId = id;
      localStorage.setItem("userId1", id);
      localStorage.setItem("userId", encryptData(id));
    },
    SET_COMPANY_ID(state, id) {
      console.log("companyId", id);
      state.companyId = id;
      localStorage.setItem("companyId1", id);
      localStorage.setItem("companyId", encryptData(id));
    },
    SET_PERMISSIONS(state, permissions) {
      state.permissions = permissions;
      localStorage.setItem("permissions", encryptData(permissions));
    },
    SET_USER_Name(state, name) {
      state.name = name;
      localStorage.setItem("userName", encryptData(name));
    },
    // إزالة بيانات المستخدم من Vuex و LocalStorage عند تسجيل خروج أو تسجيل مستخدم جديد
    CLEAR_USER_DATA(state) {
      state.user = null;
      state.userId = null;
      state.companyId = null;
      state.permissions = [];
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("companyId");
      localStorage.removeItem("permissions");
    },
    toggleConfigurator(state) {
      state.showConfig = !state.showConfig;
    },
    sidebarMinimize(state) {
      let sidenav_show = document.querySelector("#app");
      if (state.isPinned) {
        sidenav_show.classList.add("g-sidenav-hidden");
        sidenav_show.classList.remove("g-sidenav-pinned");
        state.isPinned = false;
      } else {
        sidenav_show.classList.add("g-sidenav-pinned");
        sidenav_show.classList.remove("g-sidenav-hidden");
        state.isPinned = true;
      }
    },
    // SET_USER_ID(state, id) {
    //   console.log("id", id);
    //   state.userId = id; // تخزين الـ id
    //   localStorage.setItem("userId", id);
    // },
    sidebarType(state, payload) {
      state.sidebarType = payload;
    },
    navbarFixed(state) {
      state.isNavFixed = !state.isNavFixed;
    },
    SET_LANGUAGE(state, payload) {
      state.language = payload;
      state.isRTL = payload === "ar";
      localStorage.setItem("language", payload);
    },
    SET_EMAIL(state, email) {
      state.email = email;
      localStorage.setItem("email", encryptData(email));
    },
    SET_Company_Email(state, email) {
      console.log("companyEmail :", email);
      state.companyEmail = email;
    },
    REMOVE_USER(state) {
      state.user = null;
    },
    // SET_COMPANY_ID(state, id) {
    //   state.companyId = id;
    //   localStorage.setItem("companyId", id);
    // },
    LOAD_COMPANY_ID(state) {
      const storedCompanyId = localStorage.getItem("companyId");
      if (storedCompanyId) {
        state.companyId = storedCompanyId; // استرجاع الـ companyId من localStorage عند تحميل التطبيق
      }
    },
    // SET_USER(state, user) {
    //   sessionStorage.clear();
    //   console.log("user" + user.user);
    //   state.user = user;
    //   sessionStorage.setItem("role", user.user.role.name);
    //   // sessionStorage.setItem("companyId", user.user.companyId);
    // },
    SET_USER_ROLES(state, roles) {
      state.updateRole = roles;
    },
    SET_TOKEN(state, token) {
      state.token = token; // لتحديث الـ token
    },
    SET_DATA_FROM_API(state, data) {
      console.log(data);
      state.dataFromApi = data;
    },
    SET_ROLES(state, roles) {
      // console.log("roles", roles);
      state.roles = roles;
    },
    SET_PERMISSIONS_ID(state, permId) {
      state.permId = permId;
    },
    SET_NAME_OF_ROLES(state, nameOfRoles) {
      console.log("nameOfRoles", nameOfRoles);
      state.nameOfRoles = nameOfRoles;
    },
    // SET_PERMISSIONS(state, permissions) {
    //   state.permissions = permissions;
    // },
  },
  actions: {
    toggleSidebarColor({ commit }, payload) {
      commit("sidebarType", payload);
    },
    changeLanguage({ commit }, language) {
      commit("SET_LANGUAGE", language);
    },
    async checkEmailExists({ commit }, email) {
      try {
        // إرسال البريد الإلكتروني للتحقق مما إذا كان موجودًا
        const response = await apiClient.checkEmail(email);
        commit("SET_EMAIL", email);
        commit("SET_USER_ID", response.data.ids);
        console.log("response.data.exists:", response.data);
        return response.data.exists; // تأكيد إذا كان البريد الإلكتروني مسجلًا
      } catch (error) {
        console.error("Error checking email:", error);
        throw error;
      }
    },

    async checkIdExists({ commit }, id) {
      try {
        // إرسال البريد الإلكتروني للتحقق مما إذا كان موجودًا
        const response = await apiClient.checkId(id);
        commit("SET_USER_ID", id);
        console.log("response.data.exists:", response.data);
        return response.data.exists; // تأكيد إذا كان البريد الإلكتروني مسجلًا
      } catch (error) {
        console.error("Error checking email:", error);
        throw error;
      }
    },

    async submitEmail({ commit }, formData) {
      console.log( " formData : " ,formData);
      try {
        // إرسال البريد الإلكتروني إلى الخادم
        const response = await apiClient.addEmail( formData  );
        console.log("response.data:", response.data);
        console.log("response.data.data:", response.data.data);
        console.log("response.data.data.id:", response.data.data.id);

        commit("SET_EMAIL", response.data.data.email);
        commit("SET_USER_ID", response.data.data.id); // تخزين الـ id من الاستجابة
      } catch (error) {
        console.error(
          "Error submitting email:",
          error.response ? error.response.data : error.message
        );
      }
    },

    async addUserInfo(context, formData) {
      try {
        console.log("Data received in Vuex Action:", formData);

        // إرسال البيانات إلى API
        const response = await apiClient.addNewUser(formData);
        console.log("response.data:", response.data);

        // يمكنك إضافة أي عمليات تخزين في الـ state إذا لزم الأمر
      } catch (error) {
        console.error(
          "Error submitting user info:",
          error.response ? error.response.data : error.message
        );
        throw error; // يمكنك إعادة رمي الخطأ ليتم التقاطه في المكون
      }
    },

    async updateUserData({ commit }, { userId, formData }) {
      try {
        const userData = { data: { ...formData } };
        const response = await apiClient.updateUser(userId, userData);
        commit("SET_USER", response.data);
        console.log("User data updated:", response.data);
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    },

    async updateRole({ commit }, { userId, roleId, userName }) {
      try {
        const userData = { data: { role: roleId, name: userName } };
        const response = await apiClient.updateRole(userId, userData);
        console.log("Role updated:", response.data);
        if (response.data.success) {
          // إذا كانت البيانات صحيحة
          commit("SET_USER_ROLES", response.data);
          return { success: true };
        } else {
          // إذا كانت البيانات غير صحيحة
          return { success: false };
        }
      } catch (error) {
        console.error("Error updating role:", error);
        throw error;
      }
    },

    async deleteEmployee({ commit }, userId) {
      try {
        const response = await apiClient.deleteUser(userId);
        console.log("User deleted:", response.data);
        commit("REMOVE_USER", userId);
        return response.data;
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    },

    async updatePassword({ commit }, { userId, password }) {
      try {
        const userData = { data: { password: password } };
        const response = await apiClient.updateUser(userId, userData);
        console.log("Password updated:", response.data);
        if (response.data.success) {
          // إذا كانت البيانات صحيحة
          commit("SET_USER", response.data);
          return { success: true };
        } else {
          // إذا كانت البيانات غير صحيحة
          return { success: false };
        }
      } catch (error) {
        console.error("Error updating password:", error);
      }
    },
    async fetchDataFromApi({ commit }) {
      try {
        const response = await apiClient.getUsers();
        commit("SET_DATA_FROM_API", response.data.data);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      }
    },
    async submitCompanyData({ commit }, companyData) {
      try {
        // إرسال بيانات الشركة إلى الخادم
        const response = await apiClient.addCompanyData(companyData);
        commit("SET_USER", response.data);
        console.log("Company data submitted successfully:", response.data);
      } catch (error) {
        console.error(
          "Error submitting company data:",
          error.response ? error.response.data : error.message
        );
      }
    },
    async signIn({ commit }, { email, password }) {
      try {
        const response = await apiClient.checkCredentials({
          data: { email, password },
        });

        if (response.data.success) {
          // مسح البيانات السابقة قبل تعيين الجديدة
          commit("CLEAR_USER_DATA");

          // تعيين البيانات الجديدة
          commit("SET_USER", response.data);
          commit("SET_USER_ID", response.data.user.id);
          commit("SET_COMPANY_ID", response.data.user.companyId);
          commit("SET_PERMISSIONS", response.data.user.permissions);
          commit("SET_EMAIL", response.data.user.email);
          commit("SET_USER_Name", response.data.user.name);

          return { success: true };
        } else {
          return { success: false, message: response.data.message };
        }
      } catch (error) {
        console.error("Error logging in:", error);
        return {
          success: false,
          message: "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى لاحقًا.",
        };
      }
    },

    async sendResetPassword({ commit }, userData) {
      console.log(userData);
      try {
        // إرسال البريد الإلكتروني إلى الخادم
        const response = await apiClient.sendResetPassword({
          data: {
            email: userData.email,
            email_id: userData.email_id,
          },
        });

        console.log("response.data:", response.data);
        console.log("response.data.data:", response.data.data);
        console.log("response.data.data.id:", response.data.data.id);

        commit("SET_EMAIL", response.data.data.email);
        // يمكنك إضافة المزيد من العمليات حسب الحاجة، مثل تحديث userId
      } catch (error) {
        console.error(
          "Error submitting email:",
          error.response ? error.response.data : error.message
        );
      }
    },

    async sendInvitation({ commit }, userData) {
      console.log(userData);
      try {
        // إرسال البريد الإلكتروني إلى الخادم
        const response = await apiClient.sendInvitation({
          data: {
            email: userData.email,
            email_id: userData.emailId,
          },
        });

        console.log("response.data:", response.data);
        console.log("response.data.data:", response.data.data);
        console.log("response.data.data.id:", response.data.data.id);

        commit("SET_EMAIL", response.data.data.email);
        // يمكنك إضافة المزيد من العمليات حسب الحاجة، مثل تحديث userId
      } catch (error) {
        console.error(
          "Error submitting email:",
          error.response ? error.response.data : error.message
        );
      }
    },

    async fetchRoles({ commit }) {
      try {
        const response = await apiClient.getRols(); // جلب الأدوار من الـ API
        console.log("Fetched roles:", response.data); // طباعة البيانات للتحقق
        commit("SET_ROLES", response.data.data); // تخزين الأدوار في state
        commit(
          "SET_NAME_OF_ROLES",
          response.data.data.map((item) => item.name)
        ); // تخزين الأدوار في state
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    },
    async fetchPermissions({ commit }) {
      try {
        const response = await apiClient.getPermissions();
        commit("SET_PERMISSIONS", response.data.data); // حفظ الأذونات في الـ state
        return response.data.data; // إعادة البيانات لاستخدامها في المكونات
      } catch (error) {
        console.error("Error fetching permissions:", error);
        throw error;
      }
    },

    async addRoleWithPermissions({ commit }, roleData) {
      try {
        const response = await apiClient.addRoleWithPermissions(roleData);
        console.log("Role and permissions added:", response.data);

        commit("SET_ROLES", response.data); // تحديث الأدوار في الـ state إذا لزم الأمر
      } catch (error) {
        console.error("Error adding role and permissions:", error);
        throw error;
      }
    },
    async addPermissions({ commit }, permissionsData) {
      try {
        // استدعاء API لإضافة الصلاحيات
        const response = await apiClient.addPermassion(permissionsData);
        console.log("Permissions added:", response.data);
        console.log("id Permissions added:", response.data.id);

        // تحديث الأدوار في الـ state إذا لزم الأمر
        commit("SET_PERMISSIONS_ID", response.data.id);

        // إرجاع معرفات الصلاحيات المحفوظة
        return response.data.id;
      } catch (error) {
        console.error("Error adding permissions:", error);
        throw error;
      }
    },

    async fetchPermissionsByRole({ commit }, role) {
      try {
        // استخدام API لجلب الصلاحيات بناءً على الدور الحالي
        const response = await apiClient.getPermissionsByRole(role);
        commit("SET_PERMISSIONS", response.data);
        console.log("Permissions fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching permissions by role:", error);
      }
    },

    async signOut() {
      localStorage.clear();
      sessionStorage.clear();
    },

    setEmail({ commit }, email) {
      commit("SET_EMAIL", email);
    },
    setToken({ commit }, token) {
      // لتعيين الـ token (يمكن استخدامه عند تسجيل الدخول)
      commit("SET_TOKEN", token);
    },
    setUser({ commit }, user) {
      commit("SET_USER", user);
    },
    setDataFromApi({ commit }, data) {
      commit("SET_DATA_FROM_API", data);
    },
    setUserId({ commit }, userId) {
      // لتعيين الـ id (يمكن استخدامه عند تسجيل الدخول)
      commit("SET_USER_ID", userId);
    },
    loadCompanyId({ commit }) {
      commit("LOAD_COMPANY_ID");
    },
  },

  getters: {
    currentLanguage: (state) => state.language,
    isRTL: (state) => state.isRTL,
    email: (state) => state.email,
    user: (state) => state.user,
    token: (state) => state.token,
    dataFromApi: (state) => state.dataFromApi,
    userId: (state) => state.userId,
    companyEmail: (state) => state.companyEmail,
    companyId: (state) => state.companyId,
    roles: (state) => state.roles,
    permissions: (state) => state.permissions,
    nameOfRoles: (state) => state.nameOfRoles,
    updateRole: (state) => state.updateRole,
    permId: (state) => state.permId,
    userName: (state) => state.name,
  },
});
