<template>
  <v-app>
    <v-main>
      <router-view />
      <button @click="$router.push('/register')">Register</button>
      <br />
      <button @click="$router.push('/pant-history')">Pant History</button>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    name: "App",

    data: () => ({
      //
    }),
  };
</script>
