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
              text="Tilføj en Rapport"
              border
              @click="
                dialog = true;
                isEditing = false;
              "
            ></v-btn>
          </v-toolbar>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="EditReport(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="DeleteReport(item.reportId)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Tilføj en ny rapport."
            border
            @click="
              dialog = true;
              isEditing = false;
            "
          ></v-btn>
        </template>
      </v-data-table>
    </v-sheet>
    <v-btn color="red" class="deleteAllReports" v-if="reasons.length > 0"
      >Slet Alle Rapporter</v-btn
    >
    <v-dialog v-model="dialog" max-width="500">
      <v-card
        :title="`${isEditing ? 'Rediger' : 'Tilføj'} en Rapport`"
        :subtitle="`${isEditing ? 'Opdater' : 'Opret'} en Rapport`"
      >
        <template #text>
          <v-row>
            <v-col cols="12">
              <v-select
                :items="reportReasons"
                item-title="reason"
                item-value="reportReasonId"
                label="Vælg en Rapport Årsag"
                v-model="reportReasonId"
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Beskrivelse"
                variant="outlined"
                auto-grow
                rows="1"
                v-model="description"
              ></v-textarea>
            </v-col>

            <v-col cols="12">
              <v-select
                :items="activities"
                label="Aktivitet"
                v-model="activityId"
                variant="outlined"
                item-title="activityId"
                item-value="activityId"
              ></v-select>
            </v-col>
          </v-row>
        </template>
        <v-divider></v-divider>
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
import ReportDataService from "@/services/ReportDataService";
import ReportReasonDataService from "@/services/ReportReasonDataService";
import ActivityDataService from "@/services/ActivityDataService";
export default {
  name: "ReportAdmin",
  data() {
    return {
      reasons: [],
      reportReasons: [],
      activities: [],
      Headers: [
        { title: "Rapport ID", key: "reportId" },
        { title: "Beskrivelse", key: "description" },
        { title: "Årsag ID", key: "reportReasonId" },
        { title: "Aktivitets ID", key: "activityId" },
        { title: "", key: "actions", sortable: false, align: "end" },
      ],
      dialog: false,
      isEditing: false,
      reportReasonId: null,
      reportId: null,
      description: "",
      activityId: null,
    };
  },
  methods: {
    getReports() {
      ReportDataService.getAll()
        .then((response) => {
          this.reasons = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getReportReasons() {
      ReportReasonDataService.getAll()
        .then((response) => {
          this.reportReasons = response.data;
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
    createReport() {
      const newReport = {
        reportId: this.reportId,
        reportReasonId: this.reportReasonId,
        description: this.description,
        activityId: this.activityId,
      };
      ReportDataService.create(newReport)
        .then(() => {
          this.getReports();
          this.dialog = false;
          this.reportReasonId = null;
          this.reportId = null;
          this.description = "";
          this.activityId = null;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    UpdateReport() {
      const updatedReport = {
        reportId: this.reportId,
        reportReasonId: this.reportReasonId,
        description: this.description,
        activityId: this.activityId,
      };
      ReportDataService.update(this.reportId, updatedReport)
        .then(() => {
          this.getReports();
          this.dialog = false;
          this.reportReasonId = null;
          this.reportId = null;
          this.description = "";
          this.activityId = null;
          this.isEditing = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    EditReport(report) {
      this.reportReasonId = report.reportReasonId;
      this.reportId = report.reportId;
      this.description = report.description;
      this.activityId = report.activityId;
      this.dialog = true;
      this.isEditing = true;
    },
    DeleteReport(reportId) {
      ReportDataService.delete(reportId)
        .then(() => {
          this.getReports();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    DeleteAllReports() {
      ReportDataService.deleteAll()
        .then(() => {
          this.getReports();
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  created() {
    this.getReports();
    this.getReportReasons();
    this.getActivities();
  },
};
</script>

<style scoped></style>
