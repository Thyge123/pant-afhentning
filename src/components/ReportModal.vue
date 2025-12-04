<template>
  <v-dialog width="auto" transition="dialog-bottom-transition">
    <v-card
      prepend-icon="mdi-alert"
      text="Er der sket en fejl ved registreringen af pant?"
      title="Er der sket en fejl?"
    >
      <v-btn
        density="compact"
        icon="mdi-close"
        @click="closeDialog"
        class="close-button"
        variant="text"
      ></v-btn>
      <v-select
        label="Select"
        :items="reportReasons"
        item-title="reason"
        item-value="reportReasonId"
        dense
        v-model="selectedReason"
        variant="outlined"
        return-object
      ></v-select>
      <v-textarea
        label="Yderligere kommentarer"
        variant="outlined"
        auto-grow
        v-if="selectedReason"
        v-model="description"
        rows="1"
      ></v-textarea>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">Annuller</v-btn>
        <v-btn color="primary" @click="CreateReport" :disabled="!selectedReason"
          >Bekræft</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ReportDataService from "@/services/ReportDataService";
import ReportReasonDataService from "@/services/ReportReasonDataService";
export default {
  name: "BugReportModal",
  props: {
    activityId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      selectedReason: null,
      reportReasons: [],
      description: "",
    };
  },
  computed: {},
  methods: {
    closeDialog() {
      this.$emit("close-report-dialog");
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
    CreateReport() {
      const newReport = {
        reportReasonId: this.selectedReason.reportReasonId,
        description: this.description,
        activityId: this.activityId,
      };
      ReportDataService.create(newReport)
        .then(() => {
          this.getReports();
          this.dialog = false;
          this.reason = "";
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  created() {
    this.getReportReasons();
  },
};
</script>

<style scoped>
.close-button {
  position: absolute;
  top: 18px;
  right: 10px;
}

.v-select {
  margin: 0px 20px;
}

.v-textarea {
  margin: 0px 20px;
}
</style>
