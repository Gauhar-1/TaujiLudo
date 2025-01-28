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

const io = new Server(server, {
    cors: {
      origin: "*", // Adjust based on your frontend URL
      methods: ["GET", "POST"],
    },
  });

connectDB();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', router);


const uploadDir = path.join(__dirname,'../public/uploads');


app.use('/uploads', express.static(uploadDir));

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

