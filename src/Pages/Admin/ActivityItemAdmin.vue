<template>
  <v-container fluid>
    <v-sheet>
      <v-data-table
        :headers="headers"
        :items="activityItems"
        item-key="itemId"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Aktivitets Item Administration</v-toolbar-title>
            <v-btn
              v-if="activityItems.length > 0"
              class="me-2"
              prepend-icon="mdi-plus"
              rounded="lg"
              text="Tilføj et Aktivitets Item"
              border
              @click="
                dialog = true;
                isEditing = false;
              "
            >
            </v-btn>
          </v-toolbar>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editActivityItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="DeleteActivityItem(item.itemId)">
            mdi-delete
          </v-icon>
        </template>

        <template v-slot:no-data>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Tilføj et nyt aktivitets item."
            border
            @click="
              dialog = true;
              isEditing = false;
            "
          ></v-btn>
        </template>
      </v-data-table>
    </v-sheet>
    <v-btn
      color="red"
      class="deleteAllActivityItems"
      @click="DeleteAllActivityItems"
      v-if="activityItems.length > 0"
      >Slet Alle Items</v-btn
    >
    <v-dialog v-model="dialog" max-width="1000">
      <v-card
        :subtitle="`${isEditing ? 'Opdater' : 'Opret'} et Aktivitets Item`"
        :title="`${isEditing ? 'Rediger' : 'Tilføj'} et Aktivitets Item`"
      >
        <template #[`text`]>
          <v-row>
            <v-col cols="12">
              <v-select
                :items="activities"
                item-title="activityId"
                item-value="id"
                v-model="ActivityId"
                label="Vælg en Aktivitet"
                required
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                :items="products"
                item-title="name"
                item-value="productId"
                v-model="ProductId"
                label="Vælg et Produkt"
                required
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="quantity"
                label="Antal"
                type="number"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
        <template #[`actions`]>
          <v-btn text @click="dialog = false"> Annuller </v-btn>
          <v-btn
            color="primary"
            @click="isEditing ? UpdateActivityItem() : CreateActivityItem()"
          >
            {{ isEditing ? "Opdater" : "Opret" }}
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ActivityItemDataService from "@/services/ActivityItemDataService";
import ActivityDataService from "@/services/ActivityDataService";
import ProductDataService from "@/services/ProductDataService";

export default {
  name: "ActivityItemAdmin",
  data() {
    return {
      activityItems: [],
      activities: [],
      products: [],
      headers: [
        { title: "ID", key: "itemId" },
        { title: "Aktivitet ID", key: "activityId" },
        { title: "Produkt ID", key: "product.name" },
        { title: "Antal", key: "quantity" },
        { title: "", key: "actions", sortable: false, align: "end" },
      ],
      dialog: false,
      isEditing: false,
      itemId: null,
      ActivityId: null,
      ProductId: null,
      quantity: null,
    };
  },
  methods: {
    getActivityItems() {
      ActivityItemDataService.getAll()
        .then((response) => {
          this.activityItems = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getActivities() {
      ActivityDataService.getAll()
        .then((response) => {
          this.activities = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getProducts() {
      ProductDataService.getAll()
        .then((response) => {
          this.products = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    CreateActivityItem() {
      ActivityItemDataService.create({
        activityId: this.ActivityId,
        productId: this.ProductId,
        quantity: this.quantity,
      })
        .then(() => {
          this.getActivityItems();
          this.dialog = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    editActivityItem(item) {
      this.dialog = true;
      this.isEditing = true;
      this.itemId = item.itemId;
      this.ActivityId = item.activityId;
      this.ProductId = item.productId;
      this.quantity = item.quantity;
    },
    UpdateActivityItem() {
      ActivityItemDataService.update(this.itemId, {
        activityId: this.ActivityId,
        productId: this.ProductId,
        quantity: this.quantity,
      })
        .then(() => {
          this.getActivityItems();
          this.dialog = false;
          this.isEditing = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    DeleteActivityItem(itemId) {
      if (confirm("Er du sikker på, at du vil slette dette aktivitets item?")) {
        ActivityItemDataService.delete(itemId)
          .then(() => {
            this.getActivityItems();
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        return;
      }
    },
    DeleteAllActivityItems() {
      if (confirm("Er du sikker på, at du vil slette alle aktivitets items?")) {
        ActivityItemDataService.deleteAll()
          .then(() => {
            this.getActivityItems();
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        return;
      }
    },
  },
  created() {
    this.getActivityItems();
    this.getActivities();
    this.getProducts();
  },
};
</script>

<style></style>
