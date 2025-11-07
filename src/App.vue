<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
  export default {
    name: "App",

    data() {
      return {
        activities: [
            {
            id: 1,
            date: '2024-01-15',
            price: 153,
            status: 1 // Gemt
            },
            {
            id: 2,
            date: '2024-01-14',
            price: 89,
            status: 2 // Venter afhentning
            },
            {
            id: 3,
            date: '2024-01-13',
            price: 67,
            status: 3 // Afhentet
            },
            {
            id: 4,
            date: '2024-01-12',
            price: 124,
            status: 4 // Ahentet og betalt
            },
            {
            id: 5,
            date: '2024-01-11',
            price: 45,
            status: 4 // Ahentet og betalt
            },
            {
            id: 6,
            date: '2024-01-10',
            price: 78,
            status: 4 // Ahentet og betalt
            }
        ],
        statusMap: {
          1: 'Gemt',
          2: 'Venter afhentning',
          3: 'Afhentet',
          4: 'Ahentet og betalt'
        }
      };
    },
    methods: {
      getStatusColor(status) {
        switch(status) {
          case 1:
            return 'text-primary'; // Gemt
          case 2:
            return 'text-warning'; // Venter afhentning
          case 3:
            return 'text-alert'; // Afhentet
          case 4:
            return 'text-secondary'; // Afhentet og betalt
        }
      }
    },
    provide() {
      return {
        activities: this.activities,
        statusMap: this.statusMap,
        getStatusColor: this.getStatusColor
      };
    }
  };
</script>
