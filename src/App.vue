<template>
  <v-app>
    <v-main>
      <router-view />
      <BurgerMenu
        v-if="showMenu"
        :is-open="isMenuOpen"
        @toggle-menu="isMenuOpen = $event"
      />
    </v-main>
  </v-app>
</template>

<script>
  import BurgerMenu from "./components/BurgerMenu.vue";
  export default {
    name: "App",
    components: {
      BurgerMenu,
    },

    data: () => ({
      isMenuOpen: false,
    }),
    computed: {
      showMenu() {
        const hiddenPaths = ["/login", "/register"];
        return !hiddenPaths.includes(this.$route.path.toLowerCase());
      },
    },
  };
</script>
