import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5175",
  // timeout: 5000
});

apiClient.get('/').then(({ data }) => console.log(data));
