<template>
  <v-container class="pa-2">
    <v-container>
      <v-row class="ga-4">
        <v-col class="pa-0">
          <router-link to="/scan" class="text-decoration-none">
            <v-card class="bg-primary align-center pa-2 h-100">
              <p><v-icon icon="mdi-barcode-scan"></v-icon></p>
              <p>Start scanning</p>
            </v-card>
          </router-link>
        </v-col>
        <v-col class="pa-0">
          <router-link to="/min-pant" class="text-decoration-none">
            <v-card class="bg-primary align-center pa-2 h-100">
              <p><v-icon icon="mdi-recycle-variant"></v-icon></p>
              <p>Min pant</p>
            </v-card>
          </router-link>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row class="">
        <v-col class="pa-0 ga-4">
          <h3>Seneste aktivitet</h3>
          <!--
          <PantHistory
            :IsPriceHidden="true"
            :IsAmountHidden="true"
            :IsExpandable="false"
            :ShowMoreLink="true"
          />
          -->
          <v-card class="align-center pa-2" elevation="5">
            <v-row
              v-for="(activity, index) in showMore
                ? activities.slice(0, 10)
                : activities.slice(0, 5)"
              :key="index"
              no-gutters
              class="ma-1 justify-between"
            >
              <v-col cols="8" class="d-flex-row align-center">
                <p class="text-body-2 font-weight-medium">
                  Scannet: {{ activity.date }}
                </p>
                <p class="text-caption">{{ statusMap[activity.status] }}</p>
              </v-col>
              <v-col cols="3" class="">
                <p
                  class="ma-1 pa-1 rounded text-center bg-dark font-weight-bold"
                  :class="getStatusColor(activity.status)"
                >
                  {{ activity.price }} kr.
                </p>
              </v-col>
              <v-col cols="1" class="d-flex align-center justify-center">
                <router-link
                  :to="`/scanning/${activity.id}`"
                  class="text-decoration-none text-dark"
                >
                  <p class="text-center">
                    <v-icon icon="mdi-chevron-right"></v-icon>
                  </p>
                </router-link>
              </v-col>
              <v-divider />
            </v-row>
            <v-row v-if="activities.length > 5" class="ma-1 justify-between">
              <v-col class="pa-0">
                <p
                  class="text-body-1 font-weight-medium text-center"
                  :class="showMore ? 'text-red' : 'text-primary'"
                  @click="showMore = !showMore"
                >
                  {{ showMore ? "Se færre" : "Se flere" }}
                </p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <OrderPickUpButton @open-dialog="dialog = true" />
    <OrderPickUpModal v-model="dialog" @close-dialog="dialog = false" />
  </v-container>
</template>

<script>
  //import PantHistory from "./PantHistory.vue";
  import OrderPickUpButton from "./OrderPickUpButton.vue";
  import OrderPickUpModal from "./OrderPickUpModal.vue";
  export default {
    inject: ["activities", "statusMap", "getStatusColor"],
    components: { OrderPickUpButton, OrderPickUpModal },
    data() {
      return {
        showMore: false,
        dialog: false,
      };
    },
  };
</script>

<style scoped>
  .pant-history {
    padding: 20px 0px;
  }
</style>
