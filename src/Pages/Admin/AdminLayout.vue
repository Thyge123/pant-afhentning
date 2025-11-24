<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
      >
        <v-list>
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
            title="Big boss Admin"
          >
            <template v-slot:append>
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                @click.stop="rail = !rail"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-home-city"
            title="Home"
            value="home"
            :to="{ name: 'admin-home' }"
          ></v-list-item>

          <v-list-item
            prepend-icon="mdi-account-group-outline"
            title="Users"
            value="users"
            :to="{ name: 'admin-users' }"
          ></v-list-item>

          <v-list-item
            prepend-icon="mdi-barcode-scan"
            title="Scanninger"
            value="scanninger"
            :to="{ name: 'admin-scanninger' }"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-cup-water"
            title="Pant Kategorier"
            value="categories"
            :to="{ name: 'admin-categories' }"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-chart-bar"
            title="Aktivitets Statusser"
            value="activity-statuses"
            :to="{ name: 'admin-activity-statuses' }"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-cart"
            title="Produkter"
            value="products"
            :to="{ name: 'admin-products' }"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-alert-circle-outline"
            title="Rapport Årsager"
            value="report-reasons"
            :to="{ name: 'admin-report-reasons' }"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main style="height: 80vh">
        <router-view />
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: "AdminPage",
  data() {
    return {
      drawer: true,
      rail: true,
    };
  },
};
</script>
