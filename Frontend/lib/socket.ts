"use client"

import { io, type Socket } from "socket.io-client"

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001"

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
