<script setup>
import { computed, ref, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const router = useRouter();


// const route = useRoute();

import SidenavItem from "./SidenavItem.vue";
// import SidenavCard from "./SidenavCard.vue";
import {
  savePermissionsToLocalStorage,
  loadPermissionsFromLocalStorage,
  hasPermission,
} from "@/utils/permissions.js"; // استيراد الوحدة

// حالة فتح/إغلاق القائمة
const showMenu = ref(false);

const store = useStore();
const isRTL = computed(() => store.state.isRTL);

// جلب بيانات المستخدم من Vuex
const userData = computed(() => store.getters.user);
console.log(userData.value);

// استدعاء الصلاحيات من localStorage بناءً على المستخدم الحالي
const permissions = ref(
  loadPermissionsFromLocalStorage(userData.value?.user?.id) || {}
);

console.log( permissions.value);

// في حال عدم وجود صلاحيات في localStorage، جلبها من Vuex
onBeforeMount(() => {
  if (!permissions.value || Object.keys(permissions.value).length === 0) {
    const userRolePermissions =
      userData.value?.user?.role?.permissions[0] || {};
    permissions.value = userRolePermissions;

    // حفظ الصلاحيات في localStorage بعد التشفير بناءً على المستخدم الحالي
    savePermissionsToLocalStorage(permissions.value, userData.value?.user?.id);
  }
});


// watch(route, () => {
//   showMenu.value = false; // أغلق القائمة عند تغيير المسار
// });

// أمثلة على استخدام الصلاحيات
const canAddUser = computed(() =>
  hasPermission(permissions.value, "canAddUser")
);

// Get route function to determine current route
const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};

const handleSignOut = () => {
  console.log("handleSignOut");
  store
    .dispatch("signOut")
    .then(() => {
      router.push({ name: "Signin" });
    })
    .catch((error) => {
      console.log(error);
    });
}

const closeMenu = () => {
  setTimeout(() => {
    showMenu.value = false;
  }, 100);
};
</script>

<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-item
          to="/dashboard-default"
          :class="getRoute() === 'dashboard-default' ? 'active' : ''"
          :navText="isRTL ? 'لوحة القيادة' : 'Dashboard'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle"
          href="#"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          @click="showMenu = !showMenu"
          @blur="closeMenu"
          :class="[showMenu ? 'show' : '', darkMode ? 'text-white' : 'text-dark']"
          id="navbarDropdown"
        >
          <i class="ni ni-single-02 text-info text-sm opacity-10 text-center"></i>
          <span class="nav-link-text ms-1">Team Work</span>
        </a>
        <ul
          :class="showMenu ? 'show' : ''"
          class="dropdown-menu dropdown-menu-right position-absolute"
          aria-labelledby="navbarDropdown"
        >
          <sidenav-item
            to="/addUser"
            v-if="canAddUser"
            :class="getRoute() === 'addUser' ? 'active' : ''"
            :navText="isRTL ? 'اضافة مستخدم' : 'add user'"
          >
            <template v-slot:icon>
              <i class="ni ni-single-02 text-primary text-sm opacity-10"></i>
            </template>
          </sidenav-item>
          <sidenav-item
            to="/team"
            v-if="canAddUser"
            :class="getRoute() === 'team' ? 'active' : ''"
            :navText="isRTL ? 'فريق' : 'Team'"
          >
            <template v-slot:icon>
              <i class="ni ni-single-02 text-primary text-sm opacity-10"></i>
            </template>
          </sidenav-item>
          <sidenav-item
            to="/add-role"
            v-if="canAddUser"
            :class="getRoute() === 'addRole' ? 'active' : ''"
            :navText="isRTL ? 'اضافة دور' : 'Add Role'"
          >
            <template v-slot:icon>
              <i class="ni ni-single-02 text-primary text-sm opacity-10"></i>
            </template>
          </sidenav-item>
          <sidenav-item
            to="/cards"
            :class="getRoute() === 'cards' ? 'active' : ''"
            :navText="isRTL ? 'الكارتات' : 'Cards'"
          >
            <template v-slot:icon>
              <i class="ni ni-app text-info text-sm opacity-10"></i>
            </template>
          </sidenav-item>
        </ul>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/department"
          :class="getRoute() === 'department' ? 'active' : ''"
          :navText="isRTL ? 'الاقسام' : 'Department'"
        >
          <template v-slot:icon>
            <i class="ni ni-building text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <!-- <li class="nav-item">
        <sidenav-item
          to="/tables"
          :class="getRoute() === 'tables' ? 'active' : ''"
          :navText="isRTL ? 'الجداول' : 'Tables'"
        >
          <template v-slot:icon>
            <i
              class="ni ni-calendar-grid-58 text-warning text-sm opacity-10"
            ></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/billing"
          :class="getRoute() === 'billing' ? 'active' : ''"
          :navText="isRTL ? 'الفواتیر' : 'Billing'"
        >
          <template v-slot:icon>
            <i class="ni ni-credit-card text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/virtual-reality"
          :class="getRoute() === 'virtual-reality' ? 'active' : ''"
          :navText="isRTL ? 'الواقع الافتراضي' : 'Virtual Reality'"
        >
          <template v-slot:icon>
            <i class="ni ni-app text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li> -->

      <!-- <li class="nav-item">
        <sidenav-item
          :to="isRTL ? '/dashboard-default' : '/rtl-page'"
          :class="
            getRoute() === (isRTL ? '/dashboard-default' : '/rtl-page')
              ? 'active'
              : ''
          "
          :navText="isRTL ? 'LTR' : 'RTL'"
        >
          <template v-slot:icon>
            <i class="ni ni-world-2 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li> -->

      <li class="mt-3 nav-item">
        <h6
          v-if="isRTL"
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        >
          صفحات المرافق
        </h6>

        <h6
          v-else
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        >
          ACCOUNT PAGES
        </h6>
      </li>

      <!-- <li class="nav-item">
        <sidenav-item
          to="/profile"
          :class="getRoute() === 'profile' ? 'active' : ''"
          :navText="isRTL ? 'حساب تعريفي' : 'Profile'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-02 text-dark text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li> -->

      <!-- <li class="nav-item">
        <sidenav-item
          to="/signin"
          :class="getRoute() === 'signin' ? 'active' : ''"
          :navText="isRTL ? 'تسجيل الدخول' : 'Sign In'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-copy-04 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li> -->

      <li class="nav-item">
        <sidenav-item
          to="/signin"
          :class="getRoute() === 'signout' ? 'active' : ''"
          :navText="isRTL ? 'تسجيل الخروج' : 'Sign Out'"
          @click="handleSignOut"
        >
          <template v-slot:icon>
            <i class="ni ni-button-power text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <!-- <li class="nav-item">
        <sidenav-item
          to="/signup"
          :class="getRoute() === 'signup' ? 'active' : ''"
          :navText="isRTL ? 'اشتراك' : 'Sign Up'"
        >
          <template v-slot:icon>
            <i class="ni ni-collection text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li> -->
    </ul>
  </div>
</template>
