<template>
  <v-dialog width="auto">
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
      <v-select
        label="Select"
        :items="selectItems"
        item-title="title"
        item-value="value"
        variant="outlined"
        dense
        v-model="selectedActivity"
        return-object
      ></v-select>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">Annuller</v-btn>
        <v-btn
          color="primary"
          @click="confirmPickUp"
          :disabled="!selectedActivity"
          >Bekræft</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "OrderPickUpModal",
    inject: ["activities"],

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
          title: `${activity.date} - ${activity.price} kr.`,
          value: activity.id,
        }));
      },
    },
    methods: {
      closeDialog() {
        this.$emit("close-dialog");
      },
      confirmPickUp() {
        const activity = this.selectedActivity
          ? this.activities.find(
              (act) => act.id === this.selectedActivity.value
            )
          : null;
        if (activity) {
          activity.status = 2;
        }
        this.closeDialog();
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
