<template>
  <v-dialog width="auto" transition="dialog-bottom-transition">
    <v-card
      prepend-icon="mdi-truck-fast"
      text="Vælg hvilken aktivitet du ønsker at anmode om afhentning for."
      title="Anmod om afhentning"
    >
      <v-btn
        density="compact"
        icon="mdi-close"
        @click="closeDialog"
        class="close-button"
        variant="text"
      ></v-btn>
      <v-tooltip text="Minimumspris for afhentning er 100 kr." location="top">
        <template v-slot:activator="{ props }">
          <v-select
            label="Select"
            :items="selectItems"
            item-title="title"
            item-value="value"
            variant="outlined"
            dense
            v-model="selectedActivity"
            return-object
            v-bind="props"
          ></v-select>
        </template>
      </v-tooltip>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">Annuller</v-btn>
        <v-btn color="primary" @click="confirmPickUp">Bekræft</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ActivityDataService from "@/services/ActivityDataService";
export default {
  name: "OrderPickUpModal",
  inject: ["activities"],
  emits: ["close-dialog", "activity-updated"],
  data() {
    return {
      selectedActivity: null,
    };
  },

  computed: {
    SavedActivities() {
      return this.activities.filter((activity) => activity.status === 1);
    },
    selectItems() {
      return this.SavedActivities.map((activity) => ({
        title: `#${activity.activityId} - ${new Date(
          activity.date
        ).toLocaleDateString()} - ${this.totalPrice} kr.`,
        value: activity.activityId,
        //disabled: this.totalPrice < 100,
      }));
    },
    totalPrice() {
      if (!this.activities || this.activities.length === 0) return 0;

      return this.activities.reduce((total, activity) => {
        if (!activity.activityItems) return total;

        const activityTotal = activity.activityItems.reduce(
          (sum, item) => sum + item.quantity * item.product.category.price,
          0
        );
        return total + activityTotal;
      }, 0);
    },
  },
  methods: {
    closeDialog() {
      this.$emit("close-dialog");
    },
    isActivitySelectable(selectedActivity) {
      if (!selectedActivity) return false;
      const activity = this.activities.find(
        (act) => act.id === selectedActivity.value
      );
      return activity;
    },
    confirmPickUp() {
      const activity = this.selectedActivity
        ? this.activities.find(
            (act) => act.activityId === this.selectedActivity.value
          )
        : null;
      const updatedActivity = {
        ...activity,
        statusId: 2, // Set status to "Afhenter"
      };
      ActivityDataService.update(activity.activityId, updatedActivity)
        .then(() => {
          // Emit event to parent to refresh activities
          this.$emit("activity-updated", activity.userId);
          this.closeDialog();
        })
        .catch((error) => {
          console.error("Error updating activity:", error);
        });
    },
  },
};
</script>

<style scoped>
.close-button {
  position: absolute;
  top: 18px;
  right: 10px;
}

.v-select {
  margin: 0px 20px;
}
</style>
