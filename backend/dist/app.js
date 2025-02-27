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
// ✅ Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// ✅ CORS Configuration
const allowedOrigins = ["http://localhost:5173", "https://taujiludo.in", "https://api.taujiludo.in"];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.error("Blocked WebSocket connection due to CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use("/admin", (req, res, next) => {
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
const io = new socket_io_1.Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                console.error("Blocked WebSocket connection due to CORS:", origin);
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST"],
    },
});
exports.io = io;
app.use('/api/auth', auth_1.router);
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
// ✅ Handle Missing Routes (Move Below `/admin` Middleware)
app.use("*", (req, res) => {
    res.status(404).json({ error: "API route not found" });
});
// ✅ Improved Error Handling (Fix: Handle WebSocket Errors)
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
// ✅ Start Server (Fix: Ensure `server.listen` is used)
const PORT = process.env.PORT || 443;
server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
exports.default = app;
