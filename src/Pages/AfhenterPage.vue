<template>
  <v-container fluid>
    <v-sheet>
      <h2>Aktiviteter til afhentning</h2>
      <v-data-table
        :headers="headersToShow"
        :items="filteredActivities"
        class="elevation-1"
        :mobile="null"
        mobile-breakpoint="0"
      >
        <template #[`item.user.address`]="{ item }">
          {{ getAddressLastPart(item.user.address) }}
        </template>

        <template #[`item.totalPrice`]="{ item }">
          {{ item.totalPrice }} kr
        </template>

        <template #[`item.actions`]="{ item }">
          <div v-if="!item.accepted && !anyAccepted">
            <v-btn
              size="small"
              class="bg-primary text-white"
              @click="acceptTask(item)"
            >
              Accepter
            </v-btn>
          </div>

          <div v-else-if="item.accepted" class="d-flex flex-column ga-1">
            <v-btn
              size="small"
              class="bg-primary text-white"
              @click="GoToMap(item)"
            >
              Vejvisning
            </v-btn>

            <v-btn
              size="small"
              class="bg-secondary text-white"
              @click="moveToPickedUp(item)"
            >
              Hentet
            </v-btn>
          </div>
        </template>

        <template v-slot:no-data>
          Ingen aktiviteter til afhentning fundet.
        </template>
      </v-data-table>

      <br /><br />
      <v-divider></v-divider>
      <br />
      <h2>Igangværende aktiviteter</h2>
      <div v-if="ongoingActivities.length > 0">
        <v-card
          v-for="item in ongoingActivities"
          :key="item.activityId"
          class="mb-4 elevation-1"
        >
          <v-card-text class="pb-2">
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="text-subtitle-1 font-weight-bold text-high-emphasis">
                {{ getAddressLastPart(item.user.address) }}
              </span>
              <span class="text-caption text-medium-emphasis">
                {{ item.formattedDate }}
              </span>
            </div>
            <div class="d-flex justify-space-between text-body-2">
              <span>Antal: {{ item.totalAmount }}</span>
              <span class="font-weight-bold">{{ item.totalPrice }} kr</span>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn
              color="primary"
              variant="flat"
              size="small"
              class="flex-grow-1"
              @click="GoToMap(item)"
            >
              Vejvisning
            </v-btn>

            <v-btn
              color="secondary"
              variant="flat"
              size="small"
              class="flex-grow-1"
              @click="moveToPickedUp(item)"
            >
              Hentet
            </v-btn>

            <v-btn
              icon="mdi-chat"
              size="small"
              color="primary"
              variant="text"
              @click="openChat(item)"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <div v-else>
        <v-card class="pa-4 elevation-1 d-flex align-center justify-center">
          Ingen igangværende aktiviteter fundet.
        </v-card>
      </div>

      <br /><br />
      <v-divider></v-divider>
      <br />
      <h2>Afhentede aktiviteter</h2>
      <v-data-table
        :headers="pickedHeaders"
        :items="PickedUpActivities"
        class="elevation-1 mt-4"
        :mobile="null"
        mobile-breakpoint="0"
      >
        <template #[`item.totalPrice`]="{ item }">
          {{ item.totalPrice }} kr
        </template>

        <template #[`item.actions`]="{ item }">
          <div v-if="item.statusId === 4 && hasUserPickedUp(item.activityId)">
            <v-btn
              size="small"
              class="bg-primary text-white"
              @click="FinishPickUp(item)"
            >
              Afslut
            </v-btn>
          </div>
        </template>

        <template v-slot:no-data>
          Ingen afhentede aktiviteter fundet.
        </template>
      </v-data-table>
    </v-sheet>
    <ChatModal
      v-if="showChatModal"
      :model-value="showChatModal"
      @close="showChatModal = false"
      :activityId="selectedActivity.activityId"
      :currentUserId="loggedInUserId"
    />
  </v-container>
</template>

