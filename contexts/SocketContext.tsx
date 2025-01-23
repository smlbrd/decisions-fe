import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const socket = io(`https://decisions-api-vlyb.onrender.com`, {
  transports: ["websocket"],
});

const SocketContext = createContext(socket);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to backend:", socket.id);
    });

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
