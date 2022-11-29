import express from "express";
import {
   getCategories,
   createCategory,
   updatedCategory,
   deleteCategory
} from '../../controller/admin/CategoryController';
import { verifyLoginAdmin, verifyOnlyAdmin } from "../../middleware/admin/AuthManager";
const router = express.Router();
router.get('/category', getCategories);
// router.get('/category/:id', verifyLoginAdmin, getCategoryById);
router.post('/category', verifyLoginAdmin, verifyOnlyAdmin, createCategory);
router.patch('/category/:id', verifyLoginAdmin, verifyOnlyAdmin, updatedCategory);
router.delete('/category/:id', verifyLoginAdmin, verifyOnlyAdmin, deleteCategory);

export default router;