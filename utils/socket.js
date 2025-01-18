import { io } from "socket.io-client";
import ip from "../ip";

const socket = io(`http://${ip}:9090`, {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to backend:", socket.id);
});

export default socket;
