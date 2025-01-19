"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const StateSchema = new mongoose_1.default.Schema({
    userName: { type: String, default: null },
    email: { type: String, default: null },
    editClicked: { type: Boolean, default: null },
    phoneNumber: { type: String, default: null },
});
const State = mongoose_1.default.model('State', StateSchema);
exports.default = State;
