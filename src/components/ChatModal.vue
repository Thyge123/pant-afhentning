<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('close')"
    max-width="600"
    scrollable
  >
    <v-card class="chat-card">
      <v-card-title class="d-flex align-center bg-primary text-white pa-4">
        <span class="text-h6">Chat</span>
        <v-spacer></v-spacer>
        <v-btn
          icon
          variant="text"
          density="compact"
          @click="$emit('close')"
          color="white"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="chat-content pa-0" ref="chatContent">
        <div class="messages-container">
          <div v-if="isLoading" class="loading-state">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
          <div v-else-if="messages.length === 0" class="empty-state">
            <v-icon size="64" color="grey-lighten-1" class="mb-2"
              >mdi-chat-outline</v-icon
            >
            <div class="text-grey">Ingen beskeder endnu</div>
          </div>

          <ChatMessage
            v-else
            v-for="message in messages"
            :key="message.chatId"
            :class="['message-item', message.isMine ? 'message-right' : '']"
            :text="message.message"
            :author="getUserName(message.senderId)"
            :timestamp="message.timeStamp"
            :dark="isMine(message)"
          />
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4 bg-grey-lighten-5">
        <ChatBox @submit="handleSubmit" style="width: 100%" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import ChatMessage from "./Message.vue";
  import ChatBox from "./ChatBox.vue";
  import ChatDataService from "@/services/ChatDataService";
  import UserDataService from "@/services/UserDataService";

  export default {
    name: "ChatModal",
    components: {
      ChatMessage,
      ChatBox,
    },
    props: {
      modelValue: {
        type: Boolean,
        required: true,
      },
      activityId: {
        type: Number,
        required: true,
      },
      currentUserId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        messages: [],
        users: {},
        isLoading: false,
      };
    },
    watch: {
      messages: {
        handler() {
          this.scrollToBottom();
        },
        deep: true,
      },
      modelValue(val) {
        if (val) {
          this.scrollToBottom();
        }
      },
    },
    computed: {
      isMine() {
        return (message) => message.senderId === this.currentUserId;
      },
    },
    methods: {
      getUserName(senderId) {
        const user = this.users[senderId];
        return user ? user.firstName : `Bruger ${senderId}`;
      },
      async fetchUser(userId) {
        if (this.users[userId]) return; // Already fetched
        try {
          const response = await UserDataService.get(userId);
          this.users[userId] = response.data;
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
        }
      },
      async fetchUsersFromMessages() {
        const uniqueSenderIds = [
          ...new Set(this.messages.map((m) => m.senderId)),
        ];
        await Promise.all(uniqueSenderIds.map((id) => this.fetchUser(id)));
      },
      handleSubmit(event, text) {
        if (!text) return;
        const newMessage = {
          message: text,
          senderId: this.currentUserId,
          activityId: this.activityId,
        };
        ChatDataService.sendMessage(newMessage)
          .then((response) => {
            this.messages.push(response.data);
            this.fetchUser(this.currentUserId);
            console.log("Message sent:", newMessage);
          })
          .catch((error) => {
            console.error("Error sending message:", error);
          });
      },
      scrollToBottom() {
        this.$nextTick(() => {
          const container =
            this.$refs.chatContent?.$el || this.$refs.chatContent;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });
      },
    },
    async mounted() {
      this.isLoading = true;
      try {
        const response = await ChatDataService.getMessagesForActivity(
          this.activityId
        );
        this.messages = (response.data || []).filter(
          (msg) => msg && msg.chatId
        );
        await this.fetchUsersFromMessages();
        // Also fetch current user
        await this.fetchUser(this.currentUserId);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        this.isLoading = false;
      }
    },
  };
</script>

<style scoped>
  .chat-card {
    display: flex;
    flex-direction: column;
    height: 600px;
  }

  .chat-content {
    flex-grow: 1;
    overflow-y: auto;
    background-color: #f9f9f9;
  }

  .messages-container {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: auto;
    margin-bottom: auto;
    height: 100%;
    opacity: 0.6;
  }

  .message-item {
    margin-bottom: 1rem;
    max-width: 85%;
    align-self: flex-start;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .message-item.message-right {
    align-self: flex-end;
  }

  .loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
