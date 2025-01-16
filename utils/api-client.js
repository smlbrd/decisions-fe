import axios from "axios";
import ip from "../ip";

export default apiClient = axios.create({
  baseURL: `http://${ip}/api`,
  // timeout: 5000
});
