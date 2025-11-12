<template>
  <div class="pa-0 pant-history">
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
              
              <td class="text-no-wrap">{{ entry.date }}</td>
              <td>
                <v-chip :color="getStatusColor(entry.status)" label small>
                  {{ statusMap[entry.status] }}
                </v-chip>
              </td>
              <!-- <td>{{ entry.amount }}</td> -->
              <td>{{ entry.price }}</td>
              <td v-if="selectedRow !== index && IsExpandable">
                <v-icon icon="mdi mdi-chevron-down" size="x-small"></v-icon>
              </td>
              <td v-else-if="IsExpandable">
                <v-icon icon="mdi mdi-chevron-up" size="x-small"></v-icon>
              </td>
            </tr>
            <tr v-if="selectedRow === index && expandRow && entry.items">
              <td colspan="5" class="expanded-details">
                <div class="items-grid">
                  <div
                    v-for="(item, i) in entry.items"
                    :key="i"
                    class="item-row"
                  >
                    <span class="item-type">{{ item.type }}</span>
                    <span class="item-quantity">{{ item.quantity }} stk.</span>
                  </div>
                  <v-btn
                    @click="ViewMore"
                    size="small"
                    variant="text"
                    color="#009fe4"
                    >Vis alle detaljer</v-btn
                  >
                </div>
              </td>
            </tr>
          </template>
          <tr v-if="ShowMoreLink">
            <td colspan="5" class="text-end">
              <p class="d-flex justify-end align-center text-end">
                <router-link to="/min-pant" class="see-all-link">
                  Se alle <v-icon icon="mdi mdi-arrow-right" size="small"></v-icon>
                </router-link>
              </p>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="!IsPriceHidden && !IsAmountHidden">
          <tr>
            <td class="font-weight-bold">Total:</td>
            <td></td>
            <!-- <td class="font-weight-bold">{{ totalAmount }}</td> -->
            <td class="font-weight-bold">{{ totalPrice }}</td>
            <td v-if="IsExpandable"></td>
          </tr>
        </tfoot>
      </v-table>
    </v-card>
  </div>
</template>

<script>
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
        /*
        pantHistory: [
          {
            date: "2024-01-01",
            status: "Gemt",
            items: [
              { type: "Faxe Kondi 0.33L", pant: "A", quantity: 30 },
              { type: "Coca Cola 0.5L", pant: "B", quantity: 20 },
              { type: "Pepsi 1.5L", pant: "C", quantity: 10 },
            ],
          },
          {
            date: "2024-02-15",
            status: "Afhentet",
            items: [
              { type: "Faxe Kondi 0.33L", pant: "A", quantity: 30 },
              { type: "Coca Cola 0.5L", pant: "B", quantity: 20 },
              { type: "Pepsi 1.5L", pant: "C", quantity: 10 },
            ],
          },
          {
            date: "2024-03-10",
            status: "Afsluttet",
            items: [
              { type: "Faxe Kondi 0.33L", pant: "A", quantity: 30 },
              { type: "Coca Cola 0.5L", pant: "B", quantity: 20 },
              { type: "Pepsi 1.5L", pant: "C", quantity: 10 },
            ],
          },
        ],
        */
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
          return this.activities.slice(0, 5);
        }
        return this.activities;
      },
      totalAmount() {
        return this.activities.reduce((sum, entry) => sum + entry.amount, 0);
      },
      totalPrice() {
        return this.activities.reduce((sum, entry) => sum + entry.price, 0);
      },
      /*
      ProcessedPantHistory() {
        // Definer hvor meget hver pant type er værd
        const pantValues = {
          A: 1, // Dåser = 1 kr
          B: 1.5, // Flasker = 1.5 kr
          C: 3, // Store flasker = 3 kr
        };

        // Gå gennem hver objekt i arrayet og beregn total
        return this.pantHistory.map((entry) => {
          // Tæl det samlede antal flasker i hver entry
          const amount = entry.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          // Beregn totalprisen for hver entry
          // For hver vare: gang mængde med pantværdi
          const totalPrice = entry.items.reduce(
            (sum, item) => sum + item.quantity * pantValues[item.pant],
            0
          );

          // Returner entry med de beregnede værdier tilføjet
          return {
            ...entry, // Behold alle originale data (dato, status, varer)
            amount, // Tilføj samlet flaskantal
            totalPrice, // Tilføj totalpris
          };
        });
      },
      */
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
        const selectedActivity = this.activities[this.selectedRow];
        if (selectedActivity && selectedActivity.id) {
          this.$router.push(`/scanning/${selectedActivity.id}`);
        }
      },
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
    border-bottom: 1px solid #e0e0e0;
    padding: 8px 16px;
  }

  .items-grid {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .item-row {
    display: grid;
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
