<template>
  <v-card class="bg-primary align-center pa-2 h-100" @click="openDialog">
    <p><v-icon icon="mdi-truck-fast"></v-icon></p>
    <p>Anmod om afhentning</p>
  </v-card>
</template>

<script>
  export default {
    name: "OrderPickUpButton",
    components: {},
    data() {
      return {
        dialog: false,
      };
    },
    emits: ["open-dialog"],
    methods: {
      openDialog() {
        this.$emit("open-dialog");
      },
    },
  };
</script>

<style scoped>
  .v-card {
    cursor: pointer;
    width: 45%;
  }
</style>
