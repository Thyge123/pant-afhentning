import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import homePage from "./components/homePage.vue";

import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import RegisterUser from "./components/RegisterUser.vue";
import UserLogin from "./components/UserLogin.vue";
import PantHistory from "./components/PantHistory.vue";

loadFonts();

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
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
      path: "/pant-history",
      name: "PantHistory",
      component: PantHistory,
    },
  ],
});

const app = createApp(App);

app.component("home-page", homePage);

app.use(vuetify).use(router).mount("#app");
