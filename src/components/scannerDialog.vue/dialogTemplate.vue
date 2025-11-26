<template>
  <v-row class="d-flex justify-space-between pa-2">
    <v-col cols="6" class="pa-1">
      <v-btn
        block
        class="bg-secondary text-white"
        text="Gem scanning"
        @click="saveDialog"
      ></v-btn>
    </v-col>
    <v-col cols="6" class="pa-1">
      <v-btn
        block
        class="bg-primary text-white"
        text="Anmod afhentning"
        @click="pickupDialog"
      ></v-btn>
    </v-col>
  </v-row>

  <v-dialog v-model="dialog" max-width="480">
    <v-card :title="save ? 'Gem scanning' : 'Anmod afhentning'">
      <v-card-text>
        <saveDialog v-if="save" />
        <pickupDialog v-else-if="pickup" />
        <v-container v-else-if="finishingDialog" class="pa-0">
          <div class="text-center">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            ></v-progress-circular>
            <p v-if="finishingSave" class="mt-4">Gemmer scanning...</p>
            <p v-else-if="finishingPickup" class="mt-4">
              Anmoder om afhentning...
            </p>
          </div>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="dialogButtons"
          class="bg-error text-white"
          text="Annuler"
          @click="closeDialog"
        ></v-btn>
        <v-btn
          v-if="dialogButtons"
          :class="['text-white', save ? 'bg-secondary' : 'bg-primary']"
          :text="save ? 'Gem' : 'Anmod'"
          @click="pickupDialog2"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialog2" max-width="240">
    <v-card title="Beløb for lavt">
      <v-card-text>
        <v-container class="pa-0">
          <p>
            Du skal scanne for mindst 100 kr. for at anmode om afhenting. Ønsker
            du at fortsætte eller gemme din scanning?
          </p>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="dialogButtons"
          class="bg-primary text-white"
          text="Fortsæt"
          @click="closeDialog"
        ></v-btn>
        <v-btn
          v-if="dialogButtons"
          class="bg-secondary text-white"
          text="Gem"
          @click="finishDialog"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import saveDialog from "./saveDialog.vue";
import pickupDialog from "./pickupDialog.vue";
import ActivityDataService from "@/services/ActivityDataService";
import ActivityItemDataService from "@/services/ActivityItemDataService";
export default {
  props: {
    totalSum: {
      type: Number,
      required: true,
    },
    beverages: {
      type: Array,
      required: true,
    },
  },
  components: {
    saveDialog,
    pickupDialog,
  },
  inject: ["loggedInUser"],
  emits: ["activity-updated"],
  name: "scannerDialog",
  data() {
    return {
      dialog: false,
      dialog2: false,
      save: false,
      pickup: false,
      close: false,
      finishingDialog: false,
      finishingSave: false,
      finishingPickup: false,
      dialogButtons: true,
      existingActivities: null,
    };
  },
  computed: {},
  methods: {
    getAllSavedActivities() {
      const user = this.loggedInUser();
      if (!user) {
        console.error("No logged in user");
        return;
      }
      return ActivityDataService.getByStatusAndUser(user.userId)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error("Error fetching activities:", error);
        });
    },
    CreateActivity() {
      const user = this.loggedInUser();
      if (!user) {
        console.error("No logged in user");
        return;
      }
      let activityId;

      // Fetch all saved activities for the current user
      this.getAllSavedActivities()
        .then((existingActivities) => {
          // If no saved activities exist, create a new one with status 1 (saved)
          if (!existingActivities || existingActivities.length === 0) {
            return ActivityDataService.create({
              userId: user.userId,
              date: new Date().toISOString(),
              statusId: 1,
            }).then((response) => {
              activityId = response.data.activityId;
              return []; // Return empty array since no items exist yet
            });
          } else {
            // Use the first existing saved activity
            activityId = existingActivities[0].activityId;
            // Fetch all activity items and filter by current activity
            return ActivityItemDataService.getAll().then((response) => {
              const items = response.data || [];
              return items.filter((item) => item.activityId === activityId);
            });
          }
        })
        .then((existingItems) => {
          // Create a map of existing items by productId for quick lookup
          const existingItemsMap = new Map(
            existingItems.map((item) => [item.productId, item])
          );

          // Process each scanned beverage
          const itemPromises = this.beverages.map((beverage) => {
            const existingItem = existingItemsMap.get(beverage.id);
            console.log("existingItem", existingItem);
            // If item already exists in activity, update quantity
            if (existingItem) {
              const newQuantity = existingItem.quantity + beverage.count;
              return ActivityItemDataService.update(existingItem.itemId, {
                quantity: newQuantity,
              });
            } else {
              // Otherwise, create a new activity item
              return ActivityItemDataService.create({
                activityId: activityId,
                productId: beverage.id,
                quantity: beverage.count,
              });
            }
          });

          // Wait for all item operations to complete
          return Promise.all(itemPromises);
        })
        .then(() => {
          // Emit event to notify parent component of activity update
          this.$emit("activity-updated", user.userId);
        })
        .catch((error) => {
          console.error("Error with activity:", error);
        });
    },
    updateActivity() {
      const user = this.loggedInUser();
      if (!user) {
        console.error("No logged in user");
        return;
      }
      // Create a new activity with status 2 (pickup requested)
      ActivityDataService.create({
        userId: user.userId,
        date: new Date().toISOString(),
        statusId: 2,
      })
        .then((response) => {
          const newActivityId = response.data.activityId;

          // Create activity items for all scanned beverages
          const itemPromises = this.beverages.map((beverage) => {
            return ActivityItemDataService.create({
              activityId: newActivityId,
              productId: beverage.id,
              quantity: beverage.count,
            });
          });

          // Wait for all item creations to complete
          return Promise.all(itemPromises);
        })
        .then(() => {
          // Emit event to notify parent component of activity update
          this.$emit("activity-updated", user.userId);
        })
        .catch((error) => {
          console.error("Error creating activity:", error);
        });
    },
    saveDialog() {
      this.dialog = true;
      this.save = true;
      this.pickup = false;
      this.finishingSave = true;
      this.finishingPickup = false;
      this.CreateActivity();
    },
    pickupDialog() {
      this.dialog = true;
      this.save = false;
      this.pickup = true;
      this.finishingSave = false;
      this.finishingPickup = true;
      this.updateActivity();
    },
    pickupDialog2() {
      if (this.pickup === true && this.totalSum < 100) {
        this.dialog2 = true;
      } else {
        this.finishDialog();
      }
    },
    closeDialog() {
      this.dialog = false;
      this.dialog2 = false;
    },
    finishDialog() {
      this.dialog2 = false;
      this.save = false;
      this.pickup = false;
      this.dialogButtons = false;
      this.finishingDialog = true;
      setTimeout(() => {
        this.dialog = false;

        this.$router.push("/");
      }, 2000);
    },
  },
};
</script>
