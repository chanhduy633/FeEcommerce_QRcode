import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5317/api"
  },
);

export default api;