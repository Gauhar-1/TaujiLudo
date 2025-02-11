import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/db';
import http from "http";
import { Server } from "socket.io";
import { router  } from './routes/auth';
import path from 'path';
import fs from "fs"
import socketManager from './routes/socketManager';

const app = express();

const server = http.createServer(app);



connectDB();

app.use(bodyParser.json());
// ✅ Improved CORS Configuration
const allowedOrigins = ["http://localhost:5173", "https://taujiludo.in"]; // Change this to your frontend URL
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Adjust based on your frontend URL
    methods: ["GET", "POST"],
  },
});

app.use('/api/auth', router);


io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socketManager(socket)
  
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

app.use((err: any, req: any, res: any, next: any) => {
    res.status(500).json({ error: err.message });
});

export  { io, server};
export default app;

