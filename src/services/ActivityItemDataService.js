import http from "../http-common";

class ActivityItemDataService {
  getAll() {
    return http.get("/activityitem");
  }
  get(id) {
    return http.get(`/activityitem/${id}`);
  }
  create(data) {
    return http.post("/activityitem", data);
  }
  update(id, data) {
    return http.put(`/activityitem/${id}`, data);
  }
  delete(id) {
    return http.delete(`/activityitem/${id}`);
  }
  deleteAll() {
    return http.delete(`/activityitem`);
  }
}

export default new ActivityItemDataService();
