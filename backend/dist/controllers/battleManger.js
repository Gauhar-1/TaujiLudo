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
exports.rejectDispute = exports.determineWinner = exports.deleteBattle = exports.disputeBattle = exports.runningBattle = exports.completeBattle = exports.canceledBattle = exports.battleLost = exports.uploadScreenShot = exports.inProgressBattle = exports.handleLudoCode = exports.manageRequest = exports.joinBattle = exports.battleHistory = exports.showBattles = exports.pendingBattle = exports.createBattle = void 0;
const app_1 = require("../app");
const Battle_1 = __importDefault(require("../models/Battle"));
const Profile_1 = __importDefault(require("../models/Profile"));
const mongoose_1 = __importDefault(require("mongoose"));
const date = new Date();
const createBattle = (battleData, callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, amount, ludoCode, name } = battleData;
        // ✅ Fetch only active (pending/in-progress) battles of the player
        const activeBattles = yield Battle_1.default.find({
            $or: [{ player1: userId }, { player2: userId }],
            status: { $in: ["pending", "in-progress"] }, // ✅ Only check active battles
        });
        // ✅ If user already has 2 active battles, block new creation
        if (activeBattles.length >= 2) {
            return callback({
                status: 400,
                message: "You already have 2 active battles. Finish or leave one to create a new one.",
                battleData: null,
            });
        }
        // ✅ Create a new battle
        const battle = new Battle_1.default({
            player1: userId,
            amount,
            ludoCode,
            player1Name: name,
            prize: amount + (amount - amount * 0.05),
            status: "pending",
        });
        console.log("🔍 Saving battle:", battle);
        yield battle.save();
        // ✅ Ensure battle is not duplicated in profile
        try {
            const updatedProfile = yield Profile_1.default.findByIdAndUpdate(userId, {
                $push: { battles: { battleId: battle._id, timestamp: battle.createdAt, status: "pending" } },
            }, { new: true, upsert: true });
            console.log("✅ Profile updated:", updatedProfile);
        }
        catch (profileError) {
            console.error("❌ Error updating profile:", profileError.stack);
        }
        app_1.io.emit("battleCreated", battle);
        console.log("✅ New battle created:", battle._id);
        return callback({ status: 200, message: "Battle created successfully", battleData: battle });
    }
    catch (error) {
        console.error("❌ Error creating battle:", error.stack);
        return callback({ status: 500, message: "Internal server error", battleData: null });
    }
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
const showBattles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.query;
        if (status === "canceled") {
            const battle = yield Battle_1.default.find({ status, winner: { $exists: true, $ne: null } }).sort({ createdAt: -1 });
            if (!battle) {
                console.log("No  Battle found");
            }
            res.status(200).json(battle);
        }
        else {
            const battle = yield Battle_1.default.find({ status }).sort({ createdAt: -1 });
            if (!battle) {
                console.log("No  Battle found");
            }
            res.status(200).json(battle);
        }
    }
    catch (err) {
        console.log("Error Found: " + err);
    }
});
exports.showBattles = showBattles;
const battleHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        // 🔵 First, search for battles where the user is `player1`
        let battle = yield Battle_1.default.find({ player1: userId }).sort({ createdAt: -1 });
        // 🔵 If no battles are found, check `player2`
        if (battle.length === 0) {
            console.log("player1 not found, checking player2...");
            battle = yield Battle_1.default.find({ player2: userId }).sort({ createdAt: -1 });
        }
        // 🔴 If still no battles found, return 404
        if (battle.length === 0) {
            return res.status(404).json({ message: "No battle history found for this user." });
        }
        // ✅ Return battles if found
        return res.status(200).json(battle);
    }
    catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: err.message });
    }
});
exports.battleHistory = battleHistory;
const joinBattle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { battleId, userId, name } = req.body;
    if (!battleId || !name || !userId) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    try {
        // ✅ Check if the user is already in an in-progress battle
        const activeBattle = yield Battle_1.default.findOne({
            $or: [{ player1: userId }, { player2: userId }],
            status: "in-progress",
        });
        if (activeBattle) {
            console.log(`🚫 User ${userId} cannot join a new battle while battle ${activeBattle._id} is in progress.`);
            return res.status(200).json({
                success: false,
                message: "You are already in an active battle.",
            });
        }
        // ✅ Find the battle
        const battle = yield Battle_1.default.findById(battleId);
        if (!battle) {
            return res.status(404).json({ success: false, message: "Battle not found" });
        }
        // ✅ Restrict third player from joining
        if (battle.player1 && battle.player2) {
            console.log(`🚫 Battle ${battleId} already has two players.`);
            return res.status(200).json({ success: false, message: "This battle is already full." });
        }
        // ✅ If player1 is present, set user as player2; otherwise, do nothing extra
        const updatedBattle = yield Battle_1.default.findByIdAndUpdate(battleId, {
            player2: battle.player1 ? userId : null,
            player2Name: battle.player1 ? name : null,
            createdAt: new Date(),
        }, { new: true });
        res.status(200).json({ success: true, message: "Joined battle successfully", battle: updatedBattle });
    }
    catch (error) {
        console.error("❌ Error joining battle:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.joinBattle = joinBattle;
const manageRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { battleId, event, details, userId } = req.body;
        if (!event || !details) {
            console.log("⚠️ Fields Missing: " + event + " " + details);
            return res.status(400).json({ message: "Missing event or details" });
        }
        let battle;
        if (event === "opponent_canceled") {
            battle = yield Battle_1.default.findByIdAndUpdate(battleId, { $set: { history: [] } }, // Reset history properly
            { new: true });
            if (!battle) {
                console.log("⚠️ Battle not found");
                return res.status(404).json({ message: "Battle not found" });
            }
            // ✅ If status is "canceled", refund entry fees
            const refundAmount = battle.amount;
            yield Profile_1.default.updateMany({ userId: { $in: [battle.player1, battle.player2] } }, // Refund both players
            { $inc: { amount: refundAmount } });
            console.log(`💰 Refunded ${refundAmount} to both players.`);
            return res.status(200).json(battle);
        }
        if (event === "opponent_found") {
            // ✅ Check if the user is already in an in-progress battle
            const activeBattle = yield Battle_1.default.findOne({
                $or: [{ player1: userId }, { player2: userId }],
                status: "in-progress",
            });
            if (activeBattle) {
                console.log(`🚫 User ${userId} cannot join a new battle while battle ${activeBattle._id} is in progress.`);
                return res.status(400).json({
                    success: false,
                    message: "You cannot join a new battle while another battle is in progress.",
                });
            }
            // ✅ Deduct the entry fee from the opponent's profile
            battle = yield Battle_1.default.findById(battleId);
            if (!battle) {
                return res.status(404).json({ message: "Battle not found" });
            }
            // ✅ Restrict third player from joining
            if ((battle === null || battle === void 0 ? void 0 : battle.player1) && (battle === null || battle === void 0 ? void 0 : battle.player2)) {
                console.log(`🚫 Battle ${battleId} already has two players.`);
                return res.status(400).json({ success: false, message: "This battle is already full." });
            }
            const opponentProfile = yield Profile_1.default.findOne({ userId });
            if (!opponentProfile) {
                return res.status(404).json({ message: "Opponent profile not found" });
            }
            if (opponentProfile.amount < battle.amount) {
                return res.status(400).json({ message: "Opponent has insufficient balance" });
            }
            // ✅ Deduct battle amount from opponent's balance
            opponentProfile.amount -= battle.amount;
            yield opponentProfile.save();
            console.log(`✅ Deducted ${battle.amount} from opponent ${userId}`);
        }
        // ✅ Handle opponent entered event and push history in one step
        battle = yield Battle_1.default.findByIdAndUpdate(battleId, Object.assign(Object.assign({}, (event === "opponent_entered" && { status: "in-progress" })), { $push: { history: { event, timestamp: new Date(), details } } }), { new: true });
        if (!battle) {
            console.log("⚠️ Battle not found");
            return res.status(404).json({ message: "Battle not found" });
        }
        return res.status(200).json(battle);
    }
    catch (error) {
        console.error("❌ Error in manageRequest:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.manageRequest = manageRequest;
const handleLudoCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { battleId, ludoCode, event, details } = req.body;
    if (!battleId || !ludoCode) {
        res.status(400).json("feilds Missing: " + battleId + " " + ludoCode);
    }
    const battle = yield Battle_1.default.findByIdAndUpdate(battleId, {
        ludoCode,
        $push: { history: { event, timestamp: new Date(), details } },
    });
    if (!battle) {
        res.status(400).json("Battle not found");
    }
    res.status(200).json("Ludo code set successfully");
});
exports.handleLudoCode = handleLudoCode;
const inProgressBattle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { battleId } = req.query;
        // Check if battleId is provided
        if (!battleId) {
            return res.status(400).json({ message: "battleId is required" });
        }
        // Find the battle using the battleId
        const battle = yield Battle_1.default.findById(battleId);
        // Check if battle is found
        if (!battle) {
            return res.status(404).json({ message: "Battle not found" });
        }
        // Send the battle details as a response
        res.status(200).json(battle);
    }
    catch (err) {
        // Send a generic error message if an unexpected error occurs
        console.error("Error fetching battle:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.inProgressBattle = inProgressBattle;
const uploadScreenShot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { battleId, playerId, phoneNumber } = req.body;
        if (!battleId)
            return res.status(400).json({ error: "battleId is required" });
        if (!req.file)
            return res.status(400).json({ error: "File is required" });
        const battle = yield Battle_1.default.findById(battleId).session(session);
        if (!battle)
            return res.status(404).json({ error: "Battle not found" });
        if (![battle.player1, battle.player2].includes(playerId)) {
            return res.status(403).json({ error: "You are not part of this battle" });
        }
        console.log(`🖼️ Uploading Screenshot for Battle ${battleId} by ${playerId}`);
        // Initialize dispute if missing
        if (!battle.dispute) {
            battle.dispute = {
                players: [phoneNumber],
                proofs: [{ player: playerId, filename: req.file.filename, path: req.file.path, reason: "", adminReason: "", clicked: "Won" }],
                resolved: false,
                winner: null,
                timestamp: new Date(),
            };
        }
        else {
            const alreadyUploaded = battle.dispute.proofs.some(proof => proof.player === playerId);
            if (alreadyUploaded) {
                return res.status(400).json({ error: "You have already uploaded a screenshot" });
            }
            battle.dispute.players = [...new Set([...battle.dispute.players, phoneNumber])]; // Prevent duplicates
            battle.dispute.proofs.push({ player: playerId, filename: req.file.filename, path: req.file.path, reason: "", adminReason: "", clicked: "Won" });
        }
        yield battle.save({ session });
        // ✅ Check if both players have clicked
        const player1Clicked = battle.dispute.proofs.some(proof => proof.player === battle.player1);
        const player2Clicked = battle.dispute.proofs.some(proof => proof.player === battle.player2);
        // ✅ Update status only after adding proofs
        if (player1Clicked && player2Clicked) {
            let status = yield updateBattleStatus(battle); // Await the status update
            if (status === "completed") {
                const winnerProfile = yield Profile_1.default.findOne({ phoneNumber }).session(session);
                if (!winnerProfile) {
                    return res.status(400).json({ error: "Player profile not found" });
                }
                winnerProfile.gameWon += 1;
                yield winnerProfile.save({ session });
                const loserId = playerId === battle.player1 ? battle.player2 : battle.player1;
                const loserProfile = yield Profile_1.default.findOne({ userId: loserId }).session(session);
                if (!loserProfile) {
                    return res.status(400).json({ error: "Player profile not found" });
                }
                loserProfile.gameLost += 1;
                yield loserProfile.save({ session });
                // Process referral earnings
                if (winnerProfile.referredBy) {
                    const referredByProfile = yield Profile_1.default.findOne({ phoneNumber: winnerProfile.referredBy }).session(session);
                    if (referredByProfile) {
                        const referral = referredByProfile.referrals.find(ref => ref.phoneNumber === winnerProfile.phoneNumber);
                        if (referral) {
                            referral.referalEarning += Number(battle.amount * 0.02);
                            yield referredByProfile.save({ session });
                        }
                    }
                }
            }
        }
        yield session.commitTransaction();
        session.endSession();
        console.log(`✅ Screenshot uploaded & battle status updated: ${battle.status}`);
        res.status(200).json({ message: "Screenshot uploaded successfully", battle });
    }
    catch (err) {
        yield session.abortTransaction(); // Rollback changes if there's an error
        session.endSession();
        console.error("❌ Error in uploadScreenShot:", err);
        next(err);
    }
});
exports.uploadScreenShot = uploadScreenShot;
const battleLost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { battleId, userId } = req.body;
        if (!battleId)
            return res.status(400).json({ error: "battleId is required" });
        if (!userId)
            return res.status(400).json({ error: "UserId is required" });
        const battle = yield Battle_1.default.findById(battleId);
        if (!battle)
            return res.status(404).json({ error: "Battle not found" });
        if (!battle.dispute) {
            battle.dispute = {
                players: [userId],
                proofs: [{ player: userId, filename: "", path: "", reason: "", adminReason: "", clicked: "Lost" }],
                resolved: false,
                winner: null,
                timestamp: new Date(),
            };
        }
        else {
            // Ensure player doesn't declare lost twice
            const alreadyLost = battle.dispute.proofs.some(proof => proof.player === userId && proof.clicked === "Lost");
            if (alreadyLost)
                return res.status(400).json({ error: "You have already marked yourself as lost" });
            battle.dispute.players = [...new Set([...battle.dispute.players, userId])]; // Ensure uniqueness
            battle.dispute.proofs.push({ player: userId, filename: "", path: "", reason: "", adminReason: "", clicked: "Lost" });
        }
        yield battle.save();
        // ✅ Check if both players have clicked
        const player1Clicked = battle.dispute.proofs.some(proof => proof.player === battle.player1);
        const player2Clicked = battle.dispute.proofs.some(proof => proof.player === battle.player2);
        // ✅ Update status only after adding proofs
        if (player1Clicked && player2Clicked) {
            let status = yield updateBattleStatus(battle);
            if (status === "completed") {
                const winnerId = userId === battle.player1 ? battle.player2 : battle.player1;
                const winnerProfile = yield Profile_1.default.findOne({ userId: winnerId });
                if (!winnerProfile) {
                    return res.status(400).json({ error: "Player profile not found" });
                }
                winnerProfile.gameWon += 1;
                yield winnerProfile.save();
                const loserProfile = yield Profile_1.default.findOne({ userId });
                if (!loserProfile) {
                    return res.status(400).json({ error: "Player profile not found" });
                }
                loserProfile.gameLost += 1;
                yield loserProfile.save();
                // Process referral earnings
                if (winnerProfile.referredBy) {
                    const referredByProfile = yield Profile_1.default.findOne({ phoneNumber: winnerProfile.referredBy });
                    if (referredByProfile) {
                        const referral = referredByProfile.referrals.find(ref => ref.phoneNumber === winnerProfile.phoneNumber);
                        if (referral) {
                            referral.referalEarning += Number(battle.amount * 0.02);
                            yield referredByProfile.save();
                        }
                    }
                }
            }
        }
        res.json({ message: "Loser assigned successfully", battle });
    }
    catch (err) {
        console.error("❌ Error in battleLost:", err);
        next(err);
    }
});
exports.battleLost = battleLost;
const canceledBattle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reason, battleId, userId, phoneNumber } = req.body;
        if (!battleId)
            return res.status(400).json({ error: "battleId is required" });
        if (!reason)
            return res.status(400).json({ error: "Reason is required" });
        const battle = yield Battle_1.default.findById(battleId);
        if (!battle)
            return res.status(404).json({ error: "Battle not found" });
        console.log(`🚨 Player ${userId} requested battle cancelation for ${battleId}`);
        if (!battle.dispute) {
            battle.dispute = {
                players: [phoneNumber],
                proofs: [{ player: userId, filename: "", path: "", reason, adminReason: "", clicked: "Canceled" }],
                resolved: false,
                winner: null,
                timestamp: new Date(),
            };
        }
        else {
            const alreadyCanceled = battle.dispute.proofs.some(proof => proof.player === userId && proof.clicked === "Canceled");
            if (alreadyCanceled)
                return res.status(400).json({ error: "You have already canceled the battle" });
            battle.dispute.players.push(phoneNumber);
            battle.dispute.proofs.push({ player: userId, filename: "", path: "", reason, adminReason: "", clicked: "Canceled" });
        }
        yield battle.save();
        // ✅ Check if both players have clicked
        const player1Clicked = battle.dispute.proofs.some(proof => proof.player === battle.player1);
        const player2Clicked = battle.dispute.proofs.some(proof => proof.player === battle.player2);
        // ✅ Update status only after adding proofs
        if (player1Clicked && player2Clicked) {
            yield updateBattleStatus(battle); // Update status only when both clicked
        }
        // ✅ If status is "canceled", refund entry fees
        if (battle.status === "canceled") {
            const refundAmount = battle.amount;
            yield Profile_1.default.updateMany({ userId: { $in: [battle.player1, battle.player2] } }, { $inc: { amount: refundAmount } });
            console.log(`💰 Refunded ${refundAmount} to both players.`);
        }
        console.log(`✅ Battle cancelation recorded & status updated ${battle.status}`);
        res.status(200).json({ message: "Battle canceled successfully", battle });
    }
    catch (err) {
        console.error("❌ Error in canceledBattle:", err);
        next(err);
    }
});
exports.canceledBattle = canceledBattle;
const updateBattleStatus = (battle) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const player1Action = battle.player1
        ? ((_b = (_a = battle.dispute) === null || _a === void 0 ? void 0 : _a.proofs.find((proof) => proof.player === battle.player1)) === null || _b === void 0 ? void 0 : _b.clicked) || "None"
        : "None";
    const player2Action = battle.player2
        ? ((_d = (_c = battle.dispute) === null || _c === void 0 ? void 0 : _c.proofs.find((proof) => proof.player === battle.player2)) === null || _d === void 0 ? void 0 : _d.clicked) || "None"
        : "None";
    const statusMap = {
        "Won-Canceled": "disputed",
        "Lost-Canceled": "disputed",
        "Canceled-Lost": "disputed",
        "Lost-Lost": "disputed",
        "Canceled-Canceled": "canceled",
        "Won-Lost": "completed",
        "Lost-Won": "completed",
        "Canceled-Won": "disputed",
    };
    const statusKey = `${player1Action}-${player2Action}`;
    battle.status = statusMap[statusKey] || "disputed";
    yield battle.save(); // ✅ Save changes to the database
    console.log(`🏆 Battle ${battle._id} status updated to: ${battle.status}`);
    return battle.status; // Return updated status for further logic
});
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
const disputeBattle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const battle = yield Battle_1.default.find({ status: "disputed" }).sort({ createdAt: -1 });
    if (!battle) {
        console.log("Battle not found");
    }
    res.status(200).json(battle);
});
exports.disputeBattle = disputeBattle;
const deleteBattle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { battleId } = req.body;
    const battle = yield Battle_1.default.findByIdAndDelete(battleId);
    res.status(200).json(battle);
});
exports.deleteBattle = deleteBattle;
const determineWinner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { battleId, userId } = req.body;
    if (!battleId || !userId) {
        return res.status(400).json({ success: false, message: "BattleID and userID are required." });
    }
    try {
        // Update battle and set winner
        const battle = yield Battle_1.default.findByIdAndUpdate(battleId, {
            "dispute.winner": userId,
            "dispute.resolved": true,
            status: "completed",
            winner: "decided",
        }, { new: true });
        if (!battle) {
            return res.status(404).json({ success: false, message: "Battle not found" });
        }
        const loserId = userId === battle.player1 ? battle.player2 : battle.player1;
        // Update winner profile
        const winnerUpdate = yield Profile_1.default.findOneAndUpdate({ userId }, { $inc: { amount: battle.prize, gameWon: 1, cashWon: battle.prize } }, { new: true });
        if (!winnerUpdate) {
            return res.status(404).json({ success: false, message: "Winner profile not found" });
        }
        // Update loser profile
        const loserUpdate = yield Profile_1.default.findOneAndUpdate({ userId: loserId }, { $inc: { gameLost: 1 } }, { new: true });
        if (!loserUpdate) {
            return res.status(404).json({ success: false, message: "Loser profile not found" });
        }
        // Handle referral earnings
        if (winnerUpdate.referredBy) {
            const referedByProfile = yield Profile_1.default.findOne({ phoneNumber: winnerUpdate.referredBy });
            const referral = referedByProfile === null || referedByProfile === void 0 ? void 0 : referedByProfile.referrals.find(ref => ref.phoneNumber === winnerUpdate.phoneNumber);
            if (referedByProfile && referral) {
                referral.referalEarning += battle.amount * 0.02;
                yield referedByProfile.save();
            }
        }
        res.status(200).json({ success: true, message: "Winner determined successfully", battle });
    }
    catch (err) {
        console.error("Error in determineWinner:", err);
        res.status(500).json({ success: false, message: "Winner determination failed", error: err.message });
    }
});
exports.determineWinner = determineWinner;
const rejectDispute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, battleId, reason } = req.body;
    if (!battleId) {
        return res.status(400).json({ success: false, message: "Battle ID is required." });
    }
    if (!reason) {
        return res.status(400).json({ success: false, message: "reason is required." });
    }
    try {
        // Find the transaction by payment reference
        const battle = yield Battle_1.default.findById(battleId);
        if (!battle) {
            console.log('Profile not found');
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        if (battle.dispute) {
            battle.dispute.proofs[0].player === userId ?
                battle.dispute.proofs[0].adminReason = reason : battle.dispute.proofs[1].adminReason = reason;
            battle.dispute.timestamp = new Date();
        }
        yield battle.save();
        // Update notification as transaction completed
        //   const notification = await Notification.findOneAndUpdate({paymentReference : transaction.paymentReference}, 
        //  { status:'failed', reason});
        // if (!notification) {
        //     console.log('notification not found');
        //     return res.status(404).json({ success: false, message: 'notification  not found' });
        // }
        res.status(200).json({ success: true, message: 'Battle Rejected ', battle });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Kyc rejection failed', error: err.message });
    }
});
exports.rejectDispute = rejectDispute;
