<template>
  <v-card
    :class="['message-card', { 'message-mine': dark }]"
    :color="dark ? 'primary' : 'grey-lighten-4'"
    :variant="dark ? 'flat' : 'elevated'"
    elevation="1"
    rounded="lg"
  >
    <v-card-text class="pa-3">
      <div class="d-flex align-center justify-space-between mb-1">
        <span
          class="font-weight-bold text-body-2"
          :class="dark ? 'text-white' : 'text-grey-darken-3'"
        >
          {{ author }}
        </span>
        <span
          class="text-caption ml-3"
          :class="dark ? 'text-white-50' : 'text-grey'"
        >
          {{ timestamp }}
        </span>
      </div>
      <div
        class="text-body-2"
        :class="dark ? 'text-white' : 'text-grey-darken-2'"
      >
        {{ text }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: "ChatMessage",
    props: {
      text: {
        type: String,
        default: "",
      },
      author: {
        type: String,
        default: "",
      },
      dark: {
        type: Boolean,
        default: false,
      },
      timestamp: {
        type: String,
        default: "",
      },
    },
  };
</script>

<style scoped>
  .message-card {
    max-width: 320px;
    width: fit-content;
  }

  .message-mine {
    margin-left: auto;
  }

  .text-white-50 {
    color: rgba(255, 255, 255, 0.7) !important;
  }
</style>
