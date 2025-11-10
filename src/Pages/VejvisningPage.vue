<template>
  <section class="vejvisning">
    <div class="header-title">Vejvisning</div>

    <section class="panel">
      <h3>Adresse</h3>
      <section class="pill">{{ address }}</section>

      <v-card class="map-card" flat>
        <div class="map-content">
          <!-- Fake streets -->
          <div class="street horizontal-street"></div>
          <div class="street vertical-street"></div>

          <!-- The location marker -->
          <div class="location-marker">
            <v-icon color="red" size="40">mdi-map-marker</v-icon>
            <v-chip
              small
              color="black"
              text-color="white"
              class="location-label"
              >{{ address }}</v-chip
            >
          </div>

          <!-- Fake buildings -->
          <div class="building building-1"></div>
          <div class="building building-2"></div>
          <div class="building building-3"></div>

          <!-- Fake park -->
          <div class="park"></div>
        </div>
      </v-card>
    </section>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        address: "",
      };
    },
    mounted() {
      const addressParam = this.$route.params.address;
      if (addressParam) {
        this.address = addressParam;
      }
    },
  };
</script>

<style scoped>
  .vejvisning {
    background: #111;
    color: #ddd;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  .header-title {
    text-align: left;
    font-size: 26px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .topbar {
    background: #555;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .dots span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
  }
  .dots span:nth-child(1) {
    background: #7db3e5;
  }
  .dots span:nth-child(2) {
    background: #8fcf84;
  }
  .dots span:nth-child(3) {
    background: #e7de6f;
  }
  .menu-btn {
    background: #777;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    color: white;
  }

  .panel {
    background: #ddd;
    color: #333;
    border-radius: 12px;
    padding: 14px;
    margin-top: 16px;
  }
  .panel h3 {
    margin: 0 0 6px;
    font-size: 16px;
  }

  .pill {
    background: #555;
    color: white;
    padding: 6px 10px;
    border-radius: 6px;
    display: inline-block;
    margin-bottom: 14px;
  }

  .map-card {
    position: relative;
    height: 300px;
    background-color: #e0e0e0 !important; /* Light grey for the map background */
    overflow: hidden;
    border-radius: 10px !important;
  }

  .map-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .street {
    position: absolute;
    background-color: #bdbdbd; /* Darker grey for streets */
    box-shadow: inset 0 0 0 1px #9e9e9e;
  }

  .horizontal-street {
    width: 100%;
    height: 40px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  .vertical-street {
    width: 40px;
    height: 100%;
    left: 30%;
    top: 0;
    transform: translateX(-50%);
  }

  .location-marker {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -100%);
    text-align: center;
  }

  .location-label {
    margin-top: -8px;
  }

  .building {
    position: absolute;
    background-color: #a1887f; /* Brownish color for buildings */
  }

  .building-1 {
    width: 60px;
    height: 80px;
    top: 10%;
    left: 10%;
  }

  .building-2 {
    width: 100px;
    height: 50px;
    bottom: 15%;
    right: 5%;
  }

  .building-3 {
    width: 50px;
    height: 50px;
    top: 20%;
    right: 15%;
  }

  .park {
    position: absolute;
    background-color: #a5d6a7; /* Light green for park */
    width: 25%;
    height: 30%;
    bottom: 5%;
    left: 5%;
    border-radius: 8px;
  }
</style>
