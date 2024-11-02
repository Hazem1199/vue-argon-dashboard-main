<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import SidenavList from "./SidenavList.vue";
// import logo from "@/assets/img/logo-ct-dark.png";
// import logoWhite from "@/assets/img/logo-ct.png";

// const logo1Task = 'https://ik.imagekit.io/ts7pphpbz3/Subheading%20(1).png?updatedAt=1730567034766'

const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const layout = computed(() => store.state.layout);
const sidebarType = computed(() => store.state.sidebarType);
// const darkMode = computed(() => store.state.darkMode);
</script>
<template>
  <!-- <div
    v-show="layout === 'default'"
    class="min-height-300 position-absolute w-100"
    :class="`${darkMode ? 'bg-transparent' : 'bg-success'}`"
  /> -->

  <aside
    class="mx-0 overflow-auto border-0 sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl"
    :class="`${isRTL ? 'me-3 rotate-caret fixed-end' : 'fixed-start ms-3'}    
      ${
        layout === 'landing' ? 'bg-transparent shadow-none' : ' '
      } ${sidebarType}`"
    id="sidenav-main"
  >
    <div class="sidenav-header text-center">
      <router-link class="m-0 navbar-brand" to="/">
        <img
          src="https://ik.imagekit.io/ts7pphpbz3/Subheading%20(1)%20(1).png?updatedAt=1730567921316"
          class="navbar-brand-img h-100 mx-auto"
          alt="main_logo"
        />
      </router-link>
    </div>

    <!-- <i
        class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
        aria-hidden="true"
        id="iconSidenav"
      ></i> -->

      <!-- :src="darkMode || sidebarType === 'bg-default' ? logo1Task : logo" -->
        <!-- <span class="ms-2 font-weight-bold me-2">1Task</span> -->


    <hr class="mt-0 horizontal dark" />

    <sidenav-list />
  </aside>
</template>
