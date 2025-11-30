<template>
  <v-container fluid>
    <v-sheet>
      <v-data-table
        :headers="headers"
        :items="filteredActivities"
        class="elevation-1"
      >
        <template #[`item.actions`]="{ item }">
          <v-btn small class="bg-primary text-white" @click="GoToMap(item)">
            Vejvisning
          </v-btn>
          <v-btn
            small
            class="bg-secondary text-white"
            @click="moveToPickedUp(item)"
          >
            Hentet
          </v-btn>
        </template>
        <template v-slot:no-data>
          Ingen aktiviteter til afhentning fundet.
        </template>
      </v-data-table>
      <br />
      <br />
      <v-divider></v-divider>
      <br />

      <v-data-table
        :headers="headers"
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
      headers: [
        { title: "Dato", key: "formattedDate" },
        { title: "Adresse", key: "user.address" },
        { title: "Antal", key: "totalAmount" },
        { title: "Beløb", key: "totalPrice" },
        { title: "", key: "actions", sortable: false },
      ],
      headers2: [{ title: "Total Antal", key: "totalAmount" }],
    };
  },

  computed: {
    filteredActivities() {
      return this.activities
        .filter((a) => a.statusId === 2)
        .map((activity) => ({
          ...activity,
          totalPrice: this.calculateTotalPrice(activity),
          totalAmount: this.calculateTotalAmount(activity),
          formattedDate: this.formatDate(activity.date),
        }));
    },
    PickedUpActivities() {
      return this.activities
        .filter((a) => a.statusId === 3)
        .map((activity) => ({
          ...activity,
          totalAmount: this.calculateTotalAmount(activity),
          totalPrice: this.calculateTotalPrice(activity),
          formattedDate: this.formatDate(activity.date),
        }));
    },
  },
  methods: {
    GetAllActivities() {
      ActivityDataService.getAll()
        .then((response) => {
          this.activities = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    moveToPickedUp(item) {
      const updatedItem = { ...item, statusId: 3 };
      ActivityDataService.update(item.activityId, updatedItem)
        .then(() => {
          this.GetAllActivities();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    GoToMap(item) {
      this.SelectedAddress = item.user.address;
      this.$router.push({
        name: "Vejvisning",
        params: { address: this.SelectedAddress },
      });
    },
    calculateTotalPrice(activity) {
      if (!activity?.activityItems) return 0;
      return activity.activityItems.reduce(
        (sum, item) => sum + item.quantity * item.product.category.price,
        0
      );
    },
    calculateTotalAmount(activity) {
      if (!activity?.activityItems) return 0;
      return activity.activityItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString();
    },
  },
  created() {
    this.GetAllActivities();
  },
};
</script>

<style scoped></style>
