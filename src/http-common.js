import axios from "axios";

export default axios.create({
  baseURL: "https://pant-afhenting-server.vercel.app/api", //"http://localhost:8080/api",
  headers: {
    "Content-type": "application/json",
  },
});
