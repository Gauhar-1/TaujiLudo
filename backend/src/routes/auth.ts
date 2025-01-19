import { Router } from 'express';
import { sendOtp, verifyOtp } from '../controllers/authController';
import { depositAmount, verifyPayment, withdrawAmount } from '../controllers/moneyController';
import { getNotifications } from '../controllers/notifyController';
import { createProfile, getProfile, updateAmount, updateProfile } from '../controllers/ProfileManager';
import { battleHistory, canceledBattle, completeBattle, createBattle, inProgressBattle, joinBattle, pendingBattle, runningBattle, uploadScreenShot } from '../controllers/battleManger';
import app from '../app';
import express from "express";
import path from 'path';
import { upload } from '../utils/multerService';
import { createState } from '../controllers/stateManager';

const router = Router();
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/deposit', depositAmount);
router.post('/withdraw', withdrawAmount);
router.post('/verify-payment', verifyPayment);
router.get('/notifications', getNotifications);
router.get('/new-Profile', createProfile);
router.post('/update-Profile', updateProfile);
router.post('/update-Amount', updateAmount);
router.post('/battles/create', createBattle);
router.post('/battles/join', joinBattle);
router.get('/battles/pending', pendingBattle);
router.get('/battles/inBattle', inProgressBattle);
router.get('/battles/runningBattle', runningBattle);
router.post('/battles/:id/complete', completeBattle);
router.post('/battles/inBattle/uploads',upload.single('image'), uploadScreenShot);
router.post('/battles/inBattle/canceled', canceledBattle);
router.get('/battles/battleHistory', battleHistory);
router.get('/getProfiles', getProfile);
router.post('/createState', createState);

export default router;
