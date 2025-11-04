import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

loadFonts();

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [],
});

createApp(App).use(vuetify).use(router).mount("#app");
