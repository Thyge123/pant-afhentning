import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";

import RegisterUser from "./components/RegisterUser.vue";
import UserLogin from "./components/UserLogin.vue";

import homePage from "./components/homePage.vue";
import PantHistory from "./components/PantHistory.vue";
import barcodeScanner from "./components/barcodeScanner.vue";
import PantDetails from "./components/PantDetails.vue";

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
      component: homePage,
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
  ],
});

const app = createApp(App);

app.component("home-page", homePage);
app.component("barcode-scanner", barcodeScanner);

app.use(vuetify).use(router).mount("#app");
