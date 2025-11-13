<template>
  <v-bottom-navigation :elevation="5" v-if="!isOnLoginPage" grow>
    <v-btn
      value="home"
      @click="$router.push('/')"
      :class="{ 'active-nav': $route.path === '/' }"
    >
      <v-icon>mdi-home</v-icon>
      <span>Hjem</span>
    </v-btn>

    <v-btn
      value="history"
      @click="$router.push('/min-pant')"
      :class="{ 'active-nav': $route.path === '/min-pant' }"
    >
      <v-icon>mdi-recycle-variant</v-icon>
      <span>Min Pant</span>
    </v-btn>

    <v-btn
      value="delivery"
      @click="$router.push('/afhenter')"
      :class="{ 'active-nav': $route.path === '/afhenter' }"
      variant="text"
    >
      <v-icon>mdi-truck-fast</v-icon>
      <span>Afhenter</span>
    </v-btn>

    <v-btn
      value="profile"
      @click="$router.push('/min-profil')"
      :class="{ 'active-nav': $route.path === '/min-profil' }"
    >
      <v-icon>mdi-account</v-icon>
      <span>Profil</span>
    </v-btn>
  </v-bottom-navigation>

  <v-fab
    v-if="!isOnScannerPage && !isOnLoginPage"
    class="centered-fab"
    icon="mdi-barcode-scan"
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
  .fade-in {
    animation: fadeIn 0.5s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
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

  .active-nav {
    background-color: rgba(147, 193, 78, 0.1) !important;
  }

  .active-nav .v-icon {
    color: #93c14e !important;
    animation: bounce 0.3s ease;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }
</style>
