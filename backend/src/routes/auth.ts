import { Router } from 'express';
import { autoLogin, logOut, sendOtp, verifyOtp } from '../controllers/authController';
import { AllTransaction, depositAmount, findTransaction, getTransaction, paymentProof, rejectPayment, ReqTransaction, verifyPayment, withdrawAmount } from '../controllers/moneyController';
import { allNotifications, getNotifications, markAsRead } from '../controllers/notifyController';
import { blockedPlayer, completeKYC, findProfile, getBlockedOnes, getProfile, getReferal, getReferalEarning, kycCompletedProfiles, rejectKyc, unBlockPlayer, updateAmount, updateProfile, verifyKyc } from '../controllers/ProfileManager';
import { battleHistory, battleLost, canceledBattle, completeBattle, createBattle, deleteBattle, determineWinner, disputeBattle, handleLudoCode, inProgressBattle, joinBattle, manageRequest, pendingBattle, rejectDispute, runningBattle, showBattles, uploadScreenShot } from '../controllers/battleManger';
import {io} from '../app';
import express from "express";
import path from 'path';
import { upload } from '../utils/multerService';
import { createState } from '../controllers/stateManager';
import { Socket } from 'socket.io';
import { createAdminDetails, getAdmin, health, infoSettings, onlyAdmins, QRsettings, supportSettings, UPIsettings } from '../controllers/adminController';

const router = Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', autoLogin);
router.get('/health', health);
router.post('/logout', logOut);
router.post('/deposit',upload.single('image'), depositAmount);
router.post('/withdraw', withdrawAmount);
router.post('/verify-payment', verifyPayment);
router.post('/reject-payment',  rejectPayment);
router.post('/verify-kyc', verifyKyc);
router.post('/reject-kyc',  rejectKyc);
router.get('/notifications', getNotifications);
router.post('/update-Profile', updateProfile);
router.get('/update-Amount', updateAmount);
router.post('/battles/create', createBattle);
router.post('/battles/join', joinBattle);
router.post('/battles/manageRequest', manageRequest);
router.post('/battles/setLudoCode', handleLudoCode);
router.get('/battles/pending', pendingBattle);
router.get('/battles/inBattle', inProgressBattle);
router.get('/battles/runningBattle', runningBattle);
router.get('/battles/disputeBattle', disputeBattle);
router.post('/battles/disputeBattle/approve', determineWinner);
router.post('/battles/disputeBattle/reject', rejectDispute);
router.post('/battles/:id/complete', completeBattle);
router.post('/battles/inBattle/uploads',upload.single('image'), uploadScreenShot);
router.post('/battles/inBattle/canceled', canceledBattle);
router.post('/battles/inBattle/lost', battleLost);
router.get('/battles/battleHistory', battleHistory);
router.get('/battles', showBattles);
router.post('/deleteBattle', deleteBattle);
router.get('/getProfiles', getProfile);
router.get('/kycProfiles', kycCompletedProfiles);
router.get('/findProfile', findProfile);
router.post('/blockPlayer', blockedPlayer);
router.get('/blockedOnes', getBlockedOnes);
router.post('/unblockPlayer', unBlockPlayer);
router.post('/createState', createState);
router.post('/kyc', upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 1 }
  ]), completeKYC);
router.get('/transaction', getTransaction);
router.get('/allTransaction', AllTransaction);
router.get('/reqTransaction', ReqTransaction);
router.get('/findTransaction', findTransaction);
router.get('/allNotifications', allNotifications);
router.get('/getReferral', getReferal);
router.post('/redeemEarnings', getReferalEarning);
router.get('/getAdmin', getAdmin);
router.post('/markRead', markAsRead);
router.post('/createAdminDetails', createAdminDetails);
router.get('/check-admin', onlyAdmins);
router.post('/supportSettings', supportSettings);
router.post('/infoSettings', infoSettings);
router.post('/QRSettings',upload.single('image'), QRsettings);
router.post('/UPISettings', UPIsettings);
router.post('/depositProof', upload.single("image"), paymentProof);

 

export  { router , io};
