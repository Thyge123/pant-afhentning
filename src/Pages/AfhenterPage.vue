<template>
  <section class="app">
    <header class="header-title">Afhenter</header>

    <section class="afhentning">
      <h3>Pant til afhentning</h3>
      <table>
        <thead>
          <tr>
            <th>Adresse</th>
            <th class="right">Antal</th>
            <th class="right">Kr.</th>
            <th class="right"></th>
            <th class="right"></th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in toPickup"
            :key="item.address"
            style="cursor: pointer"
          >
            <td>{{ item.address }}</td>
            <td class="right">{{ item.count }}</td>
            <td class="right">{{ item.amount }}</td>
            <td class="right">
              <v-icon
                icon="mdi-map-marker"
                color="blue"
                @click="GoToMap(item)"
              ></v-icon>
            </td>
            <td class="right">
              <v-icon
                icon="mdi-check"
                color="green"
                @click="moveToPickedUp(item)"
              ></v-icon>
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <td>Total</td>
            <td class="right">{{ pickupTotal.count }}</td>
            <td class="right">{{ pickupTotal.amount }}</td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </section>

    <section class="hentet">
      <h3>Pant allerede hentet</h3>
      <table>
        <thead>
          <tr>
            <th>Adresse</th>
            <th class="right">Dato</th>
            <th class="right">Antal</th>
            <th class="right">Kr.</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in pickedUp" :key="item.address + item.date">
            <td>{{ item.address }}</td>
            <td class="right">{{ item.date }}</td>
            <td class="right">{{ item.count }}</td>
            <td class="right">{{ item.amount }}</td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <td>Total</td>
            <td></td>
            <td class="right">{{ pickedUpTotal.count }}</td>
            <td class="right">{{ pickedUpTotal.amount }}</td>
          </tr>
        </tfoot>
      </table>
    </section>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        toPickup: [
          { address: "21 Park Lane Circle, Ontario", count: 7, amount: 100 },
          { address: "221B Baker Street", count: 10, amount: 150 },
          { address: "Glenfinnan, Skotland", count: 20, amount: 200 },
          { address: "Dubrovnik, Kroatien", count: 20, amount: 200 },
        ],

        pickedUp: [
          {
            address: "Berlin, Tyskland",
            date: "20/02 - 1989",
            count: 7,
            amount: 150,
          },
        ],
        SelectedAddress: "",
      };
    },

    computed: {
      pickupTotal() {
        return this.toPickup.reduce(
          (sum, item) => (
            (sum.count += item.count), (sum.amount += item.amount), sum
          ),
          { count: 0, amount: 0 }
        );
      },

      pickedUpTotal() {
        return this.pickedUp.reduce(
          (sum, item) => (
            (sum.count += item.count), (sum.amount += item.amount), sum
          ),
          { count: 0, amount: 0 }
        );
      },
    },

    methods: {
      moveToPickedUp(item) {
        this.toPickup = this.toPickup.filter((i) => i !== item);
        this.pickedUp.push({
          address: item.address,
          count: item.count,
          amount: item.amount,
          date: new Date().toLocaleDateString("da-DK"),
        });
      },
      GoToMap(item) {
        this.SelectedAddress = item.address;
        this.$router.push({
          name: "Vejvisning",
          params: { address: this.SelectedAddress },
        });
      },
    },
  };
</script>

<style scoped>

  .app {
    background: white;
    color: #333;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  .header-title {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 14px;
    color: black;
  }

  .topbar {
    background: #555;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }


  .afhentning,
  .hentet {
    background: white;
    color: #333;
    border-radius: 12px;
    padding: 10px;
    margin-top: 14px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
  }

  .afhentning h3,
  .hentet h3 {
    margin: 4px 0 10px;
    font-size: 16px;
    font-weight: bold;
  }


  .afhentning table,
  .hentet table {
    width: 100%;
    font-size: 13px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  th,
  td {
    padding: 6px;
    border-bottom: 1px solid #eee;
    background: #fff; /* gør felterne hvide med let skygge omkring tabellen */
  }

  tfoot td {
    background: #ffffff;
    font-weight: bold;
  }

  th {
    text-align: left;
    font-weight: 600;
  }

  td.right,
  th.right {
    text-align: right;
  }

  .afhentning h3 { color: red; }
  .hentet h3 { color: green; }

 
  .afhentning thead th:nth-child(1),
  .afhentning thead th:nth-child(2),
  .afhentning thead th:nth-child(3) {
    color: red;
  }

  .hentet thead th:nth-child(1),
  .hentet thead th:nth-child(2),
  .hentet thead th:nth-child(3),
  .hentet thead th:nth-child(4) {
    color: green;
  }

  
  .afhentning tbody td:nth-child(1),
  .afhentning tbody td:nth-child(2),
  .afhentning tbody td:nth-child(3) {
    color: red;
  }

  .hentet tbody td:nth-child(1),
  .hentet tbody td:nth-child(2),
  .hentet tbody td:nth-child(3),
  .hentet tbody td:nth-child(4) {
    color: green;
  }

 
  .afhentning tfoot td {
    color: red;
  }

  .hentet tfoot td {
    color: green;
  }
</style>
