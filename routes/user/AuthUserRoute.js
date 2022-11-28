import express from "express";
import { registryUser, login, me, logout } from '../../controller/user/AuthUserController';
import { createSeller } from '../../controller/admin/SellerController';
import { verifyLogin } from "../../middleware/user/AuthUser";
import { updatedUser } from "../../controller/admin/UserController";

const router = express.Router();

router.post('/registry', registryUser);
router.get('/me', verifyLogin, me);
router.post('/login', login);
router.delete('/logout', verifyLogin, logout);
router.post('/registry-seller', verifyLogin, createSeller);
router.patch('/profile-updated', verifyLogin, updatedUser);

export default router;