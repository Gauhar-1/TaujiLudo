"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.io = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const auth_1 = require("./routes/auth");
const path_1 = __importDefault(require("path"));
const socketManager_1 = __importDefault(require("./routes/socketManager"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Adjust based on your frontend URL
        methods: ["GET", "POST"],
    },
});
exports.io = io;
(0, db_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/auth', auth_1.router);
const uploadDir = path_1.default.join(__dirname, '../public/uploads');
app.use('/uploads', express_1.default.static(uploadDir));
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    (0, socketManager_1.default)(socket);
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});
exports.default = app;
