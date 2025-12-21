<template>
  <v-container fluid>
    <v-sheet>
      <v-data-table :headers="headers" :items="pickups" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>PickUp Administration</v-toolbar-title>
            <v-btn
              v-if="pickups.length > 0"
              class="me-2"
              prepend-icon="mdi-plus"
              rounded="lg"
              text="Tilføj en PickUp"
              border
              @click="
                dialog = true;
                isEditing = false;
              "
            ></v-btn>
          </v-toolbar>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="EditPickUp(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="DeletePickUp(item.pickUpId)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Tilføj en ny PickUp."
            border
            @click="
              dialog = true;
              isEditing = false;
            "
          ></v-btn>
        </template>
      </v-data-table>
    </v-sheet>
    <v-btn color="red" class="deleteAllPickUps" v-if="pickups.length > 0"
      >Slet Alle PickUps</v-btn
    >
    <v-dialog v-model="dialog" max-width="1000">
      <v-card
        :subtitle="`${isEditing ? 'Opdater' : 'Opret'} et Produkt`"
        :title="`${isEditing ? 'Rediger' : 'Tilføj'} et Produkt`"
      >
        <template #[`text`]>
          <v-row>
            <v-col cols="12">
              <v-select
                :items="UsersWithFullName"
                v-model="userId"
                item-title="fullName"
                item-value="userId"
                label="Bruger"
                variant="outlined"
                required
              ></v-select>
              <v-select
                :items="activities"
                item-title="activityId"
                item-value="activityId"
                label="Vælg en Aktivitet"
                required
              ></v-select>
            </v-col>
          </v-row>
        </template>
        <v-divider></v-divider>
        <template #[`actions`]>
          <v-btn text @click="dialog = false"> Annuller </v-btn>
          <v-btn
            color="primary"
            @click="isEditing ? UpdateProduct() : CreateProduct()"
          >
            {{ isEditing ? "Opdater" : "Opret" }}
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import PickUpDataService from "@/services/PickUpDataService";
  import ActivityDataService from "@/services/ActivityDataService";
  import UserDataService from "@/services/UserDataService";
  export default {
    name: "PickUpAdmin",
    data() {
      return {
        headers: [
          { title: "ID", key: "pickUpId" },
          {
            title: "Bruger",
            key: "userFullName",
            value: (item) =>
              item.user ? `${item.user.firstName} ${item.user.lastName}` : "",
          },
          { title: "Aktivitet", key: "activityId" },
          { title: "", key: "actions" },
        ],
        pickups: [],
        users: [],
        activities: [],
        dialog: false,
        isEditing: false,
        pickUpId: null,
        userId: null,
        activityId: null,
      };
    },
    computed: {
      PickUpsWithFullName() {
        return this.pickups.map((pickUp) => ({
          ...pickUp.user,
          fullName: `${pickUp.user.firstName} ${pickUp.user.lastName}`,
        }));
      },
      UsersWithFullName() {
        return this.users.map((user) => ({
          ...user,
          fullName: `${user.firstName} ${user.lastName}`,
        }));
      },
    },
    mounted() {
      this.fetchPickups();
      this.fetchActivities();
      this.fetchUsers();
    },
    methods: {
      fetchPickups() {
        PickUpDataService.getAll()
          .then((response) => {
            this.pickups = response.data;
          })
          .catch((e) => {
            console.error("Error fetching pickups:", e);
          });
      },
      fetchUsers() {
        UserDataService.getAll()
          .then((response) => {
            this.users = response.data;
          })
          .catch((e) => {
            console.error("Error fetching users:", e);
          });
      },
      fetchActivities() {
        ActivityDataService.getAll()
          .then((response) => {
            this.activities = response.data;
          })
          .catch((e) => {
            console.error("Error fetching activities:", e);
          });
      },
      CreatePickUp() {
        const newPickUp = {
          userId: this.userId,
          activityId: this.activityId,
        };
        PickUpDataService.create(newPickUp)
          .then(() => {
            this.fetchPickups();
            this.dialog = false;
          })
          .catch((e) => {
            console.error("Error creating pickup:", e);
          });
      },
      UpdatePickUp() {
        const updatedPickUp = {
          pickUpId: this.pickUpId,
          userId: this.userId,
          activityId: this.activityId,
        };
        PickUpDataService.update(this.pickUpId, updatedPickUp)
          .then(() => {
            this.fetchPickups();
            this.dialog = false;
          })
          .catch((e) => {
            console.error("Error updating pickup:", e);
          });
      },
      EditPickUp(item) {
        this.pickUpId = item.pickUpId;
        this.userId = item.userId;
        this.activityId = item.activityId;
        this.isEditing = true;
        this.dialog = true;
      },
      DeletePickUp(id) {
        PickUpDataService.delete(id)
          .then(() => {
            this.fetchPickups();
          })
          .catch((e) => {
            console.error("Error deleting pickup:", e);
          });
      },
      DeleteAllPickUps() {
        PickUpDataService.deleteAll()
          .then(() => {
            this.fetchPickups();
          })
          .catch((e) => {
            console.error("Error deleting all pickups:", e);
          });
      },
    },
  };
</script>

<style scoped>
  .deleteAllPickUps {
    margin-top: 16px;
    float: right;
  }
</style>
