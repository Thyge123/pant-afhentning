<template>
  <v-bottom-navigation :elevation="5" v-if="!isOnLoginPage" grow>
    <v-btn value="home" @click="$router.push('/')">
      <v-icon>mdi-home</v-icon>
      <span>Hjem</span>
    </v-btn>

    <v-btn value="history" @click="$router.push('/min-pant')">
      <v-icon>mdi-history</v-icon>
      <span>Min Pant</span>
    </v-btn>

    <v-btn value="delivery" @click="$router.push('/afhenter')" variant="text">
      <v-icon>mdi-moped-outline</v-icon>
      <span>Afhenter</span>
    </v-btn>

    <v-btn value="profile" @click="$router.push('/min-profil')">
      <v-icon>mdi-account</v-icon>
      <span>Min Profil</span>
    </v-btn>
  </v-bottom-navigation>

  <v-fab
    v-if="!isOnScannerPage && !isOnLoginPage"
    class="centered-fab"
    icon="mdi-qrcode-scan"
    @click="$router.push('/scan')"
  ></v-fab>
</template>

<script>
  export default {
    name: "BottomMenuBar",

    computed: {
      isOnScannerPage() {
        return this.$route.path === "/scan";
      },
      isOnLoginPage() {
        const loginPaths = ["/login", "/register"];
        return loginPaths.includes(this.$route.path);
      },
    },
  };
</script>

<style scoped>
  .v-bottom-navigation {
    height: 70px !important;
  }

  .v-icon {
    font-size: 30px !important;
    color: #707070de !important;
  }

  .centered-fab {
    position: fixed !important;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999 !important;
  }
</style>
