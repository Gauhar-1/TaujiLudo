import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import http from "http";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { router } from './routes/auth';
import socketManager from './routes/socketManager';
import cookieParser from "cookie-parser";
import fs from "fs";

const app = express();

// ✅ Create HTTPS Server
const server = http.createServer(app);

// ✅ Connect to Database
connectDB();

const allowedOrigins = ["http://localhost:5173", "https://taujiludo.in", 'https://www.taujiludo.in'];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("🚫 Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Added OPTIONS method
  allowedHeaders: ["Content-Type", "Authorization"], // ✅ Ensure headers are allowed
  optionsSuccessStatus: 200, // ✅ Fixes preflight request issues in some browsers
};


// ✅ Middleware (CORS should be first)
app.use(cors(corsOptions)); // ✅ Apply corsOptions here
app.options("*", cors(corsOptions)); // ✅ Handle preflight requests


// ✅ JSON, URL Encoding, and Cookie Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Register API Routes (After CORS)
app.use('/api/auth', router);

// app.use("/admin", (req: any, res: any, next: any) => {
//   const origin = req.headers.origin || "";
//   const referer = req.headers.referer || "";

//   if (allowedOrigins.includes(origin) || allowedOrigins.some((o) => referer.startsWith(o))) {
//     return next();
//   }

//   return res.status(403).json({ error: "Forbidden: Access Denied!" });
// });



const io = new Server(server, {
  cors: {
    origin: [ "http://localhost:5173","https://taujiludo.in", "https://api.taujiludo.in"], // ✅ Allow requests from your frontend
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

// ✅ Global Error Handling Middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error("🚨 Error:", err.message);

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
