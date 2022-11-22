import express from "express";
import {
   getManagers,
   getManagerById,
   createManager,
   updatedManager,
   deleteManager
} from '../../controller/admin/ManagerController';

const router = express.Router();

router.get('/manager', getManagers);
router.get('/manager/:id', getManagerById);
router.post('/manager', createManager);
router.patch('/manager/:id', updatedManager);
router.delete('/manager/:id', deleteManager);

export default router;