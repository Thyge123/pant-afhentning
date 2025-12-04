<template>
    <v-card class="bg-primary align-center pa-1 pt-4 pb-4 h-100" @click="openDialog">
      <p><v-icon icon="mdi-truck-fast"></v-icon></p>
      <p class="text-no-wrap text-button">Anmod afhentning</p>
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