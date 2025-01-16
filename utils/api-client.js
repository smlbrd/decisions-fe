import axios from "axios";
import ip from "../ip";

export default apiClient = axios.create({
  baseURL: `http://${ip}:9090/api`,
  // timeout: 5000
});
