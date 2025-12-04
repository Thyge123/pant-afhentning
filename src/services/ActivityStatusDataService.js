import http from "../http-common";

class ActivityStatusDataService {
  getAll() {
    return http.get("/activityStatus");
  }
  get(id) {
    return http.get(`/activityStatus/${id}`);
  }
  create(data) {
    return http.post("/activityStatus", data);
  }
  update(id, data) {
    return http.put(`/activityStatus/${id}`, data);
  }
  delete(id) {
    return http.delete(`/activityStatus/${id}`);
  }
  deleteAll() {
    return http.delete(`/activityStatus`);
  }
}

export default new ActivityStatusDataService();
