import express from 'express';
import { getNotifyAdmin, getNotifyByIdUser, getNotifySellerById } from '../controller/NotifyController';
import { verifyLogin } from '../middleware/user/AuthUser';
import { verifyLoginAdmin, verifyOnlyAdmin, verifySeller } from '../middleware/admin/AuthManager';

const router = express.Router();

router.get('/admin/notify', verifyLoginAdmin, verifyOnlyAdmin, getNotifyAdmin);
router.get('/notify', verifyLogin, getNotifyByIdUser);
router.get('/admin/notify-seller', verifyLoginAdmin, verifySeller, getNotifySellerById);

export default router;