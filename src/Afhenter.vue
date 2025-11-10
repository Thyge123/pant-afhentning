<template>
  <section class="app">

    <header class="header-title">Afhenter</header>

    <section class="topbar">
      <section class="dots">
        
      </section>
      <button class="menu-btn">☰</button>
    </section>


    <section class="panel">
      <h3>Pant til afhentning</h3>
      <table>
        <thead>
          <tr>
            <th>Adresse</th>
            <th class="right">Antal</th>
            <th class="right">Kr.</th>
          </tr>
        </thead>

        <tbody>
          <tr 
            v-for="item in toPickup" 
            :key="item.address"
            @click="moveToPickedUp(item)"
            style="cursor:pointer;"
          >
            <td>{{ item.address }}</td>
            <td class="right">{{ item.count }}</td>
            <td class="right">{{ item.amount }}</td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <td>Total</td>
            <td class="right">{{ pickupTotal.count }}</td>
            <td class="right">{{ pickupTotal.amount }}</td>
          </tr>
        </tfoot>
      </table>
    </section>


    <section class="panel">
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
        { address: "Berlin, Tyskland", date: "20/02 - 1989", count: 7, amount: 150 },
      ]
    }
  },

  computed: {
    pickupTotal() {
      return this.toPickup.reduce((sum, item) => (
        sum.count += item.count,
        sum.amount += item.amount,
        sum
      ), { count: 0, amount: 0 })
    },

    pickedUpTotal() {
      return this.pickedUp.reduce((sum, item) => (
        sum.count += item.count,
        sum.amount += item.amount,
        sum
      ), { count: 0, amount: 0 })
    }
  },

  methods: {
    moveToPickedUp(item) {
      this.toPickup = this.toPickup.filter(i => i !== item);
      this.pickedUp.push({
        address: item.address,
        count: item.count,
        amount: item.amount,
        date: new Date().toLocaleDateString("da-DK")
      });
    }
  }
}
</script>

<style scoped>
@import "../styles/afhenter.css";
</style>
