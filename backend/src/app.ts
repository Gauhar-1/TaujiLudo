import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import https from "https";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { router } from './routes/auth';
import socketManager from './routes/socketManager';
import cookieParser from "cookie-parser";
import fs from "fs";

const app = express();

// ✅ Load SSL Certificates
let options;
try {
  options = {
    key: fs.readFileSync("/etc/letsencrypt/live/api.taujiludo.in/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/api.taujiludo.in/fullchain.pem"),
  };
} catch (error: any) {
  console.error("🚨 SSL Certificate Error:", error.message);
  process.exit(1); // Stop the server if SSL is missing
}

// ✅ Create HTTPS Server
const server = https.createServer(options, app);

// ✅ Connect to Database
connectDB();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS Configuration (Ensure Same for Express & Socket.io)
const allowedOrigins = ["http://localhost:5173", "https://taujiludo.in", "https://api.taujiludo.in"];
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Blocked CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST"],
};
app.use(cors(corsOptions)); // ✅ Apply before all routes

// ✅ Restrict /admin access to taujiludo.in only
app.use("/admin", (req : any, res: any, next: any) => {
  const allowedOrigin = allowedOrigins;
  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";

  if (origin === allowedOrigin || (referer && referer.startsWith(allowedOrigin))) {
    return next();
  }

  return res.status(403).json({ error: "Forbidden: Access Denied!" });
});


const io = new Server(server, {
  cors: {
    origin: "https://taujiludo.in", // Allow requests from your frontend URL
    credentials: true, // Ensure cookies or authentication tokens are allowed
    methods: ["GET", "POST"], // Allow GET and POST methods
  },
  path: "/socket.io/",
});



// ✅ Register API Routes
app.use('/api/auth', router);

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
