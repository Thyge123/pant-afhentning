<template>
  <v-container fluid>
    <v-sheet>
      <v-data-table :headers="headers" :items="activities" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Scanninger Administration</v-toolbar-title>
            <v-btn
              v-if="activities.length > 0"
              class="me-2"
              prepend-icon="mdi-plus"
              rounded="lg"
              text="Opret en Scanning"
              border
              @click="createActivity()"
            ></v-btn>
          </v-toolbar>
        </template>
        <template #[`item.activityStatus.status`]="{ item }">
          <v-chip
            :color="getStatusColor(item.activityStatus.status)"
            label
            small
          >
            {{ item.activityStatus.status }}
          </v-chip>
        </template>
        <!--If pickUp date is null-->
        <template #[`item.pickUpDate`]="{ item }">
          <v-chip v-if="!item.pickUpDate" color="red" label small>
            Ikke Afhentet
          </v-chip>
          <v-chip v-else label small>
            {{ item.pickUpDate }}
          </v-chip>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="EditActivity(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="DeleteActivity(item.id)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Opret en ny Scanning."
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
      class="deleteAllActivities"
      v-if="activities.length > 0"
      @click="DeleteAllActivities"
      >Slet Alle Scanninger</v-btn
    >
    <v-dialog v-model="dialog" max-width="1000">
      <v-card
        :subtitle="`${isEditing ? 'Opdater' : 'Opret'} en Scanning`"
        :title="`${isEditing ? 'Rediger' : 'Tilføj'} en Scanning`"
      >
        <template #[`text`]>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Dato"
                v-model="date"
                variant="outlined"
                type="date"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                label="Status"
                v-model="statusId"
                variant="outlined"
                :items="statuses"
                item-title="status"
                item-value="statusId"
              ></v-select>
            </v-col>
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
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Afhentnings Dato"
                v-model="pickUpDate"
                variant="outlined"
                type="date"
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
        <v-divider></v-divider>
        <template #[`actions`]>
          <v-btn text @click="dialog = false"> Annuller </v-btn>
          <v-btn
            color="primary"
            @click="isEditing ? UpdateActivity() : createActivity()"
          >
            {{ isEditing ? "Opdater" : "Opret" }}
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ActivityDataService from "@/services/ActivityDataService";
import ActivityStatusDataService from "@/services/ActivityStatusDataService";
import UserDataService from "@/services/UserDataService";
export default {
  name: "ScanningerAdmin",
  data() {
    return {
      activities: [],
      statuses: [],
      users: [],
      headers: [
        { title: "Aktivitets ID", key: "activityId" },
        { title: "Status", key: "activityStatus.status" },
        { title: "Dato", key: "date" },
        {
          title: "Bruger",
          key: "userFullName",
          value: (item) =>
            item.user ? `${item.user.firstName} ${item.user.lastName}` : "",
        },
        { title: "Afhentnings Dato", key: "pickUpDate" },
        { title: "", key: "actions", sortable: false, align: "end" },
      ],
      dialog: false,
      isEditing: false,
      activityId: null,
      date: "",
      statusId: null,
      userId: null,
      pickUpDate: null,
    };
  },
  computed: {
    UsersWithFullName() {
      this.users.map((user) => {
        user.fullName = `${user.firstName} ${user.lastName}`;
        console.log(this.UsersWithFullName);
        return user;
      });
      return this.users;
    },
  },
  methods: {
    getActivities() {
      ActivityDataService.getAll()
        .then((response) => {
          this.activities = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getStatuses() {
      ActivityStatusDataService.getAll()
        .then((response) => {
          this.statuses = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getUsers() {
      UserDataService.getAll()
        .then((response) => {
          this.users = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getStatusColor(status) {
      switch (status) {
        case "Gemt":
          return "green-darken-1";
        case "Afhenter":
          return "orange-darken-1";
        case "Afhentet":
          return "blue-darken-1";
        case "Afsluttet":
          return "grey-darken-1";
        default:
          return "grey";
      }
    },
    createActivity() {
      const activity = {
        date: new Date().toISOString(),
        statusId: this.statusId,
        userId: this.userId,
        pickUpDate: this.pickUpDate,
      };
      ActivityDataService.create(activity)
        .then(() => {
          this.getActivities();
          this.dialog = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    EditActivity(item) {
      this.isEditing = true;
      this.dialog = true;
      console.log(item);
      this.activityId = item.activityId;
      this.date = item.date ? item.date.split("T")[0] : "";
      this.statusId = item.statusId;
      this.userId = item.userId;
      this.pickUpDate = item.pickUpDate ? item.pickUpDate.split("T")[0] : null;
    },
    UpdateActivity() {
      const updatedActivity = {
        activityId: this.activityId,
        date: this.date,
        statusId: this.statusId,
        userId: this.userId,
        pickUpDate: this.pickUpDate,
      };
      ActivityDataService.update(this.activityId, updatedActivity)
        .then(() => {
          this.getActivities();
          this.dialog = false;
          this.activityId = null;
          this.date = "";
          this.statusId = null;
          this.userId = null;
          this.pickUpDate = null;
          this.isEditing = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    DeleteActivity(id) {
      if (confirm("Er du sikker på, at du vil slette denne scanning?")) {
        ActivityDataService.delete(id)
          .then(() => {
            this.getActivities();
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        return;
      }
    },
    DeleteAllActivities() {
      ActivityDataService.deleteAll()
        .then(() => {
          this.getActivities();
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  created() {
    this.getActivities();
    this.getStatuses();
    this.getUsers();
  },
};
</script>

<style scoped></style>
