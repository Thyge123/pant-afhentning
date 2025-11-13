<template>
  <v-app-bar
    v-if="showBackButton"
    color="primary"
    density="compact"
    elevation="2"
  >
    <v-btn icon @click="goBack" size="small">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
  </v-app-bar>
</template>

<script>
export default {
  name: "NavigationHeader",
  computed: {
    showBackButton() {
      // Hide on home page and auth pages
      const hiddenPaths = ["/", "/home", "/login", "/register", "/min-profil"];
      return !hiddenPaths.includes(this.$route.path.toLowerCase());
    },
    pageTitle() {
      const titles = {
        "/scanning/": "Pant Detaljer",
        "/scan": "Scanner",
        "/min-pant": "Min Pant",
        "/profil": "Min Profil",
        "/afhenter": "Afhenter",
        "/vejvisning": "Vejvisning",
      };

      // Check if current path starts with any of the keys
      // Order matters - check more specific paths first
      for (const [path, title] of Object.entries(titles)) {
        if (this.$route.path.startsWith(path)) {
          return title;
        }
      }

      return ""; // Default empty title
    },
  },
  methods: {
    goBack() {
      // Check if there's history to go back to
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        // Fallback to home if no history
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
.v-toolbar-title {
  font-size: 1rem;
  font-weight: 500;
}
</style>
