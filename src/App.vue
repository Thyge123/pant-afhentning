<template>
  <v-app>
    <v-main>
      <router-view />
      <button @click="$router.push('/register')">Register</button>
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
