import http from "../http-common";

class PickUpDataService {
  getAll() {
    return http.get("/pickups");
  }
  get(id) {
    return http.get(`/pickups/${id}`);
  }
  create(data) {
    return http.post("/pickups", data);
  }
  update(id, data) {
    return http.put(`/pickups/${id}`, data);
  }
  delete(id) {
    return http.delete(`/pickups/${id}`);
  }
  deleteAll() {
    return http.delete(`/pickups`);
  }
}

export default new PickUpDataService();
