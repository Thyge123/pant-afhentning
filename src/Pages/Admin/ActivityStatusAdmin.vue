<template>
  <v-container fluid>
    <v-sheet>
      <v-data-table
        :headers="headers"
        :items="activityStatuses"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Aktivitets Status Administration</v-toolbar-title>
            <v-btn
              v-if="activityStatuses.length > 0"
              class="me-2"
              prepend-icon="mdi-plus"
              rounded="lg"
              text="Tilføj en Aktivitets Status"
              border
              @click="
                dialog = true;
                isEditing = false;
              "
            ></v-btn>
          </v-toolbar>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="EditActivityStatus(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="DeleteActivityStatus(item.id)">
            mdi-delete
          </v-icon>
        </template>
        <template #[`item.status`]="{ item }">
          <v-chip :color="getStatusColor(item.status)" label small>
            {{ item.status }}
          </v-chip>
        </template>
        <template v-slot:no-data>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Tilføj en Aktivitets Status"
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
      class="deleteAllStatuses"
      v-if="activityStatuses.length > 0"
      @click="DeleteAllActivityStatuses"
      >Slet Alle Statusser</v-btn
    >
    <v-dialog v-model="dialog" max-width="1000">
      <v-card
        :subtitle="`${isEditing ? 'Opdater' : 'Opret'} en Aktivitets Status`"
        :title="`${isEditing ? 'Rediger' : 'Tilføj'} en Aktivitets Status`"
      >
        <template #[`text`]>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Status Navn"
                v-model="status"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
        <v-divider></v-divider>
        <template #[`actions`]>
          <v-btn variant="text" @click="dialog = false"> Annuller </v-btn>
          <v-btn
            color="primary"
            @click="isEditing ? UpdateActivityStatus() : CreateActivityStatus()"
          >
            Gem
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ActivityStatusDataService from "@/services/ActivityStatusDataService";
export default {
  name: "ActivityStatusAdmin",
  data() {
    return {
      dialog: false,
      isEditing: false,
      activityStatuses: [],
      headers: [
        { title: "ID", key: "statusId" },
        { title: "Status", key: "status" },
        { title: "", key: "actions", sortable: false, align: "end" },
      ],
      id: null,
      status: "",
    };
  },
  methods: {
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
    getActivityStatuses() {
      ActivityStatusDataService.getAll()
        .then((response) => {
          this.activityStatuses = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    CreateActivityStatus() {
      const activityStatus = {
        status: this.status,
      };
      ActivityStatusDataService.create(activityStatus)
        .then(() => {
          this.getActivityStatuses();
          this.dialog = false;
          this.status = "";
        })
        .catch((e) => {
          console.log(e);
        });
    },
    EditActivityStatus(item) {
      this.id = item.statusId;
      this.status = item.status;
      this.isEditing = true;
      this.dialog = true;
    },
    UpdateActivityStatus() {
      const activityStatus = {
        statusId: this.id,
        status: this.status,
      };
      ActivityStatusDataService.update(this.id, activityStatus)
        .then(() => {
          this.getActivityStatuses();
          this.dialog = false;
          this.status = "";
        })
        .catch((e) => {
          console.log(e);
        });
    },
    DeleteActivityStatus(id) {
      if (
        confirm("Er du sikker på, at du vil slette denne aktivitets status?")
      ) {
        ActivityStatusDataService.delete(id)
          .then(() => {
            this.getActivityStatuses();
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        // User canceled the deletion
        return;
      }
    },
    DeleteAllActivityStatuses() {
      if (
        confirm("Er du sikker på, at du vil slette alle aktivitets statusser?")
      ) {
        ActivityStatusDataService.deleteAll()
          .then(() => {
            this.getActivityStatuses();
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        // User canceled the deletion
        return;
      }
    },
  },
  created() {
    this.getActivityStatuses();
  },
};
</script>

<style scoped>
.deleteAllStatuses {
  margin-top: 16px;
  float: right;
}
</style>
