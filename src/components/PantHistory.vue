<template>
  <div class="pant-history">
    <!--<h2>Min pant</h2>-->
    <v-card>
      <div>
        <p class="pant-history-link" v-if="ShowMoreLink">
          <router-link to="/min-pant" class="see-all-link">
            Mere<v-icon icon="mdi mdi-arrow-right" size="x-small"></v-icon
          ></router-link>
        </p>
      </div>
      <v-table>
        <thead>
          <tr>
            <th class="text-left" v-if="IsExpandable"></th>
            <th class="text-left">Dato</th>
            <th class="text-left">Status</th>
            <th class="text-left">Antal</th>
            <th class="text-left">Kr.</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(entry, index) in ProcessedPantHistory" :key="index">
            <tr
              @click="selectRow(index)"
              class="clickable-row"
              :class="{ 'row-selected': selectedRow === index }"
            >
              <td v-if="selectedRow !== index && IsExpandable">
                <v-icon icon="mdi mdi-plus" size="x-small"></v-icon>
              </td>
              <td v-else-if="IsExpandable">
                <v-icon icon="mdi mdi-minus" size="x-small"></v-icon>
              </td>
              <td>{{ entry.date }}</td>
              <td>
                <v-chip :color="getStatusColor(entry.status)" label small>
                  {{ entry.status }}
                </v-chip>
              </td>
              <td>{{ entry.amount }}</td>
              <td>{{ entry.totalPrice }}</td>
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
                </div>
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot v-if="!IsPriceHidden && !IsAmountHidden">
          <tr>
            <td v-if="IsExpandable"></td>
            <td class="font-weight-bold">Total:</td>
            <td></td>
            <td class="font-weight-bold">{{ totalAmount }}</td>
            <td class="font-weight-bold">{{ totalPrice }}</td>
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
    data() {
      return {
        selectedRow: null,
        expandRow: false,
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
      };
    },
    computed: {
      totalAmount() {
        return this.ProcessedPantHistory.reduce(
          (sum, entry) => sum + entry.amount,
          0
        );
      },
      totalPrice() {
        return this.ProcessedPantHistory.reduce(
          (sum, entry) => sum + entry.totalPrice,
          0
        );
      },
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
    },
    methods: {
      getStatusColor(status) {
        switch (status) {
          case "Afsluttet":
            return "green-darken-1";
          case "Afhentet":
            return "orange-darken-1";
          case "Gemt":
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
    },
  };
</script>

<style scoped>
  .pant-history {
    padding: 20px;
  }

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
  }

  .see-all-link .v-icon {
    vertical-align: middle;
    margin-left: 2px;
  }
</style>
