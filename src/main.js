import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";

import RegisterUser from "./Pages/RegisterUser.vue";
import UserLogin from "./Pages/UserLogin.vue";

import HomePage from "./Pages/HomeView.vue";
import PantHistory from "./Pages/PantHistory.vue";
import barcodeScanner from "./Pages/barcodeScanner.vue";
import PantDetails from "./Pages/PantDetails.vue";
import AfhenterPage from "./Pages/AfhenterPage.vue";
import VejvisningPage from "./Pages/VejvisningPage.vue";
import MyProfile from "./Pages/MyProfile.vue";

import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import ImageBarcodeReader from "./components/barcodeScanner/ImageBarcodeReader.vue";
import StreamBarcodeReader from "./components/barcodeScanner/StreamBarcodeReader.vue";

export { ImageBarcodeReader, StreamBarcodeReader };

loadFonts();
// Navigation guards or additional router configuration can go here
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/register",
      name: "RegisterUser",
      component: RegisterUser,
    },
    {
      path: "/login",
      name: "UserLogin",
      component: UserLogin,
    },
    {
      path: "/min-pant",
      name: "PantHistory",
      component: PantHistory,
    },
    {
      path: "/scanning/:id",
      name: "scanning",
      component: PantDetails,
    },
    {
      path: "/scan",
      name: "scan",
      component: barcodeScanner,
    },
    {
      path: "/afhenter",
      name: "Afhenter",
      component: AfhenterPage,
    },
    {
      path: "/vejvisning/:address",
      name: "Vejvisning",
      component: VejvisningPage,
    },
    {
      path: "/min-profil",
      name: "MyProfile",
      component: MyProfile,
    },
    {
      path: "/admin",
      component: () => import("@/Pages/Admin/AdminLayout.vue"),
      redirect: "/admin/home",
      children: [
        {
          path: "home",
          name: "admin-home",
          component: () => import("@/Pages/Admin/HomeAdmin.vue"),
        },
        {
          path: "users",
          name: "admin-users",
          component: () => import("@/Pages/Admin/UsersAdmin.vue"),
        },
        {
          path: "scanninger",
          name: "admin-scanninger",
          component: () => import("@/Pages/Admin/ScanningerAdmin.vue"),
        },
        {
          path: "categories",
          name: "admin-categories",
          component: () => import("@/Pages/Admin/PantCategoryAdmin.vue"),
        },
      ],
    },
  ],
});

const app = createApp(App);

app.use(vuetify).use(router).mount("#app");
