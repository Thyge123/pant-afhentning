<template>
  <div class="pant-history">
    <h2>Min pant</h2>
    <v-card>
      <div>
        <p class="pant-history-link">
          <router-link to="/login" class="see-all-link">
            Mere<v-icon icon="mdi mdi-arrow-right" size="x-small"></v-icon
          ></router-link>
        </p>
      </div>
      <v-table>
        <thead>
          <tr>
            <th class="text-left"></th>
            <th class="text-left">Dato</th>
            <th class="text-left">Status</th>
            <th class="text-left">Antal</th>
            <th class="text-left">Kr.</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(entry, index) in pantHistory" :key="index">
            <tr
              @click="selectRow(entry)"
              class="clickable-row"
              :class="{ 'row-selected': selectedRow === entry }"
            >
              <td v-if="selectedRow !== entry">
                <v-icon icon="mdi mdi-plus" size="x-small"></v-icon>
              </td>
              <td v-else>
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
            <transition name="expand">
              <tr v-if="selectedRow === entry && expandRow && entry.items">
                <td colspan="5" class="expanded-details">
                  <div class="pa-4">
                    <p class="font-weight-bold mb-2">Detaljer:</p>
                    <p v-for="(item, i) in entry.items" :key="i">
                      - {{ item.type }}: {{ item.quantity }} stk.
                    </p>
                  </div>
                </td>
              </tr>
            </transition>
          </template>
        </tbody>
        <tfoot>
          <tr>
            <td></td>
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
    data() {
      return {
        selectedRow: null,
        expandRow: false,
        pantHistory: [
          {
            date: "2024-01-01",
            status: "Gemt",
            amount: 50,
            totalPrice: 500,
            items: [
              { type: "Faxe Kondi 0.33L", pant: "A", quantity: 30 },
              { type: "Coca Cola 0.5L", pant: "B", quantity: 20 },
              { type: "Pepsi 1.5L", pant: "C", quantity: 10 },
            ],
          },
          {
            date: "2024-02-15",
            status: "Afhentet",
            amount: 30,
            totalPrice: 300,
            items: [
              { type: "Faxe Kondi 0.33L", pant: "A", quantity: 30 },
              { type: "Coca Cola 0.5L", pant: "B", quantity: 20 },
              { type: "Pepsi 1.5L", pant: "C", quantity: 10 },
            ],
          },
          {
            date: "2024-03-10",
            status: "Afsluttet",
            amount: 40,
            totalPrice: 400,
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
        return this.pantHistory.reduce((sum, entry) => sum + entry.amount, 0);
      },
      totalPrice() {
        return this.pantHistory.reduce(
          (sum, entry) => sum + entry.totalPrice,
          0
        );
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
      selectRow(entry) {
        if (this.selectedRow === entry) {
          this.clearSelection();
          return;
        }
        this.selectedRow = entry;
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
