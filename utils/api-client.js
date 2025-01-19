import axios from "axios";
import ip from "../ip";

export default apiClient = axios.create({
  baseURL: `http://${ip}:9090`,
  // timeout: 5000
});
