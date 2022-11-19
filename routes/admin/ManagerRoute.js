import express from "express";
import {
   getManagers,
   getManagerById,
   createManager,
   updatedManager,
   deleteManager
} from '../../controller/ManagerController';

const router = express.Router();

router.get('/managers', getManagers);
router.get('/managers/:id', getManagerById);
router.post('/managers', createManager);
router.patch('/managers/:id', updatedManager);
router.delete('/managers/:id', deleteManager);

export default router;