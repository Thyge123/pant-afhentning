import http from "../http-common";

class PantLocationDataService {
  getAll() {
    return http.get("/pantLocations");
  }
  get(id) {
    return http.get(`/pantLocations/${id}`);
  }
  create(data) {
    return http.post("/pantLocations", data);
  }
  update(id, data) {
    return http.put(`/pantLocations/${id}`, data);
  }
  delete(id) {
    return http.delete(`/pantLocations/${id}`);
  }
  deleteAll() {
    return http.delete(`/pantLocations`);
  }
}
export default new PantLocationDataService();