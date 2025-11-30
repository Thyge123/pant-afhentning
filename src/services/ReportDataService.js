import http from "../http-common";

class ReportDataService {
  getAll() {
    return http.get("/reports");
  }
  get(id) {
    return http.get(`/reports/${id}`);
  }
  create(data) {
    return http.post("/reports", data);
  }
  update(id, data) {
    return http.put(`/reports/${id}`, data);
  }
}

export default new ReportDataService();
