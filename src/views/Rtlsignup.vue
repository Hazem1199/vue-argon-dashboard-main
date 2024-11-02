
<script setup>
import { ref, onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";

import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonSelect from "@/components/ArgonSelect.vue";
import ArgonCheckbox from "@/components/ArgonCheckbox.vue";
import ArgonButton from "@/components/ArgonButton.vue";

const body = document.getElementsByTagName("body")[0];
const store = useStore();

onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");

  // إعدادات RTL واللغة العربية
  store.state.isRTL = true;
  document.querySelector("html").setAttribute("lang", "ar");
  document.querySelector("html").setAttribute("dir", "rtl");
  document.querySelector("#app").classList.add("rtl");
});

onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");

  // إزالة إعدادات RTL واللغة العربية
  store.state.isRTL = false;
  document.querySelector("html").removeAttribute("lang");
  document.querySelector("html").removeAttribute("dir");
  document.querySelector("#app").classList.remove("rtl");
});

// تعريف المتغيرات والخيارات للـ `<argon-select>`
const selectedCompanySize = ref("");
const companySizeOptions = [
  { value: "1", label: "1-10" },
  { value: "2", label: "11-50" },
  { value: "3", label: "51-100" },
  { value: "4", label: "101-500" },
];

const selectedIndustry = ref("");
const industryOptions = [
  { value: "1", label: "المالية" },
  { value: "2", label: "التصنيع" },
  { value: "3", label: "التجزئة" },
  { value: "4", label: "أخرى" },
];
</script>

<template>
  <div class="container position-sticky top-0 z-index-sticky">
    <div class="row">
      <div class="col-12">
        <!-- تعديل الـ Navbar ليشبه الصفحة الثانية -->
        <navbar
          isBlur="blur border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          :darkMode="true"
          isBtn="bg-gradient-success"
        />
      </div>
    </div>
  </div>
  <main class="main-content mt-0">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <!-- قسم النموذج -->
            <div
              class="col-xl-4 col-lg-5 col-md-7 d-flex flex-column"
            >
              <div class="card card-plain">
                <div class="card-header text-start pb-0">
                  <h1 class="text-dark mb-2 mt-5">مهمتي</h1>
                  <h3>منظمة جديدة</h3>
                  <p class="mb-0">
                    أدخل تفاصيل مساحة عمل شركتك الجديدة
                  </p>
                </div>
                <div class="card-body">
                  <form role="form">
                    <argon-input
                      id="name"
                      type="text"
                      placeholder="اسم الشركة"
                      aria-label="اسم الشركة"
                    />
                    <argon-input
                      id="email"
                      type="email"
                      placeholder="البريد الإلكتروني"
                      aria-label="البريد الإلكتروني"
                    />
                    <argon-input
                      id="password"
                      type="password"
                      placeholder="كلمة المرور"
                      aria-label="كلمة المرور"
                    />
                    <argon-input
                      id="repeat-password"
                      type="password"
                      placeholder="تأكيد كلمة المرور"
                      aria-label="تأكيد كلمة المرور"
                    />
                    <argon-input
                      id="phone"
                      type="tel"
                      placeholder="الهاتف"
                      aria-label="الهاتف"
                    />
                    <!-- استخدام الـ argon-select للـ حجم الشركة -->
                    <argon-select
                      id="company-size"
                      v-model="selectedCompanySize"
                      :options="companySizeOptions"
                      placeholder="حجم الشركة"
                      aria-label="حجم الشركة"
                    />
                    <!-- استخدام الـ argon-select للـ الصناعة -->
                    <argon-select
                      id="industry"
                      v-model="selectedIndustry"
                      :options="industryOptions"
                      placeholder="الصناعة"
                      aria-label="الصناعة"
                    />
                    <argon-checkbox checked>
                      <label class="form-check-label" for="flexCheckDefault">
                        أوافق على
                        <a href="javascript:;" class="text-dark font-weight-bolder">
                          الشروط والأحكام
                        </a>
                      </label>
                    </argon-checkbox>
                    <div class="text-center">
                      <argon-button
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                        >تسجيل</argon-button
                      >
                    </div>
                  </form>
                </div>
                <div class="card-footer text-center px-lg-2 pt-0 px-1">
                  <p class="mb-4 text-sm mx-auto">
                    هل لديك حساب بالفعل؟
                    <a
                      href="javascript:;"
                      class="text-success text-gradient font-weight-bold"
                      >تسجيل الدخول</a
                    >
                  </p>
                </div>
              </div>
            </div>
            <!-- قسم الصورة والنص -->
            <div
              class="col-6 d-none d-lg-flex h-100 ps-0 position-absolute start-0 justify-content-center flex-column text-center my-auto top-0"
            >
              <div
                class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden bg-gradient-primary"
                style="
                  background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg');
                  background-size: cover;
                "
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4 class="mt-5 text-white font-weight-bolder position-relative">
                  "الانتباه هو العملة الجديدة"
                </h4>
                <p class="text-white position-relative">
                  كلما بدت الكتابة أكثر سهولة، كلما بذل الكاتب مجهودًا أكبر في العملية.
                </p>
              </div>
            </div>
            <!-- نهاية قسم الصورة والنص -->
          </div>
        </div>
      </div>
    </section>
  </main>
  <app-footer />
</template>
