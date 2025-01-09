"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
(0, db_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/auth', auth_1.default);
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});
exports.default = app;
