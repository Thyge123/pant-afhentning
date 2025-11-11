<template>
  <div class="image-container">
    <div class="image">
      <img :src="imageURL" alt="Dansk Retursystem Logo" />
    </div>
  </div>
</template>

<script>
  export default {
    name: "LogoBanner",
    data() {
      return {
        imageURL:
          "https://www.greatplacetowork.dk/images/Arbejdspladsprofiler/Dansk-Retursystem/Dansk-Retursystem-logo-profil.webp",
      };
    },
  };
</script>

<style>
  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    background-color: #d9d9d9;
    width: 100%;
    padding: 10px;
    height: 10rem;
  }

  .image img {
    width: 250px;
    object-fit: contain;
    height: auto;
  }
</style>
