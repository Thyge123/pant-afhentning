<template>
  <v-container class="pa-4">
    <v-card elevation="5" class="mb-4">
      <v-card-title class="bg-primary text-white">
        <h2>Min Profil</h2>
      </v-card-title>

      <v-card-text class="pa-4">
        <div class="profile-section mb-4">
          <h3 class="text-h6 mb-3">Personlig Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <div class="text-subtitle-2 text-grey">Fornavn</div>
              <div class="text-body-1">{{ firstName }}</div>
            </div>
            <div class="info-item">
              <div class="text-subtitle-2 text-grey">Efternavn</div>
              <div class="text-body-1">{{ lastName }}</div>
            </div>
            <div class="info-item">
              <div class="text-subtitle-2 text-grey">Email</div>
              <div class="text-body-1">{{ email }}</div>
            </div>
            <div class="info-item">
              <div class="text-subtitle-2 text-grey">Fødselsdato</div>
              <div class="text-body-1">
                {{ birthDateFormatted }}
              </div>
            </div>
          </div>
        </div>

        <v-divider class="my-4"></v-divider>

        <div class="profile-section mb-4">
          <h3 class="text-h6 mb-3">Adresse</h3>
          <div class="info-grid">
            <div class="info-item">
              <div class="text-subtitle-2 text-grey">Vejnavn</div>
              <div class="text-body-1">{{ address.street }}</div>
            </div>
            <div class="info-item">
              <div class="text-subtitle-2 text-grey">By</div>
              <div class="text-body-1">{{ address.city }}</div>
            </div>
            <div class="info-item">
              <div class="text-subtitle-2 text-grey">Postnummer</div>
              <div class="text-body-1">{{ address.postalCode }}</div>
            </div>
          </div>
        </div>

        <v-divider class="my-4"></v-divider>

        <div class="profile-section">
          <h3 class="text-h6 mb-3">Statistik</h3>
          <div class="stats-container">
            <div class="stat-item">
              <div class="text-h4 font-weight-bold text-primary">
                {{ this.activities.length }}
              </div>
              <div class="text-subtitle-2 text-grey">Total Scanninger</div>
            </div>
            <div class="stat-item">
              <div class="text-h4 font-weight-bold text-primary">
                {{ totalPrice }} kr
              </div>
              <div class="text-subtitle-2 text-grey">Total Pant Værdi</div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-card elevation="5">
      <v-card-title class="bg-primary text-white">
        <h2>Indstillinger</h2>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-list>
          <v-list-item>
            <v-list-item-title>Notifikationer</v-list-item-title>
            <v-list-item-subtitle
              >Modtag opdateringer om dine scanninger</v-list-item-subtitle
            >

            <v-list-item-action>
              <v-switch color="primary" v-model="notifications"></v-switch>
            </v-list-item-action>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-title>Email påmindelser</v-list-item-title>
            <v-list-item-subtitle
              >Få email når pant er klar til afhentning</v-list-item-subtitle
            >
            <v-list-item-action>
              <v-switch color="primary" v-model="emailReminders"></v-switch>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <!--Log ud-->
    <v-btn class="mt-4 mb-4" color="error" block @click="$router.push('/login')"
      >Log ud</v-btn
    >
  </v-container>
</template>

<script>
export default {
  name: "MyProfile",
  inject: ["activities", "loggedInUser"],
  data() {
    return {
      notifications: true,
      emailReminders: false,
      firstName: "",
      lastName: "",
      email: "",
      birthDate: "",
      address: {
        street: "",
        city: "",
        postalCode: "",
      },
    };
  },
  computed: {
    totalPrice() {
      console.log("Calculating total price from activities:", this.activities);
      if (!this.activities || this.activities.length === 0) return 0;

      return this.activities.reduce((total, activity) => {
        if (!activity.activityItems) return total;

        const activityTotal = activity.activityItems.reduce(
          (sum, item) => sum + item.quantity * item.product.category.price,
          0
        );
        return total + activityTotal;
      }, 0);
    },
    currentUser() {
      return this.loggedInUser ? this.loggedInUser() : null;
    },
    birthDateFormatted() {
      if (!this.birthDate) return "";
      const date = new Date(this.birthDate);
      return date.toLocaleDateString();
    },
  },
  created() {
    console.log("Logged in user in MyProfile:", this.currentUser);
    if (this.currentUser) {
      this.firstName = this.currentUser.firstName;
      this.lastName = this.currentUser.lastName;
      this.email = this.currentUser.email;
      this.birthDate = this.currentUser.birthDate;
      const addrParts = this.currentUser.address
        .split(",")
        .map((part) => part.trim());
      this.address.street = addrParts[0] || "";
      this.address.postalCode = addrParts[1] ? addrParts[1].split(" ")[0] : "";
      this.address.city = addrParts[1]
        ? addrParts[1].split(" ").slice(1).join(" ")
        : "";
    }
  },
};
</script>

<style scoped>
.profile-section {
  margin-bottom: 16px;
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.info-item {
  flex: 1 1 calc(50% - 20px);
  min-width: 200px;
}

.stats-container {
  display: flex;
  justify-content: space-around;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f5f5;
  min-width: 150px;
}
</style>
