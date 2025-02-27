import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import https from "https";
import { Server } from "socket.io";
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
} catch (error : any) {
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

// ✅ CORS Configuration
const allowedOrigins = ["http://localhost:5173", "https://taujiludo.in", "https://api.taujiludo.in"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Blocked WebSocket connection due to CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/admin", ( req : any , res : any , next: any) => {
  const allowedOrigin = "https://taujiludo.in";
  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";

  // ✅ Allow access if the request is from the allowed origin
  if (origin === allowedOrigin) {
    return next();
  }

  // ✅ If referer exists, check if it starts with the allowed origin
  if (referer && referer.startsWith(allowedOrigin)) {
    return next();
  }

  // ❌ Block all other requests
  return res.status(403).json({ error: "Forbidden: Access Denied" });
});


// ✅ Setup WebSocket Server (Fix: Allow `null` origin)
const io = new Server(server, {
  cors: {
<<<<<<< HEAD
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Blocked WebSocket connection due to CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
=======
    origin: "*",
>>>>>>> 47746e233ff5c9f837e77bdd2498c3edc33f2ff0
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.use('/api/auth', router);

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);
  socketManager(socket);
  
  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

io.on("error", (error) => {
  console.error("🚨 WebSocket Error:", error.message);
});

// ✅ Handle Missing Routes (Move Below `/admin` Middleware)
app.use("*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// ✅ Improved Error Handling (Fix: Handle WebSocket Errors)
app.use((err : any, req : any , res : any , next: any) => {
  console.error("🚨 Error:", err.message);

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  if (err.message.includes("Not allowed by CORS")) {
    return res.status(403).json({ error: "CORS policy blocked this request" });
  }

  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});


export { io, server };
export default app;
