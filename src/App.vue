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
    pantHistory: [
      {
        id: 1,
        date: "01-01-2024",
        status: 1,
        items: [
          { type: "Faxe Kondi 0.33L", pant: "A", quantity: 30 },
          { type: "Coca Cola 0.5L", pant: "B", quantity: 20 },
          { type: "Pepsi 1.5L", pant: "C", quantity: 10 },
        ],
        pickUpDate: null,
      },
      {
        id: 2,
        date: "15-02-2024",
        status: 2,
        items: [
          { type: "Faxe Kondi 0.33L", pant: "A", quantity: 30 },
          { type: "Coca Cola 0.5L", pant: "B", quantity: 20 },
          { type: "Pepsi 1.5L", pant: "C", quantity: 10 },
        ],
        pickUpDate: "20-02-2024",
      },
      {
        id: 3,
        date: "10-03-2024",
        status: 3,
        items: [
          { type: "Faxe Kondi 0.33L", pant: "A", quantity: 30 },
          { type: "Coca Cola 0.5L", pant: "B", quantity: 20 },
          { type: "Pepsi 1.5L", pant: "C", quantity: 10 },
        ],
        pickUpDate: "07-03-2024",
      },
      {
        id: 4,
        date: "10-03-2024",
        status: 4,
        items: [
          { type: "Faxe Kondi 0.33L", pant: "A", quantity: 30 },
          { type: "Coca Cola 0.5L", pant: "B", quantity: 20 },
          { type: "Pepsi 1.5L", pant: "C", quantity: 10 },
        ],
        pickUpDate: "05-03-2024",
      },
      {
        id: 5,
        date: "10-03-2024",
        status: 4,
        items: [
          { type: "Faxe Kondi 0.33L", pant: "A", quantity: 30 },
          { type: "Coca Cola 0.5L", pant: "B", quantity: 20 },
          { type: "Pepsi 1.5L", pant: "C", quantity: 10 },
        ],
        pickUpDate: "05-03-2024",
      },
      {
        id: 6,
        date: "10-03-2024",
        status: 4,
        items: [
          { type: "Faxe Kondi 0.33L", pant: "A", quantity: 30 },
          { type: "Coca Cola 0.5L", pant: "B", quantity: 20 },
          { type: "Pepsi 1.5L", pant: "C", quantity: 10 },
        ],
        pickUpDate: "05-03-2024",
      },
    ],
    /*
      activities: [
        {
          id: 1,
          date: "2024-01-15",
          price: 153,
          status: 1, // Gemt
        },
        {
          id: 2,
          date: "2024-01-14",
          price: 89,
          status: 2, // Venter afhentning
        },
        {
          id: 3,
          date: "2024-01-13",
          price: 67,
          status: 3, // Afhentet
        },
        {
          id: 4,
          date: "2024-01-12",
          price: 124,
          status: 4, // Ahentet og betalt
        },
        {
          id: 5,
          date: "2024-01-11",
          price: 45,
          status: 4, // Ahentet og betalt
        },
        {
          id: 6,
          date: "2024-01-10",
          price: 78,
          status: 4, // Ahentet og betalt
        },
      ],
      */
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
    },
  },
  provide() {
    return {
      activities: this.activities,
      statusMap: this.statusMap,
      getStatusColor: this.getStatusColor,
      loggedInUser: () => this.loggedInUser,
    };
  },

  computed: {
    showMenu() {
      const hiddenPaths = ["/login", "/register"];
      return !hiddenPaths.includes(this.$route.path.toLowerCase());
    },
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
  },
};
</script>
