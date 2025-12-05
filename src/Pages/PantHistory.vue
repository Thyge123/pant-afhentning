<template>
  <div class="pa-2 pt-3 pant-history">
    <v-card-text class="text-center" v-if="isLoading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-4">Indlæser detaljer...</p>
    </v-card-text>
    <!--<h2>Min pant</h2>-->
    <v-card elevation="3" v-if="!isLoading">
      <v-table class="w-100">
        <thead>
          <tr>
            <th class="text-left">Dato</th>
            <th class="text-left">Status</th>
            <!-- <th class="text-left">Antal</th> -->
            <th class="text-left">Kr.</th>
            <th class="text-left" v-if="IsExpandable"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(entry, index) in displayedActivities" :key="index">
            <tr
              @click="selectRow(index)"
              class="clickable-row"
              :class="{ 'row-selected': selectedRow === index }"
            >
              <td class="text-no-wrap">
                {{ new Date(entry.date).toLocaleDateString() }}
              </td>
              <td>
                <v-chip :color="getStatusColor(entry.statusId)" label small>
                  {{ statusMap[entry.statusId] }}
                </v-chip>
              </td>
              <!-- <td>{{ entry.amount }}</td> -->
              <td>{{ entry.price }}</td>
              <td
                v-if="selectedRow !== index && IsExpandable"
                class="d-flex justify-end align-center"
              >
                <v-icon icon="mdi mdi-chevron-down" size="x-small"></v-icon>
              </td>
              <td
                v-else-if="IsExpandable"
                class="d-flex justify-end align-center"
              >
                <v-icon icon="mdi mdi-chevron-up" size="x-small"></v-icon>
              </td>
            </tr>
            <tr
              v-if="selectedRow === index && expandRow && entry.activityItems"
            >
              <td colspan="5" class="">
                <v-container class="pa-1 py-4">
                  <v-row
                    class="pa-0 px-2"
                    v-for="(item, i) in entry.activityItems"
                    :key="i"
                  >
                    <v-col class="pa-0 d-flex jusify-space-between">
                      <p class="w-50 text-caption">{{ item.product.name }}</p>
                      <p class="w-50 text-caption text-end">
                        {{ item.quantity }} stk.
                      </p>
                    </v-col>
                  </v-row>
                  <v-row class="pa-0 py-1">
                    <v-col class="pa-0">
                      <v-divider />
                    </v-col>
                  </v-row>
                  <v-row class="pa-0 px-2">
                    <v-col class="pa-0 d-flex justify-space-between">
                      <p class="w-50 text-caption font-weight-medium">Ialt:</p>
                      <p class="w-50 text-caption font-weight-medium text-end">
                        {{ entry.amount }} stk.
                      </p>
                    </v-col>
                  </v-row>
                  <v-row class="pa-0">
                    <v-col class="pa-0 pt-1 d-flex justify-center">
                      <v-btn
                        @click="ViewMore"
                        size="small"
                        variant="text"
                        color="#009fe4"
                      >
                        Vis alle detaljer
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </td>
            </tr>
          </template>
          <tr v-if="ShowMoreLink">
            <td colspan="5" class="text-end">
              <p class="d-flex justify-end align-center text-end">
                <router-link to="/min-pant" class="see-all-link">
                  Se alle
                  <v-icon icon="mdi mdi-arrow-right" size="small"></v-icon>
                </router-link>
              </p>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="!IsPriceHidden && !IsAmountHidden">
          <tr>
            <td colspan="2" class="font-weight-bold">Total:</td>
            <!-- <td class="font-weight-bold">{{ totalAmount }}</td> -->
            <td colspan="2" class="font-weight-bold">{{ totalPrice }}</td>
          </tr>
        </tfoot>
      </v-table>
    </v-card>
  </div>
</template>

