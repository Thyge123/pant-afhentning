import http from "../http-common";

class ActivityDataService {
  getAll() {
    return http.get("/activities");
  }
  get(id) {
    return http.get(`/activities/${id}`);
  }
  getByUser(userId) {
    return http.get(`/activities/user/${userId}`);
  }
  getByStatusAndUser(userId) {
    return http.get(`/activities/user/${userId}/status/1`);
  }
  create(data) {
    return http.post("/activities", data);
  }
  update(id, data) {
    return http.put(`/activities/${id}`, data);
  }
  delete(id) {
    return http.delete(`/activities/${id}`);
  }
  deleteAll() {
    return http.delete(`/activities`);
  }
}
export default new ActivityDataService();
