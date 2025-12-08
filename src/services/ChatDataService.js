import http from "../http-common";

class ChatDataService {
  getMessages(activityId) {
    return http.get(`/activities/${activityId}/chat/messages`);
  }
  getMessage(id) {
    return http.get(`/chats/${id}`);
  }
  //Get messages for a specific activity
  getMessagesForActivity(activityId) {
    return http.get(`chats/activity/${activityId}`);
  }
  //Get messages for a specific user
  getMessagesForUser(userId) {
    return http.get(`chats/user/${userId}`);
  }
  sendMessage(data) {
    return http.post("/chats", data);
  }
  deleteMessage(id) {
    return http.delete(`/chats/${id}`);
  }
  editMessage(id, data) {
    return http.put(`/chats/${id}`, data);
  }
}

export default new ChatDataService();