<script>
//import ActivityDataService from "@/services/ActivityDataService";
export default {
  name: "PantHistory",
  props: {
    IsPriceHidden: {
      type: Boolean,
      default: false,
    },
    IsAmountHidden: {
      type: Boolean,
      default: false,
    },
    IsExpandable: {
      type: Boolean,
      default: true,
    },
    ShowMoreLink: {
      type: Boolean,
      default: false,
    },
  },
  inject: ["activities"],
  data() {
    return {
      selectedRow: null,
      expandRow: false,
      isLoading: false,
      statusMap: {
        1: "Gemt",
        2: "Afhenter",
        3: "Afhentet",
        4: "Afsluttet",
      },
    };
  },
  computed: {
    displayedActivities() {
      if (this.IsPriceHidden || this.IsAmountHidden) {
        return this.ProcessedActivities.slice(0, 5);
      }
      return this.ProcessedActivities;
    },
    totalAmount() {
      return this.ProcessedActivities.reduce(
        (sum, entry) => sum + entry.amount,
        0
      );
    },
    totalPrice() {
      return this.ProcessedActivities.reduce(
        (sum, entry) => sum + entry.price,
        0
      );
    },
    formattedDate() {
      const date = new Date(this.date);
      return date.toLocaleDateString();
    },
    ProcessedActivities() {
      // Ensure activities is available and is an array
      if (!this.activities || !Array.isArray(this.activities)) {
        return [];
      }
      
      // Calculate totals for each activity before displaying
      const processedActivities = this.activities.map((activity) => {
        const items = activity.activityItems || [];

        // Calculate total quantity for this activity
        const amount = items.reduce((sum, item) => sum + item.quantity, 0);

        // Calculate total price: quantity * category price
        const price = items.reduce((sum, item) => {
          const unitPrice = item.product?.category?.price || 0;
          return sum + item.quantity * unitPrice;
        }, 0);

        return {
          ...activity,
          amount,
          price,
        };
      });

      processedActivities.sort((a, b) => new Date(b.date) - new Date(a.date));

      if (this.IsPriceHidden || this.IsAmountHidden) {
        return processedActivities.slice(0, 5);
      }
      return processedActivities;
    },
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case 1:
          return "green-darken-1";
        case 2:
          return "orange-darken-1";
        case 3:
          return "blue-darken-1";
        default:
          return "grey";
      }
    },
    selectRow(index) {
      if (this.IsExpandable === false) {
        return;
      }
      if (this.selectedRow === index) {
        this.clearSelection();
        return;
      }
      this.selectedRow = index;
      this.expandRow = true;
    },
    clearSelection() {
      this.selectedRow = null;
      this.expandRow = false;
    },
    ViewMore() {
      const selectedActivity = this.displayedActivities[this.selectedRow];
      console.log("Selected Activity:", selectedActivity);
      if (selectedActivity && selectedActivity.activityId) {
        this.$router.push(`/scanning/${selectedActivity.activityId}`);
      }
    },
  },
  created() {
    // console.log(this.activities);
    //this.isLoading = true;
    /*
    ActivityDataService.getAll()
      .then((response) => {
        this.activities = response.data;
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      })
      .finally(() => {
        this.isLoading = false;
      });
      */
  },
};
</script>

<style scoped>
.total {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  padding: 10px 20px;
}

h2 {
  margin-bottom: 20px;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.clickable-row:hover {
  background-color: #f5f5f5;
}

.row-selected {
  background-color: #eeeeee !important;
}

.expanded-details {
  background-color: #fafafa;
}

.items-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-row {
  display: grid;
  justify-content: space-between;
  grid-template-columns: 1fr auto auto;
  gap: 12px;
  font-size: 0.75rem;
  padding: 2px 0;
}

.view-more-container {
  text-align: right;
  margin-top: 8px;
}

.item-type {
  color: #424242;
}

.item-quantity {
  color: #424242;
  font-weight: 500;
  min-width: 60px;
  text-align: right;
}

.pant-history-link {
  text-align: right;
  margin: 10px 20px 0 0;
  font-size: small;
}

.see-all-link {
  color: #009fe4;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.v-chip {
  width: -webkit-fill-available;
  place-content: center;
}
</style>
