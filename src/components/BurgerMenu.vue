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
      <v-list-item prepend-icon="mdi-information-outline" link title="Om appen">
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-help-circle-outline"
        link
        title="Hvordan virker det?"
      >
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-cash-multiple"
        link
        @click="showPricesDialog"
        title="Pant priser"
      >
      </v-list-item>
      <v-list-item prepend-icon="mdi-phone-outline" link title="Kontakt os">
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-account"
        @click="$router.push('/admin/home')"
        link
        title="Admin"
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
    </v-list>
  </v-navigation-drawer>

  <v-dialog v-model="pricesDialog" max-width="500">
    <v-card class="pa-0">
      <v-card-title
        class="text-h5 pa-6 bg-primary text-white d-flex align-center"
      >
        <v-icon icon="mdi-cash-multiple" class="mr-3" size="large"></v-icon>
        <span>Pant priser</span>
      </v-card-title>
      <v-card-text class="pa-6">
        <p class="text-body-2 mb-6 text-medium-emphasis">
          Her er en oversigt over pant priserne for de forskellige typer
          emballage:
        </p>
        <v-list class="pa-0 transparent">
          <v-list-item class="px-0 py-3 mb-2">
            <template v-slot:prepend>
              <v-chip
                color="primary"
                size="large"
                class="mr-3 font-weight-bold"
              >
                A
              </v-chip>
            </template>
            <v-list-item-title class="text-body-1 font-weight-medium">
              Dåser
            </v-list-item-title>
            <template v-slot:append>
              <span class="text-h6 font-weight-bold text-primary">1,00 kr</span>
            </template>
          </v-list-item>

          <v-divider class="my-3"></v-divider>

          <v-list-item class="px-0 py-3 mb-2">
            <template v-slot:prepend>
              <v-chip
                color="primary"
                size="large"
                class="mr-3 font-weight-bold"
              >
                B
              </v-chip>
            </template>
            <v-list-item-title class="text-body-1 font-weight-medium">
              Flasker
            </v-list-item-title>
            <template v-slot:append>
              <span class="text-h6 font-weight-bold text-primary">1,50 kr</span>
            </template>
          </v-list-item>

          <v-divider class="my-3"></v-divider>

          <v-list-item class="px-0 py-3">
            <template v-slot:prepend>
              <v-chip
                color="primary"
                size="large"
                class="mr-3 font-weight-bold"
              >
                C
              </v-chip>
            </template>
            <v-list-item-title class="text-body-1 font-weight-medium">
              Store flasker
            </v-list-item-title>
            <template v-slot:append>
              <span class="text-h6 font-weight-bold text-primary">3,00 kr</span>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="elevated"
          @click="pricesDialog = false"
          size="large"
          class="px-8"
        >
          Luk
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
      pricesDialog: false,
      imageURL:
        "https://www.greatplacetowork.dk/images/Arbejdspladsprofiler/Dansk-Retursystem/Dansk-Retursystem-logo-profil.webp",
    };
  },
  methods: {
    toggleMenu() {
      this.isOpenLocal = !this.isOpenLocal;
    },
    showPricesDialog() {
      this.isOpenLocal = false;
      this.pricesDialog = true;
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
  height: 14.25rem !important; /* 11.5 REM height */
  overflow-y: hidden !important;
}

:deep(.v-navigation-drawer__content) {
  overflow-y: hidden !important;
}

.log-out {
  color: red;
}

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

.transparent {
  background-color: transparent !important;
}

.v-dialog .v-card {
  border-radius: 8px !important;
}
</style>
