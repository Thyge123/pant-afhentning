<template>
  <v-container>
    <div class="pant-details">
      <v-card>
        <v-card-title
          class="headline d-flex justify-space-between align-center"
        >
          <span>Pant Detaljer</span>

          <BugReportButton
            v-if="isActivityFinished"
            @open-report-dialog="showReportModal = true"
          />
          <div class="chat-icon" @click="showChatModal = true">
            <v-fab class="centered-fab" icon="mdi-chat"></v-fab>
          </div>
        </v-card-title>
        <v-card-text v-if="activityDetails">
          <div class="details-grid">
            <div>
              <div class="text-subtitle-2">Dato</div>
              <div class="text-body-1">{{ formattedDate }}</div>
            </div>
            <div>
              <div class="text-subtitle-2">Status</div>
              <div class="text-body-1">
                {{ statusMap[activityDetails.activityStatus.statusId] }}
              </div>
            </div>
            <div v-if="activityDetails.pickUpDate">
              <div class="text-subtitle-2">Afhentningsdato</div>
              <div class="text-body-1">
                {{ activityDetails.pickUpDate }}
              </div>
            </div>
          </div>

          <v-divider class="my-4"></v-divider>

          <h3 class="text-h6 mb-2">Indsamlede varer</h3>
          <v-list dense>
            <v-list-item
              v-for="(item, index) in activityDetails.activityItems"
              :key="index"
            >
              <v-list-item-title>
                {{ item.product.name }} - {{ item.quantity }} stk.
              </v-list-item-title>
              <v-list-item-subtitle>
                Pant: {{ item.product.category.name }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-divider class="my-4"></v-divider>

          <div class="totals-container">
            <div class="total-item">
              <div class="text-subtitle-2">Total antal</div>
              <div class="text-h5 font-weight-bold">{{ totalAmount }}</div>
            </div>
            <div class="total-item">
              <div class="text-subtitle-2">Total pant værdi</div>
              <div class="text-h5 font-weight-bold">{{ priceTotal }} kr.</div>
            </div>
          </div>
        </v-card-text>
        <v-card-text v-else class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
          <p class="mt-4">Indlæser detaljer...</p>
        </v-card-text>
      </v-card>
    </div>
    <ReportModal
      v-if="showReportModal"
      :model-value="showReportModal"
      @close-report-dialog="showReportModal = false"
      :activityId="activityDetails.id"
    />

    <ChatModal
      v-if="showChatModal"
      :model-value="showChatModal"
      @close="showChatModal = false"
      :activityId="activityDetails.activityId"
      :currentUserId="activityDetails.userId"
    />
  </v-container>
</template>

<script>
  import BugReportButton from "../components/BugReportButton.vue";
  import ChatModal from "../components/ChatModal.vue";
  import ReportModal from "../components/ReportModal.vue";
  import ActivityDataService from "@/services/ActivityDataService";

  export default {
    name: "PantScanDetails",
    components: {
      BugReportButton,
      ChatModal,
      ReportModal,
    },
    data() {
      return {
        activityDetails: null,
        showReportModal: false,
        showChatModal: false,
        isLoading: true,
        messages: [],
      };
    },
    inject: [/*"activities",*/ "statusMap"],
    computed: {
      priceTotal() {
        if (!this.activityDetails || !this.activityDetails.activityItems)
          return 0;

        return this.activityDetails.activityItems.reduce(
          (sum, item) => sum + item.quantity * item.product.category.price,
          0
        );
      },
      totalAmount() {
        if (!this.activityDetails || !this.activityDetails.activityItems)
          return 0;
        return this.activityDetails.activityItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      },
      isActivityFinished() {
        return this.activityDetails && this.activityDetails.statusId === 4;
      },
      formattedDate() {
        if (!this.activityDetails) return "";
        const date = new Date(this.activityDetails.date);
        return date.toLocaleDateString();
      },
    },
    methods: {
      /*
    fetchActivityDetails(activityId) {
      this.activityDetails = this.activities.find(
        (activity) => activity.id === parseInt(activityId)
      );
      console.log("Fetched activity details:", this.activityDetails);
    },
    */
      GetActivityById(id) {
        return ActivityDataService.get(id)
          .then((response) => {
            this.activityDetails = response.data;
            console.log("Fetched activity details:", this.activityDetails);
            this.isLoading = false;
          })
          .catch((e) => {
            console.log(e);
            this.isLoading = false;
          });
      },
    },
    mounted() {
      const activityId = this.$route.params.id;
      // Fetch and display details based on activityId
      this.GetActivityById(activityId);
    },
  };
</script>

<style scoped>
  .pant-details {
    max-width: 800px;
    margin: auto;
  }

  .details-grid {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .totals-container {
    display: flex;
    justify-content: space-around;
    text-align: center;
    gap: 16px;
  }

  .total-item {
    flex: 1;
    padding: 16px;
    border-radius: 4px;
    background-color: #f5f5f5;
  }

  .chat-icon {
    cursor: pointer;
    color: #000000de;
  }
</style>
