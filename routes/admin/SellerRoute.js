import express from 'express';
import { getSellers, updatedStatusSeller, getSellerById } from '../../controller/admin/SellerController';
import { verifyLoginAdmin, verifyOnlyAdmin } from '../../middleware/admin/AuthManager';

const router = express.Router();

router.get('/seller', verifyLoginAdmin, getSellers);
router.get('/seller/:id', verifyLoginAdmin, getSellerById);
router.patch('/seller/:id', verifyLoginAdmin, verifyOnlyAdmin, updatedStatusSeller);
router.delete('/seller/:id', verifyLoginAdmin, getSellers);

export default router