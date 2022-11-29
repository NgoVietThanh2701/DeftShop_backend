import express from 'express';
import { loginAdmin, logoutAdmin, me, updatedProfile } from "../../controller/admin/AuthController.js";
import { verifyLoginAdmin } from '../../middleware/admin/AuthManager.js';

const router = express.Router();

router.get('/me', me);
router.post('/login', loginAdmin);
router.delete('/logout', logoutAdmin);
router.patch('/update-profile', verifyLoginAdmin, updatedProfile);

export default router;