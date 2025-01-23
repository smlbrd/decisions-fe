import axios from "axios";

export default apiClient = axios.create({
  baseURL: `https://decisions-api-vlyb.onrender.com`,
  // timeout: 5000
});
