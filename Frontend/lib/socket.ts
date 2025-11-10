"use client"

import { io, type Socket } from "socket.io-client"
import { WS_URL } from "./config"

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(WS_URL, {
      autoConnect: false,
      withCredentials: true,
    })
  }
  return socket
}

export const connectSocket = () => {
  const s = getSocket()
  if (!s.connected) {
    s.connect()
  }
  return s
}

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect()
  }
}
