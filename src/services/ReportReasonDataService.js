import http from "../http-common";

class ReportReasonDataService {
  getAll() {
    return http.get("/reportreasons");
  }
  get(id) {
    return http.get(`/reportreasons/${id}`);
  }
  create(data) {
    return http.post("/reportreasons", data);
  }
  update(id, data) {
    return http.put(`/reportreasons/${id}`, data);
  }
  delete(id) {
    return http.delete(`/reportreasons/${id}`);
  }
  deleteAll() {
    return http.delete(`/reportreasons`);
  }
}

export default new ReportReasonDataService();
