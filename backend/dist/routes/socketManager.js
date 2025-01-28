"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const Battle_1 = __importDefault(require("../models/Battle"));
const socketManager = (socket) => {
    // Socket.IO integration
    // Handle battle creation
    socket.on("createBattle", (battleData) => __awaiter(void 0, void 0, void 0, function* () {
        if (battleData) {
            console.log("BattleDta: " + battleData.amount, battleData.ludoCode);
        }
        try {
            const battle = new Battle_1.default({
                player1: battleData.userId,
                amount: battleData.amount,
                player1Name: battleData.name,
                prize: battleData.amount + (battleData.amount - (battleData.amount * 0.05)),
                status: "pending"
            });
            yield battle.save();
            app_1.io.emit("battleCreated", battle); // Notify all connected clients
        }
        catch (error) {
            console.error("Error creating battle:", error);
        }
    }));
    // Handle battle deletion
    socket.on("deleteBattle", (battleId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield Battle_1.default.findByIdAndDelete(battleId);
            app_1.io.emit("battleDeleted", battleId); // Notify all connected clients
        }
        catch (error) {
            console.error("Error deleting battle:", error);
        }
    }));
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
};
exports.default = socketManager;
