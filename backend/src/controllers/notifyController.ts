import { Request, Response } from 'express';
import { Notification } from '../models/Trans-notification';
import mongoose from 'mongoose';

export const createNotification = async (userId: string, type: string, message: string, paymentReference: string, status: string, amount: any) => {
  try {
    await Notification.create({
         userId,
         type,
          message,
          paymentReference,
           status,
           amount,
           markAsRead : false,
        });

        console.log("Notification created 1")
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Endpoint to fetch notifications
export const getNotifications = async (req: any, res: any) => {
  const userId  = req.query.userId;
  if (!userId ) {
    return  console.log('Invalid or missing userId' );
  }
  
  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const allNotifications = async (req: any, res: any)=>{
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
}

// Endpoint to mark a notification as read
export const markAsRead = async (req: any, res: any) => {
  const { notificationId } = req.body;
  try {
    await Notification.findByIdAndUpdate(notificationId, { markAsRead: true });
    res.status(200).json({ markAsRead: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};
