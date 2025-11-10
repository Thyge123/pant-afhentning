<template>
  <v-card
    class="bug-report-button"
    @click="openReportDialog"
    variant="flat"
    width="40"
    height="40"
  >
    <v-icon icon="mdi-alert" color="grey" size="small"></v-icon>
  </v-card>
</template>

<script>
  export default {
    name: "BugReportButton",

    data() {
      return {
        dialog: false,
      };
    },
    emits: ["open-report-dialog"],
    methods: {
      openReportDialog() {
        this.$emit("open-report-dialog");
      },
    },
  };
</script>

<style scoped>
  .bug-report-button {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