// ...existing code...
<script>
  import ActivityDataService from "@/services/ActivityDataService";
  import PickUpDataService from "@/services/PickUpDataService";
  import ChatModal from "@/components/ChatModal.vue";

  export default {
    name: "AfhenterPage",
    components: {
      ChatModal,
    },
    inject: ["loggedInUser"],
    data() {
      return {
        activities: [],
        pickups: [],
        showChatModal: false,
        selectedActivity: null,
        headersWithAddress: [
          { title: "Dato", key: "formattedDate", width: "80px" },
          { title: "By", key: "user.address", width: "90px" },
          { title: "Antal", key: "totalAmount", width: "60px" },
          { title: "Beløb", key: "totalPrice", width: "70px" },
          { title: "", key: "actions", sortable: false, width: "100px" },
        ],
        headersWithoutAddress: [
          { title: "Dato", key: "formattedDate", width: "100px" },
          { title: "By", key: "user.address", width: "110px" },
          { title: "Antal", key: "totalAmount", width: "70px" },
          { title: "Beløb", key: "totalPrice", width: "80px" },
          { title: "", key: "actions", sortable: false, width: "100px" },
        ],
        pickedHeaders: [
          { title: "Dato", key: "formattedDate", width: "90px" },
          { title: "By", key: "user.address", width: "100px" },
          { title: "Antal", key: "totalAmount", width: "70px" },
          { title: "Beløb", key: "totalPrice", width: "80px" },
          { title: "", key: "actions", sortable: false, width: "100px" },
        ],
      };
    },

    computed: {
      loggedInUserId() {
        const user = this.loggedInUser?.();
        return user?.userId || null;
      },

      headersToShow() {
        return this.filteredActivities.some((a) => a.accepted)
          ? this.headersWithAddress
          : this.headersWithoutAddress;
      },

      // Activities available for pickup (statusId === 2)
      filteredActivities() {
        return this.activities
          .filter((a) => a.statusId === 2)
          .map((activity) => ({
            ...this.enrichActivity(activity),
            accepted: false,
          }));
      },

      // Ongoing/accepted activities (statusId === 3) - only for the user who accepted
      ongoingActivities() {
        return this.activities
          .filter((a) => a.statusId === 3 && this.hasUserPickedUp(a.activityId))
          .map((activity) => ({
            ...this.enrichActivity(activity),
            accepted: true,
          }));
      },

      // Picked up activities (statusId === 4)
      PickedUpActivities() {
        return this.activities
          .filter(
            (a) =>
              a.statusId === 4 ||
              (a.statusId === 5 && this.hasUserPickedUp(a.activityId))
          )
          .map((activity) => this.enrichActivity(activity));
      },

      anyAccepted() {
        return this.ongoingActivities.length > 0;
      },
    },

    methods: {
      GetAllActivities() {
        ActivityDataService.getAll()
          .then((r) => (this.activities = r.data))
          .catch(console.log);
      },

      fetchPickups() {
        PickUpDataService.getAll()
          .then((response) => {
            this.pickups = response.data;
          })
          .catch((e) => {
            console.error("Error fetching pickups:", e);
          });
      },

      hasUserPickedUp(activityId) {
        return this.pickups.some(
          (p) => p.activityId === activityId && p.userId === this.loggedInUserId
        );
      },

      enrichActivity(activity) {
        return {
          ...activity,
          totalAmount: this.calculateTotalAmount(activity),
          totalPrice: this.calculateTotalPrice(activity),
          formattedDate: this.formatDate(activity.date),
        };
      },

      updateActivityStatus(item, statusId) {
        const index = this.activities.findIndex(
          (a) => a.activityId === item.activityId
        );
        if (index !== -1) {
          this.activities[index].statusId = statusId;
        }

        return ActivityDataService.update(item.activityId, {
          ...item,
          statusId: statusId,
        });
      },

      acceptTask(item) {
        if (!this.loggedInUserId) {
          console.error("No logged in user ID found.");
          return;
        }

        this.updateActivityStatus(item, 3)
          .then(() => this.createPickUp(item))
          .catch(console.log);
      },

      createPickUp(activity) {
        const newPickUp = {
          userId: this.loggedInUserId,
          activityId: activity.activityId,
        };

        return PickUpDataService.create(newPickUp)
          .then((response) => {
            this.pickups.push(response.data);
            console.log("PickUp created successfully:", response.data);
          })
          .catch((e) => {
            console.error("Error creating pickup:", e);
          });
      },

      moveToPickedUp(item) {
        // Move to status 4 (Picked Up)
        this.updateActivityStatus(item, 4).catch(console.log);
      },

      FinishPickUp(item) {
        // Move to status 5 (Finished)
        this.updateActivityStatus(item, 5).catch(console.log);
      },

      GoToMap(item) {
        this.$router.push({
          name: "Vejvisning",
          params: { address: item.user.address },
        });
      },

      openChat(item) {
        this.selectedActivity = item;
        this.showChatModal = true;
      },

      getAddressLastPart(address) {
        if (!address) return "";
        const parts = address.split(",");
        return parts.length > 1 ? parts[parts.length - 1].trim() : address;
      },

      calculateTotalPrice(activity) {
        return (
          activity.activityItems?.reduce(
            (sum, x) => sum + x.quantity * x.product.category.price,
            0
          ) || 0
        );
      },

      calculateTotalAmount(activity) {
        return (
          activity.activityItems?.reduce((sum, x) => sum + x.quantity, 0) || 0
        );
      },

      formatDate(date) {
        return date
          ? new Date(date).toLocaleDateString("da-DK", {
              day: "2-digit",
              month: "2-digit",
            })
          : "";
      },
    },

    created() {
      this.GetAllActivities();
      this.fetchPickups();
    },
  };
</script>

<style scoped>
  :deep(.v-data-table) {
    font-size: 0.875rem;
  }

  :deep(.v-data-table th) {
    font-size: 0.75rem !important;
    padding: 0 8px !important;
    white-space: nowrap;
  }

  :deep(.v-data-table td) {
    padding: 4px 8px !important;
    font-size: 0.875rem;
  }

  :deep(.v-btn) {
    font-size: 0.75rem;
    min-width: unset;
    padding: 0 8px;
  }

  h2 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
</style>
