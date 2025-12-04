<template>
  <v-container fluid>
    <v-sheet>

      <!-- TABEL 1 -->
      <v-data-table
        :headers="headersToShow"
        :items="filteredActivities"
        class="elevation-1"
      >
        <template #[`item.actions`]="{ item }">
          <!-- Før accept -->
          <div v-if="!item.accepted && !anyAccepted">
            <v-btn small class="bg-primary text-white" @click="acceptTask(item)">
              Accepter
            </v-btn>
          </div>

          <!-- Efter accept -->
          <div v-else-if="item.accepted">
            <v-btn small class="bg-primary text-white" @click="GoToMap(item)">
              Vejvisning
            </v-btn>

            <v-btn small class="bg-secondary text-white" @click="moveToPickedUp(item)">
              Hentet
            </v-btn>
          </div>
        </template>

        <template v-slot:no-data>
          Ingen aktiviteter til afhentning fundet.
        </template>
      </v-data-table>

      <br /><br />
      <v-divider></v-divider>
      <br />

      <!-- TABEL 2 -->
      <v-data-table
        :headers="pickedHeaders"
        :items="PickedUpActivities"
        class="elevation-1 mt-4"
      >
        <template v-slot:no-data>
          Ingen afhentede aktiviteter fundet.
        </template>
      </v-data-table>

    </v-sheet>
  </v-container>
</template>

<script>
import ActivityDataService from "@/services/ActivityDataService";

export default {
  data() {
    return {
      SelectedAddress: "",
      activities: [],

      headersWithAddress: [
        { title: "Dato", key: "formattedDate" },
        { title: "Adresse", key: "user.address" },
        { title: "Antal", key: "totalAmount" },
        { title: "Beløb", key: "totalPrice" },
        { title: "", key: "actions", sortable: false },
      ],

      headersWithoutAddress: [
        { title: "Dato", key: "formattedDate" },
        { title: "Antal", key: "totalAmount" },
        { title: "Beløb", key: "totalPrice" },
        { title: "", key: "actions", sortable: false },
      ],

      pickedHeaders: [
        { title: "Dato", key: "formattedDate" },
        { title: "Adresse", key: "user.address" },
        { title: "Antal", key: "totalAmount" },
        { title: "Beløb", key: "totalPrice" }
      ]
    };
  },

  computed: {
    headersToShow() {
      return this.filteredActivities.some(a => a.accepted)
        ? this.headersWithAddress
        : this.headersWithoutAddress;
    },

    filteredActivities() {
      return this.activities
        .filter(a => a.statusId === 2 || a.statusId === 20)
        .map(activity => ({
          ...activity,
          accepted: activity.statusId === 20,
          totalAmount: this.calculateTotalAmount(activity),
          totalPrice: this.calculateTotalPrice(activity),
          formattedDate: this.formatDate(activity.date),
        }));
    },

    PickedUpActivities() {
      return this.activities
        .filter(a => a.statusId === 3)
        .map(activity => ({
          ...activity,
          totalAmount: this.calculateTotalAmount(activity),
          totalPrice: this.calculateTotalPrice(activity),
          formattedDate: this.formatDate(activity.date),
        }));
    },

    anyAccepted() {
      return this.filteredActivities.some(a => a.accepted);
    }
  },

  methods: {
    GetAllActivities() {
      ActivityDataService.getAll()
        .then(r => this.activities = r.data)
        .catch(console.log);
    },

    acceptTask(item) {
      // Opdater lokalt med det samme
      const index = this.activities.findIndex(a => a.activityId === item.activityId);
      if (index !== -1) {
        this.activities[index].statusId = 20; // accepteret
      }

      // Opdater backend
      ActivityDataService.update(item.activityId, { ...item, statusId: 20 })
        .catch(console.log);
    },

    moveToPickedUp(item) {
      // Marker lokalt som hentet
      const index = this.activities.findIndex(a => a.activityId === item.activityId);
      if (index !== -1) {
        this.activities[index].statusId = 3;
      }

      // Opdater backend
      ActivityDataService.update(item.activityId, { ...item, statusId: 3 })
        .catch(console.log);
    },

    GoToMap(item) {
      this.SelectedAddress = item.user.address;
      this.$router.push({
        name: "Vejvisning",
        params: { address: this.SelectedAddress },
      });
    },

    calculateTotalPrice(activity) {
      return activity.activityItems?.reduce(
        (sum, x) => sum + x.quantity * x.product.category.price,
        0
      ) || 0;
    },

    calculateTotalAmount(activity) {
      return activity.activityItems?.reduce((sum, x) => sum + x.quantity, 0) || 0;
    },

    formatDate(date) {
      return date ? new Date(date).toLocaleDateString() : "";
    },
  },

  created() {
    this.GetAllActivities();
  },
};
</script>

<style scoped></style>
