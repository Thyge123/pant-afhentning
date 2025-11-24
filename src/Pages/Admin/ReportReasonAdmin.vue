<template>
  <v-container fluid>
    <v-sheet>
      <v-data-table :headers="Headers" :items="reasons" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Rapport Årsag Administration</v-toolbar-title>
            <v-btn
              v-if="reasons.length > 0"
              class="me-2"
              prepend-icon="mdi-plus"
              rounded="lg"
              text="Tilføj en Årsag"
              border
              @click="
                dialog = true;
                isEditing = false;
              "
            ></v-btn>
          </v-toolbar>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="EditReason(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="DeleteReason(item.reportReasonId)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Tilføj en ny rapport årsag."
            border
            @click="
              dialog = true;
              isEditing = false;
            "
          ></v-btn>
        </template>
      </v-data-table>
    </v-sheet>
    <v-btn color="red" class="deleteAllReasons" v-if="reasons.length > 0"
      >Slet Alle Årsager</v-btn
    >
    <v-dialog v-model="dialog" max-width="500">
      <v-card
        :title="`${isEditing ? 'Rediger' : 'Tilføj'} en Rapport Årsag`"
        :subtitle="`${isEditing ? 'Opdater' : 'Opret'} en Rapport Årsag`"
      >
        <template #text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Årsag"
                v-model="reason"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
        <template #actions>
          <v-btn text @click="dialog = false">Annuller</v-btn>
          <v-btn
            color="primary"
            @click="isEditing ? UpdateReason() : CreateReason()"
            >Gem</v-btn
          >
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ReportReasonDataService from "@/services/ReportReasonDataService";
export default {
  name: "ReportReasonAdmin",
  data() {
    return {
      reasons: [],
      Headers: [
        { title: "Årsag ID", key: "reportReasonId" },
        { title: "Årsag", key: "reason" },
        { title: "", key: "actions", sortable: false, align: "end" },
      ],
      dialog: false,
      isEditing: false,
      reportReasonId: null,
      reason: "",
    };
  },
  methods: {
    getReasons() {
      ReportReasonDataService.getAll()
        .then((response) => {
          this.reasons = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    CreateReason() {
      const newReason = {
        reason: this.reason,
      };
      ReportReasonDataService.create(newReason)
        .then(() => {
          this.getReasons();
          this.dialog = false;
          this.reason = "";
        })
        .catch((e) => {
          console.log(e);
        });
    },
    UpdateReason() {
      const updatedReason = {
        reportReasonId: this.reportReasonId,
        reason: this.reason,
      };
      ReportReasonDataService.update(this.reportReasonId, updatedReason)
        .then(() => {
          this.getReasons();
          this.dialog = false;
          this.reason = "";
          this.reportReasonId = null;
          this.isEditing = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    EditReason(reason) {
      this.reportReasonId = reason.reportReasonId;
      this.reason = reason.reason;
      this.dialog = true;
      this.isEditing = true;
    },
    DeleteReason(reportReasonId) {
      ReportReasonDataService.delete(reportReasonId)
        .then(() => {
          this.getReasons();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    DeleteAllReasons() {
      ReportReasonDataService.deleteAll()
        .then(() => {
          this.getReasons();
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  created() {
    this.getReasons();
  },
};
</script>

<style scoped>
.deleteAllReasons {
  margin-top: 16px;
  float: right;
}
</style>
