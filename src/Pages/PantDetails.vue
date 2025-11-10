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
        </v-card-title>

        <v-card-text v-if="activityDetails">
          <div class="details-grid">
            <div>
              <div class="text-subtitle-2">Dato</div>
              <div class="text-body-1">{{ activityDetails.date }}</div>
            </div>
            <div>
              <div class="text-subtitle-2">Status</div>
              <div class="text-body-1">
                {{ statusMap[activityDetails.status] }}
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
              v-for="(item, index) in activityDetails.items"
              :key="index"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.type }} - {{ item.quantity }} stk.
                </v-list-item-title>
                <v-list-item-subtitle>
                  Pant: {{ item.pant }}
                </v-list-item-subtitle>
              </v-list-item-content>
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
    />
  </v-container>
</template>

<script>
  import BugReportButton from "../components/BugReportButton.vue";
  import ReportModal from "../components/ReportModal.vue";
  export default {
    name: "PantScanDetails",
    components: {
      BugReportButton,
      ReportModal,
    },
    data() {
      return {
        activityDetails: null,
        showReportModal: false,
        isLoading: true,
      };
    },
    inject: ["activities", "statusMap"],
    computed: {
      priceTotal() {
        if (!this.activityDetails || !this.activityDetails.items) return 0;
        const pantValues = {
          A: 1, // Dåser = 1 kr
          B: 1.5, // Flasker = 1.5 kr
          C: 3, // Store flasker = 3 kr
        };

        return this.activityDetails.items.reduce((total, item) => {
          const pantValue = pantValues[item.pant] || 0;
          return total + pantValue * item.quantity;
        }, 0);
      },
      totalAmount() {
        if (!this.activityDetails || !this.activityDetails.items) return 0;
        return this.activityDetails.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      },
      isActivityFinished() {
        return this.activityDetails && this.activityDetails.status === 4;
      },
    },
    methods: {
      fetchActivityDetails(activityId) {
        this.activityDetails = this.activities.find(
          (activity) => activity.id === parseInt(activityId)
        );
        console.log("Fetched activity details:", this.activityDetails);
      },
    },
    mounted() {
      const activityId = this.$route.params.id;
      // Fetch and display details based on activityId
      this.fetchActivityDetails(activityId);
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
</style>
