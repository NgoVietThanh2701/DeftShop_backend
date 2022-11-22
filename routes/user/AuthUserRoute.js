import express from "express";
import { registry, login, me, logout } from '../../controller/user/AuthUserController';
import { createSeller } from '../../controller/admin/SellerController';
import { verifyLogin } from "../../middleware/user/AuthUser";

const router = express.Router();

router.post('/registry', registry);
router.get('/me', me);
router.post('/login', login);
router.delete('/logout', logout);
router.post('/registry-seller', verifyLogin, createSeller);

export default router;