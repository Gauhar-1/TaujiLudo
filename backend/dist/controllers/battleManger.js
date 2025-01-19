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
exports.runningBattle = exports.completeBattle = exports.canceledBattle = exports.uploadScreenShot = exports.inProgressBattle = exports.joinBattle = exports.battleHistory = exports.pendingBattle = exports.createBattle = void 0;
const Battle_1 = __importDefault(require("../models/Battle"));
const date = Date.now();
const createBattle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount, ludoCode, name } = req.body;
    const battle = new Battle_1.default({
        player1: userId,
        amount,
        ludoCode,
        player1Name: name,
        prize: amount + (amount - (amount * 0.05)),
        status: "pending"
    });
    yield battle.save();
    if (!battle) {
        console.log("battle not created");
    }
    res.status(201).json(battle);
});
exports.createBattle = createBattle;
const pendingBattle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = "pending";
        const battle = yield Battle_1.default.find({ status }).sort({ createdAt: -1 });
        if (!battle) {
            console.log("No Ongoing Battles");
        }
        res.status(200).json(battle);
    }
    catch (err) {
        console.log("Error Found: " + err);
    }
});
exports.pendingBattle = pendingBattle;
const battleHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        const battle = yield Battle_1.default.find({ player1: userId }).sort({ createdAt: -1 });
        if (!battle) {
            console.log("player1 is not found");
            const battle = yield Battle_1.default.find({ player2: userId }).sort({ createdAt: -1 });
            if (!battle) {
                console.log(" No Battle found ");
            }
            res.status(200).json(battle);
            return;
        }
        res.status(200).json(battle);
    }
    catch (err) {
        console.log("error: " + err);
    }
});
exports.battleHistory = battleHistory;
const joinBattle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { battleId, userId, name } = req.body;
    if (!battleId || !name || !userId) {
        console.log("feilds Missing: " + name + " " + battleId + " " + userId);
    }
    const battle = yield Battle_1.default.findByIdAndUpdate(battleId, {
        player2Name: name,
        player2: userId,
        status: "in-progress",
        createdAt: date
    });
    if (!battle) {
        console.log("battle not found");
    }
    res.status(200).json(battle);
});
exports.joinBattle = joinBattle;
const inProgressBattle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { battleId } = req.query;
    const battle = yield Battle_1.default.findById(battleId);
    if (!battle) {
        console.log("Battle not found");
    }
    res.status(200).json(battle);
});
exports.inProgressBattle = inProgressBattle;
const uploadScreenShot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { battleId } = req.body;
    if (!battleId) {
        console.log("battleId not found");
    }
    if (!req.file) {
        console.log("file not found");
    }
    try {
        const battle = yield Battle_1.default.findByIdAndUpdate(battleId, {
            filename: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename,
            path: (_b = req.file) === null || _b === void 0 ? void 0 : _b.path,
            status: "completed",
        });
        if (!battle) {
            console.log("battle is not found");
        }
        res.status(200).json({ message: 'Image uploaded successfully', battle });
    }
    catch (err) {
        console.log("error: " + err);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});
exports.uploadScreenShot = uploadScreenShot;
const canceledBattle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { reason, battleId } = req.body;
    if (!battleId) {
        console.log("BattleId not found");
    }
    if (!reason) {
        console.log("reason not found");
    }
    try {
        const battle = yield Battle_1.default.findByIdAndUpdate(battleId, {
            reason,
            status: "canceled",
        });
        if (!battle) {
            console.log("battle not found");
        }
        res.status(200).json(battle);
    }
    catch (err) {
        console.log("error: " + err);
    }
});
exports.canceledBattle = canceledBattle;
const completeBattle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { winner, screenShot, id } = req.body;
    const battle = yield Battle_1.default.findByIdAndUpdate(id, {
        screenShot,
        status: "completed",
        winner,
        date
    });
    if (!battle) {
        console.log("Battle not completed");
    }
    res.status(200).json(battle);
});
exports.completeBattle = completeBattle;
const runningBattle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const battle = yield Battle_1.default.find({ $or: [{ status: "pending" }, { status: "in-progress" }], }).sort({ createdAt: -1 });
    if (!battle) {
        console.log("Battle not found");
    }
    res.status(200).json(battle);
});
exports.runningBattle = runningBattle;
