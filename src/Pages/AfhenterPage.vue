<template>
  <v-container fluid>
    <v-sheet>
      <h2>Aktiviteter til afhentning</h2>
      <v-data-table
        :headers="headersToShow"
        :items="filteredActivities"
        class="elevation-1"
      >
        <template #[`item.actions`]="{ item }">
          <div v-if="!item.accepted && !anyAccepted">
            <v-btn
              small
              class="bg-primary text-white"
              @click="acceptTask(item)"
            >
              Accepter
            </v-btn>
          </div>

          <div v-else-if="item.accepted">
            <v-btn small class="bg-primary text-white" @click="GoToMap(item)">
              Vejvisning
            </v-btn>

            <v-btn
              small
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
      <v-data-table
        :headers="headersWithAddress"
        :items="ongoingActivities"
        class="elevation-1"
      >
        <template #[`item.actions`]="{ item }">
          <v-btn small class="bg-primary text-white" @click="GoToMap(item)">
            Vejvisning
          </v-btn>

          <v-btn
            small
            class="bg-secondary text-white"
            @click="moveToPickedUp(item)"
          >
            Hentet
          </v-btn>
          <v-fab
            class="centered-fab"
            icon="mdi-chat"
            @click="openChat(item)"
          ></v-fab>
        </template>

        <template v-slot:no-data>
          Ingen igangværende aktiviteter fundet.
        </template>
      </v-data-table>
      <br /><br />
      <v-divider></v-divider>
      <br />
      <h2>Afhentede aktiviteter</h2>
      <v-data-table
        :headers="pickedHeaders"
        :items="PickedUpActivities"
        class="elevation-1 mt-4"
      >
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
        SelectedAddress: "",
        activities: [],
        pickups: [],
        currentUserId: null, // Set this from your auth/user state
        showChatModal: false,
        selectedActivity: null,
        headersWithAddress: [
          { title: "Dato", key: "formattedDate" },
          { title: "Adresse", key: "user.address" },
          { title: "Antal", key: "totalAmount" },
          { title: "Beløb", key: "totalPrice" },
          { title: "", key: "actions", sortable: false },
        ],

        headersWithoutAddress: [
          { title: "Dato", key: "formattedDate" },
          { title: "Antal", key: "totalAmount" },
          { title: "Beløb", key: "totalPrice" },
          { title: "", key: "actions", sortable: false },
        ],

        pickedHeaders: [
          { title: "Dato", key: "formattedDate" },
          { title: "Adresse", key: "user.address" },
          { title: "Antal", key: "totalAmount" },
          { title: "Beløb", key: "totalPrice" },
        ],
      };
    },

    computed: {
      headersToShow() {
        return this.filteredActivities.some((a) => a.accepted)
          ? this.headersWithAddress
          : this.headersWithoutAddress;
      },

      // Activities available for pickup (statusId === 2)
      // Activities available for pickup (statusId === 2)
      filteredActivities() {
        return this.activities
          .filter((a) => a.statusId === 2)
          .map((activity) => ({
            ...activity,
            accepted: false,
            totalAmount: this.calculateTotalAmount(activity),
            totalPrice: this.calculateTotalPrice(activity),
            formattedDate: this.formatDate(activity.date),
          }));
      },

      // Ongoing/accepted activities (statusId === 20) - only for the user who accepted
      ongoingActivities() {
        return this.activities
          .filter((a) => {
            if (a.statusId !== 3) return false;
            // Check if this user has a pickup for this activity
            const hasPickup = this.pickups.some(
              (p) =>
                p.activityId === a.activityId &&
                p.userId === this.loggedInUserId
            );
            return hasPickup;
          })
          .map((activity) => ({
            ...activity,
            accepted: true,
            totalAmount: this.calculateTotalAmount(activity),
            totalPrice: this.calculateTotalPrice(activity),
            formattedDate: this.formatDate(activity.date),
          }));
      },

      PickedUpActivities() {
        return this.activities
          .filter((a) => {
            if (a.statusId !== 4) return false;
            // Check if this user has a pickup for this activity
            const hasPickup = this.pickups.some(
              (p) =>
                p.activityId === a.activityId &&
                p.userId === this.loggedInUserId
            );
            return hasPickup;
          })
          .map((activity) => ({
            ...activity,
            totalAmount: this.calculateTotalAmount(activity),
            totalPrice: this.calculateTotalPrice(activity),
            formattedDate: this.formatDate(activity.date),
          }));
      },

      anyAccepted() {
        return this.ongoingActivities.length > 0;
      },

      loggedInUserId() {
        const user = this.loggedInUser?.();
        return user?.userId || null;
      },
    },

    methods: {
      GetAllActivities() {
        ActivityDataService.getAll()
          .then((r) => (this.activities = r.data))
          .catch(console.log);
      },

      fetchPickups() {
        // Fetch all pickups (or by user if API supports it)
        PickUpDataService.getAll()
          .then((response) => {
            this.pickups = response.data;
          })
          .catch((e) => {
            console.error("Error fetching pickups:", e);
          });
      },

      acceptTask(item) {
        const index = this.activities.findIndex(
          (a) => a.activityId === item.activityId
        );
        if (index !== -1) {
          this.activities[index].statusId = 20; // accepteret
        }

        // Update activity status
        ActivityDataService.update(item.activityId, {
          ...item,
          statusId: 20,
        })
          .then(() => {
            // Create a new pickUp after successfully updating the activity
            return this.createPickUp(item);
          })
          .catch(console.log);
      },

      createPickUp(activity) {
        const newPickUp = {
          userId: activity.userId, // The user who owns the activity
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
        const index = this.activities.findIndex(
          (a) => a.activityId === item.activityId
        );
        if (index !== -1) {
          this.activities[index].statusId = 3;
        }

        ActivityDataService.update(item.activityId, {
          ...item,
          statusId: 3,
        }).catch(console.log);
      },

      GoToMap(item) {
        this.SelectedAddress = item.user.address;
        this.$router.push({
          name: "Vejvisning",
          params: { address: this.SelectedAddress },
        });
      },

      openChat(item) {
        this.selectedActivity = item;
        this.showChatModal = true;
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
        return date ? new Date(date).toLocaleDateString() : "";
      },
    },

    created() {
      this.GetAllActivities();
      this.fetchPickups();
    },
  };
</script>

<style scoped></style>
