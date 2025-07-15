import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import http from "http";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { router } from './routes/auth';
import socketManager from './routes/socketManager';
import cookieParser from "cookie-parser";

const app = express();

// ✅ Create HTTPS Server
const server = http.createServer(app);

// ✅ Connect to Database
connectDB();

const allowedOrigins = ["http://localhost:5173", "https://tauji-ludo.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow no-origin requests (e.g., Postman) or allowed domains
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);


// ✅ JSON, URL Encoding, and Cookie Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Register API Routes (After CORS)
app.use('/api/auth', router);


const io = new Server(server, {
  cors: {
    origin: [ "http://localhost:5173","https://tauji-ludo.vercel.app/"], // ✅ Allow requests from your frontend
    methods: ["GET", "POST"], // ✅ Ensure GET & POST requests work
    credentials: true,
  },
  path: "/socket.io/", // ✅ WebSocket path (MUST match frontend)
});


// ✅ WebSocket Connection Handling
io.on("connection", (socket:  any) => {
  console.log("✅ A user connected:", socket.id);
  socketManager(socket);

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

io.on("error", (error: any) => {
  console.error("🚨 WebSocket Error:", error.message);
});

// ✅ Handle 404 Routes
app.use("*", (req : any, res: any) => {
  res.status(404).json({ error: "API route not found" });
});

// ✅ Handle Errors
app.use((err: any, req: any, res: any, next: any) => {
  console.error("🚨 Error:", err.message) ;

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  if (err.message.includes("Not allowed by CORS")) {
    return res.status(403).json({ error: "CORS policy blocked this request" });
  }

  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// ✅ Export Modules
export { io, server };
export default app;
