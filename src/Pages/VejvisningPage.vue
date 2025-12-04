<template>
  <section class="vejvisning">
    <section class="map-container">
      <p class="address-label">Adresse:</p>
      <p class="address">{{ address }}</p>
      <!--Chat Icon-->
      <v-fab
        class="centered-fab"
        icon="mdi-chat"
        style="bottom: 80px; right: -5px; left: auto"
      ></v-fab>
      <!-- Her vises billedet -->
      <img :src="kortImage" alt="Kortvejvisning" class="map-image" />
    </section>
  </section>
</template>

<script>
  import kortImage from "@/assets/kort.png";

  export default {
    name: "VejvisningView",
    data() {
      return {
        kortImage,
        address: null,
      };
    },
    methods: {},
    mounted() {
      // Eventuel initialisering kan ske her
      const address = this.$route.params.address;
      this.address = address;
    },
  };
</script>

<style scoped>
  .vejvisning {
    background: white;
    color: #000000;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  .header-title {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 14px;
    color: black;
  }

  .topbar {
    background: #555;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .map-container {
    background: white;
    margin-top: 16px;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  }

  .address-label {
    font-size: 14px;
    color: #333;
    margin: 0;
  }

  .address {
    background: white;
    color: black;
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    margin-bottom: 10px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  }

  .map-image {
    width: 100%;
    border-radius: 8px;
    margin-top: 5px;
  }

  .centered-fab {
    position: fixed !important;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999 !important;
  }
</style>
