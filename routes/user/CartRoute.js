import express from 'express';
import { createCart } from '../../controller/user/CartController';
import { verifyLogin } from '../../middleware/user/AuthUser';

const router = express.Router();
router.post('/add-cart/:id', verifyLogin, createCart);

export default router;