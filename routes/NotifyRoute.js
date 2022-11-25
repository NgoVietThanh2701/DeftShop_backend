import express from 'express';
import { getNotify, getNotifyById, getNotifySellerById } from '../controller/NotifyController';
import { verifyLogin } from '../middleware/user/AuthUser';
import { verifyLoginAdmin, verifyManagerUser, verifySeller } from '../middleware/admin/AuthManager';

const router = express.Router();

router.get('/notify', verifyLogin, getNotifyById);
router.get('/admin/notify', verifyLoginAdmin, verifyManagerUser, getNotify);
router.get('/admin/notify-seller', verifyLoginAdmin, verifySeller, getNotifySellerById);

export default router;