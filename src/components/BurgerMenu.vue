<template>
  <div class="burger-menu">
    <v-app-bar-nav-icon @click="toggleMenu"></v-app-bar-nav-icon>
    <v-navigation-drawer location="bottom" temporary v-model="isOpenLocal" app>
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
          @click="$router.push('/pant-history')"
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
          @click="$router.push('/')"
          title="Log Ud"
          class="log-out"
        >
        </v-list-item>
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
      </v-list>
    </v-navigation-drawer>
  </div>
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
    data() {
      return {
        isOpenLocal: this.isOpen,
      };
    },
    methods: {
      toggleMenu() {
        this.isOpenLocal = !this.isOpenLocal;
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
  .burger-menu {
    width: 50px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 45px;
    float: right;
  }

  .v-navigation-drawer {
    height: 17rem !important; /* 12 REM height */
    overflow-y: hidden !important;
  }

  ::v-deep .v-navigation-drawer__content {
    overflow-y: hidden !important;
  }

  .log-out {
    color: red;
  }

  ::v-deep .v-list-item__spacer {
    width: 0.25rem !important;
  }
</style>
