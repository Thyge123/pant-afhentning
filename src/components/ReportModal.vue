<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="closeDialog"
    width="auto"
  >
    <v-card
      prepend-icon="mdi-alert"
      text="Er der sket en fejl ved registreringen af pant?"
      title="Er der sket en fejl?"
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
        :items="reportReasons"
        dense
        v-model="selectedReason"
        return-object
      ></v-select>
      <v-textarea
        label="Yderligere kommentarer"
        auto-grow
        v-if="selectedReason"
        rows="1"
      ></v-textarea>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">Annuller</v-btn>
        <v-btn
          color="primary"
          @click="confirmPickUp"
          :disabled="!selectedReason"
          >Bekræft</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "BugReportModal",
    data() {
      return {
        selectedReason: null,
        reportReasons: [
          "Forkert pant registreret",
          "Manglende penge på konto",
          "Andet",
        ],
      };
    },
    computed: {},
    methods: {
      closeDialog() {
        this.$emit("close-report-dialog");
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

  .v-textarea {
    margin: 0px 20px;
  }
</style>
