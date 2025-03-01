"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const https_1 = __importDefault(require("https"));
const socket_io_1 = require("socket.io");
const auth_1 = require("./routes/auth");
const socketManager_1 = __importDefault(require("./routes/socketManager"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
// ✅ Load SSL Certificates
let options;
try {
    options = {
        key: fs_1.default.readFileSync("/etc/letsencrypt/live/api.taujiludo.in/privkey.pem"),
        cert: fs_1.default.readFileSync("/etc/letsencrypt/live/api.taujiludo.in/fullchain.pem"),
    };
}
catch (error) {
    console.error("🚨 SSL Certificate Error:", error.message);
    process.exit(1); // Stop the server if SSL is missing
}
// ✅ Create HTTPS Server
const server = https_1.default.createServer(options, app);
exports.server = server;
// ✅ Connect to Database
(0, db_1.default)();
const allowedOrigins = ["http://localhost:5173", "https://taujiludo.in"];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
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
app.use((0, cors_1.default)(corsOptions)); // ✅ Apply corsOptions here
app.options("*", (0, cors_1.default)(corsOptions)); // ✅ Handle preflight requests
// ✅ JSON, URL Encoding, and Cookie Parsing Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// ✅ Register API Routes (After CORS)
app.use('/api/auth', auth_1.router);
// app.use("/admin", (req: any, res: any, next: any) => {
//   const origin = req.headers.origin || "";
//   const referer = req.headers.referer || "";
//   if (allowedOrigins.includes(origin) || allowedOrigins.some((o) => referer.startsWith(o))) {
//     return next();
//   }
//   return res.status(403).json({ error: "Forbidden: Access Denied!" });
// });
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["https://taujiludo.in", "https://api.taujiludo.in"], // ✅ Allow requests from your frontend
        methods: ["GET", "POST"], // ✅ Ensure GET & POST requests work
    },
    path: "/socket.io/", // ✅ WebSocket path (MUST match frontend)
});
exports.io = io;
// ✅ WebSocket Connection Handling
io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);
    (0, socketManager_1.default)(socket);
    socket.on("disconnect", () => {
        console.log("❌ A user disconnected:", socket.id);
    });
});
io.on("error", (error) => {
    console.error("🚨 WebSocket Error:", error.message);
});
// ✅ Handle 404 Routes
app.use("*", (req, res) => {
    res.status(404).json({ error: "API route not found" });
});
// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("🚨 Error:", err.message);
    if (err.name === "UnauthorizedError") {
        return res.status(401).json({ error: "Unauthorized access" });
    }
    if (err.message.includes("Not allowed by CORS")) {
        return res.status(403).json({ error: "CORS policy blocked this request" });
    }
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});
exports.default = app;
