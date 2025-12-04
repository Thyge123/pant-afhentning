<template>
  <v-app>
    <v-main>
      <BurgerMenu
        v-if="showMenu"
        :is-open="isMenuOpen"
        @toggle-menu="isMenuOpen = $event"
      />
      <NavigationHeader />
      <router-view @user-logged-in="updateLoggedInUser" />
      <BottomMenuBar />
    </v-main>
  </v-app>
</template>

<script>
import BurgerMenu from "./components/BurgerMenu.vue";
import BottomMenuBar from "./components/BottomMenuBar.vue";
import NavigationHeader from "./components/NavigationHeader.vue";
import ActivityDataService from "./services/ActivityDataService";
import { computed } from "vue";
export default {
  name: "App",
  components: {
    BurgerMenu,
    BottomMenuBar,
    NavigationHeader,
  },
  data: () => ({
    isMenuOpen: false,
    loggedInUser: null,
    activities: [],
    statusMap: {
      1: "Gemt",
      2: "Venter afhentning",
      3: "Afhentet",
      4: "Ahentet og betalt",
    },
  }),
  methods: {
    getStatusColor(status) {
      switch (status) {
        case 1:
          return "text-primary"; // Gemt
        case 2:
          return "text-warning"; // Venter afhentning
        case 3:
          return "text-alert"; // Afhentet
        case 4:
          return "text-secondary"; // Afhentet og betalt
      }
    },
    updateLoggedInUser(user) {
      this.loggedInUser = user;
      this.fetchUserActivities(user.userId);
    },
    fetchUserActivities(userId) {
      ActivityDataService.getByUser(userId)
        .then((response) => {
          this.activities = response.data;
        })
        .catch((e) => {
          console.error("Error fetching user activities:", e);
        });
    },
  },
  provide() {
    return {
      activities: computed(() => this.activities),
      statusMap: this.statusMap,
      getStatusColor: this.getStatusColor,
      loggedInUser: () => this.loggedInUser,
      refreshActivities: this.fetchUserActivities,
    };
  },

  computed: {
    showMenu() {
      const hiddenPaths = ["/login", "/register"];
      return !hiddenPaths.includes(this.$route.path.toLowerCase());
    },
    /*
    activities() {
      // Definer hvor meget hver pant type er værd
      const pantValues = {
        A: 1, // Dåser = 1 kr
        B: 1.5, // Flasker = 1.5 kr
        C: 3, // Store flasker = 3 kr
      };

      // Gå gennem hver objekt i arrayet og beregn total
      return this.pantHistory.map((entry) => {
        // Tæl det samlede antal flasker i hver entry
        const amount = entry.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        // Beregn totalprisen for hver entry
        // For hver vare: gang mængde med pantværdi
        const price = entry.items.reduce(
          (sum, item) => sum + item.quantity * pantValues[item.pant],
          0
        );

        // Returner entry med de beregnede værdier tilføjet
        return {
          ...entry, // Behold alle originale data (dato, status, varer)
          amount, // Tilføj samlet flaskantal
          price, // Tilføj totalpris
        };
      });
      
    },
    */
  },
};
</script>
