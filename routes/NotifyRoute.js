import express from 'express';
import { getNotify, getNotifyById } from '../controller/NotifyController';
import { verifyLogin } from '../middleware/user/AuthUser';
import { verifyLoginAdmin, verifyManagerUser } from '../middleware/admin/AuthManager';

const router = express.Router();

router.get('/notify', verifyLogin, getNotifyById);
router.get('/admin/notify', verifyLoginAdmin, verifyManagerUser, getNotify);

export default router;