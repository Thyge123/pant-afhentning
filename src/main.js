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
import PantLocations from "./Pages/PantLocations.vue";

import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import ImageBarcodeReader from "./components/barcodeScanner/ImageBarcodeReader.vue";
import StreamBarcodeReader from "./components/barcodeScanner/StreamBarcodeReader.vue";
import VueGoogleMaps from '@fawmi/vue-google-maps'

export { ImageBarcodeReader, StreamBarcodeReader };

loadFonts();

// Suppress Google Maps deprecation warning for Marker and RetiredVersion warning
const originalWarn = console.warn;
console.warn = function(...args) {
  if (args[0] && typeof args[0] === 'string') {
    if (args[0].includes('google.maps.Marker is deprecated') ||
        args[0].includes('Google Maps JavaScript API warning: RetiredVersion')) {
      return;
    }
  }
  originalWarn.apply(console, args);
};

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
      path: "/pant-locations",
      name: "PantLocations",
      component: PantLocations,
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
        {
          path: "activity-statuses",
          name: "admin-activity-statuses",
          component: () => import("@/Pages/Admin/ActivityStatusAdmin.vue"),
        },
        {
          path: "products",
          name: "admin-products",
          component: () => import("@/Pages/Admin/ProductsAdmin.vue"),
        },
        {
          path: "report-reasons",
          name: "admin-report-reasons",
          component: () => import("@/Pages/Admin/ReportReasonAdmin.vue"),
        },
        {
          path: "reports",
          name: "admin-reports",
          component: () => import("@/Pages/Admin/ReportAdmin.vue"),
        },
        {
          path: "activity-items",
          name: "admin-activity-items",
          component: () => import("@/Pages/Admin/ActivityItemAdmin.vue"),
        },
      ],
    },
  ],
});

const app = createApp(App);

app.use(vuetify).use(router).use(VueGoogleMaps, {
    load: {
        key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
        loading: 'async',
        defer: true,
        libraries: 'marker',
        v: '3.56',
        // language: 'dk',
    },
}).mount("#app");
