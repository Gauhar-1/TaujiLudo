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
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.allNotifications = exports.getNotifications = exports.createNotification = void 0;
const Trans_notification_1 = require("../models/Trans-notification");
const createNotification = (userId, type, message, paymentReference, status, amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Trans_notification_1.Notification.create({
            userId,
            type,
            message,
            paymentReference,
            status,
            amount,
            markAsRead: false,
        });
        console.log("Notification created 1");
    }
    catch (error) {
        console.error('Error creating notification:', error);
    }
});
exports.createNotification = createNotification;
// Endpoint to fetch notifications
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    if (!userId) {
        return console.log('Invalid or missing userId');
    }
    try {
        const notifications = yield Trans_notification_1.Notification.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});
exports.getNotifications = getNotifications;
const allNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield Trans_notification_1.Notification.find().sort({ createdAt: -1 });
        res.status(200).json(notifications);
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});
exports.allNotifications = allNotifications;
// Endpoint to mark a notification as read
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const notification = yield Trans_notification_1.Notification.findByIdAndUpdate(id, { markAsRead: true });
        if (!notification) {
            return res.status(400).json("Notification not found");
        }
        res.status(200).json({ markAsRead: true });
    }
    catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Failed to update notification' });
    }
});
exports.markAsRead = markAsRead;
