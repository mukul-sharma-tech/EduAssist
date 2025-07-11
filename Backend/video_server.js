// Basic Socket.IO signaling server for group video calls
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"],
  },
});

// Room structure: { [roomCode]: Set of socket ids }
const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomCode) => {
    socket.join(roomCode);
    if (!rooms[roomCode]) rooms[roomCode] = new Set();
    rooms[roomCode].add(socket.id);
    // Notify others in the room
    socket.to(roomCode).emit("user-joined", socket.id);
    // Send list of other users to the new user
    const otherUsers = Array.from(rooms[roomCode]).filter(
      (id) => id !== socket.id
    );
    socket.emit("all-users", otherUsers);
  });

  // Relay signaling data
  socket.on("signal", ({ to, data }) => {
    io.to(to).emit("signal", { from: socket.id, data });
  });

  // Raise hand event
  socket.on("raise-hand", (roomCode) => {
    socket.to(roomCode).emit("user-raised-hand", socket.id);
  });

  // Chat message event
  socket.on("chat-message", ({ roomCode, message, sender }) => {
    io.to(roomCode).emit("chat-message", { sender, message });
  });

  socket.on("disconnecting", () => {
    for (const roomCode of socket.rooms) {
      if (rooms[roomCode]) {
        rooms[roomCode].delete(socket.id);
        socket.to(roomCode).emit("user-left", socket.id);
        if (rooms[roomCode].size === 0) delete rooms[roomCode];
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.VID_PORT || 5001;
server.listen(PORT, () => {
  console.log(`Video signaling server running on port ${PORT}`);
});
