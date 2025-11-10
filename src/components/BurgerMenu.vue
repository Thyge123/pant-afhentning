<template>
  <v-app-bar :elevation="2" class="app-bar-padding">
    <v-img
      :src="imageURL"
      alt="Logo"
      max-width="100"
      contain
      class="ml-2"
      @click="$router.push('/')"
    />
    <v-spacer></v-spacer>
    <transition name="icon-fade" mode="out-in">
      <v-app-bar-nav-icon
        v-if="!isOpenLocal"
        key="menu"
        @click="toggleMenu"
        size="x-large"
        density="compact"
      ></v-app-bar-nav-icon>
      <v-btn
        v-else
        key="close"
        icon="mdi-close"
        @click="toggleMenu"
        size="x-large"
        density="compact"
        variant="text"
      ></v-btn>
    </transition>
  </v-app-bar>
  <v-navigation-drawer location="top" temporary v-model="isOpenLocal" app>
    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-home"
        link
        @click="$router.push('/')"
        title="Hjem"
      >
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-history"
        link
        @click="$router.push('/min-pant')"
        title="Pant Historik"
      >
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-moped-outline"
        link
        @click="$router.push('/')"
        title="Afhenter"
      >
      </v-list-item>
      <v-divider />
      <v-list-item
        prepend-icon="mdi-logout"
        link
        @click="logout"
        title="Log Ud"
        class="log-out"
      >
      </v-list-item>
      <!--
        <v-divider />
        <v-list-item
          prepend-icon="mdi-information-outline"
          link
          @click="$router.push('/Register')"
          title="Opret Bruger"
        >
        </v-list-item>
        <v-divider />
        <v-list-item
          prepend-icon="mdi-account-plus"
          link
          @click="$router.push('/Login')"
          title="Login"
        ></v-list-item>
        -->
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  export default {
    name: "BurgerMenu",
    props: {
      isOpen: {
        type: Boolean,
        default: false,
      },
    },
    emits: ["toggle-menu"],
    data() {
      return {
        isOpenLocal: this.isOpen,
        imageURL:
          "https://www.greatplacetowork.dk/images/Arbejdspladsprofiler/Dansk-Retursystem/Dansk-Retursystem-logo-profil.webp",
      };
    },
    methods: {
      toggleMenu() {
        this.isOpenLocal = !this.isOpenLocal;
      },
      logout() {
        this.isOpenLocal = false;
        this.$router.push("/login");
      },
    },
    watch: {
      isOpen(newVal) {
        this.isOpenLocal = newVal;
      },
      isOpenLocal(newVal) {
        this.$emit("toggle-menu", newVal);
      },
    },
  };
</script>

<style scoped>
  .app-bar-padding {
    padding: 0 10px !important;
  }
  .v-navigation-drawer {
    height: 11.5rem !important; /* 11.5 REM height */
    overflow-y: hidden !important;
  }

  /*
  ::v-deep :deep(.v-navigation-drawer__content) .v-navigation-drawer__content {
    overflow-y: hidden !important;
  }
*/
  :deep(.v-navigation-drawer__content) {
    overflow-y: hidden !important;
  }

  .log-out {
    color: red;
  }

  /*
  ::v-deep .v-list-item__spacer {
    width: 0.25rem !important;
  }
*/
  :deep(.v-list-item__spacer) {
    width: 0.25rem !important;
  }

  .icon-fade-enter-active,
  .icon-fade-leave-active {
    transition: all 0.3s ease;
  }

  .icon-fade-enter-from {
    opacity: 0;
  }

  .icon-fade-leave-to {
    opacity: 0;
  }

  .icon-fade-enter-to,
  .icon-fade-leave-from {
    opacity: 1;
  }
</style>
