import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import https from "https";
import { Server } from "socket.io";
import { router } from './routes/auth';
import socketManager from './routes/socketManager';
import cookieParser from "cookie-parser";

const app = express();
const server = https.createServer(app);

// ✅ Connect to Database
connectDB();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS Configuration
const allowedOrigins = ["http://localhost:5173", "https://taujiludo.in"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Restrict Access to `/admin/*` Routes
app.use("/admin", (req : any, res : any, next : any) => {
  const allowedOrigin = "https://taujiludo.in";

  if (
    req.headers.origin !== allowedOrigin &&
    !(req.headers.referer?.startsWith(allowedOrigin))
  ) {
    return res.status(403).json({ error: "Forbidden: Access Denied" });
  }

  next();
});

// ✅ Setup WebSocket Server
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.use('/api/auth', router);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socketManager(socket);
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// ✅ Handle Missing Routes (Move Below `/admin` Middleware)
app.use("*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// ✅ Improved Error Handling
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

export { io, server };
export default app;
