import express from 'express';
import { getSellers, updatedStatusSeller } from '../../controller/admin/SellerController';
import { verifyLoginAdmin, verifyManagerUser } from '../../middleware/admin/AuthManager';

const router = express.Router();

router.get('/seller', verifyLoginAdmin, verifyManagerUser, getSellers);
router.patch('/seller/:id', verifyLoginAdmin, verifyManagerUser, updatedStatusSeller);
router.delete('/seller/:id', verifyLoginAdmin, verifyManagerUser, getSellers);

export default router