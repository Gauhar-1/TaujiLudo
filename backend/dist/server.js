"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
// ✅ Single HTTP server handles both API and WebSocket
app_1.server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
