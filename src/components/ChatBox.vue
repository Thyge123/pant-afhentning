<template>
  <v-form class="chat-box" @submit.prevent="onSubmit">
    <v-text-field
      v-model="text"
      placeholder="Skriv en besked..."
      variant="outlined"
      density="comfortable"
      hide-details
      rounded="pill"
      class="flex-grow-1 mr-2"
      bg-color="white"
    >
      <template #prepend-inner>
        <v-icon color="grey" size="small">mdi-message-text-outline</v-icon>
      </template>
    </v-text-field>

    <v-btn
      type="submit"
      color="primary"
      :disabled="text.trim() === ''"
      icon
      size="large"
    >
      <v-icon>mdi-send</v-icon>
    </v-btn>
  </v-form>
</template>

<script>
  export default {
    name: "ChatBox",
    data: () => ({
      text: "",
    }),
    methods: {
      onSubmit() {
        if (this.text.trim() === "") return;
        this.$emit("submit", null, this.text);
        this.text = "";
      },
    },
  };
</script>

<style scoped>
  .chat-box {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
