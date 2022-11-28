import express from "express";
import {
   getManagers,
   getManagerById,
   createManager,
   updatedManager,
   deleteManager
} from '../../controller/admin/ManagerController';
import { verifyLoginAdmin, verifyOnlyAdmin } from "../../middleware/admin/AuthManager";

const router = express.Router();

router.get('/manager', verifyLoginAdmin, verifyOnlyAdmin, getManagers);
router.get('/manager/:id', verifyLoginAdmin, getManagerById);
router.post('/manager', verifyLoginAdmin, verifyOnlyAdmin, createManager);
router.patch('/manager/:id', verifyLoginAdmin, updatedManager);
router.delete('/manager/:id', verifyLoginAdmin, verifyOnlyAdmin, deleteManager);

export default router;