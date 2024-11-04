import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import ErrorPage from "@/views/ErrorPage.vue"; // صفحة خطأ

const routes = [
  {
    src: "/.*",
    dest: "/index.html",
  },
  {
    path: "/",
    name: "/",
    component: () => import("../views/Start.vue"),
  },
  {
    path: "/dashboard-default",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
  },
  {
    path: "/virtual-reality",
    name: "Virtual Reality",
    component: VirtualReality,
  },
  {
    path: "/rtl-page",
    name: "RTL",
    component: RTL,
  },
  {
    path: "/signup-Ar",
    name: "SignupArabic",
    component: () => import("../views/Rtlsignup.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/start",
    name: "start",
    component: () => import("../views/Start.vue"),
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("../views/ForgotPassword.vue"),
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("../views/ResetPassword.vue"),
  },
  {
    path: "/icon",
    name: "icon",
    component: () => import("../views/icon.vue"),
  },
  {
    path: "/addUser",
    name: "add user",
    component: () => import("@/views/AddUser.vue"),
  },
  {
    path: "/user-information",
    name: "user information",
    component: () => import("@/views/userInformation.vue"),
  },
  {
    path: "/team",
    name: "team",
    component: () => import("@/views/Team.vue"),
  },
  {
    path: "/add-role",
    name: "add role",
    component: () => import("@/views/AddRole.vue"),
  },
  {
    path: "/error",
    name: "Error",
    component: ErrorPage, // صفحة الخطأ
  },
];

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_URL),
  routes,
  linkActiveClass: "active",
});

// وظيفة للتحقق من بيانات Local Storage
function isUserAuthenticated() {
  // تحقق إذا كانت البيانات موجودة في Local Storage
  const user = localStorage.getItem("user");
  return !!user; // ترجع true إذا كان المستخدم مسجلاً، وإلا false
}

// حارس لكل التنقلات
router.beforeEach((to, from, next) => {
  const isAuthenticated = isUserAuthenticated();

  // إذا كان المستخدم مسجلاً ويحاول العودة إلى صفحة تسجيل الدخول أو الصفحة الرئيسية
  if (isAuthenticated && (to.name === "Signin" || to.name === "/")) {
    next({ name: "Error" }); // توجيه المستخدم إلى صفحة خطأ
  } 
  else if (!isAuthenticated && to.name !== "Signin" && to.name !== "Signup") {
    // إذا لم يكن المستخدم مسجلاً ويحاول الوصول لصفحات أخرى غير تسجيل الدخول أو التسجيل
    localStorage.clear();
    next({ name: "Signin" }); // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
  } else {
    next(); // السماح بالانتقال
  }
});

export default router;