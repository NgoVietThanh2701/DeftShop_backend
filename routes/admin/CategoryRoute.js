import express from "express";
import {
   getCategories,
   createCategory,
   updatedCategory,
   deleteCategory
} from '../../controller/admin/CategoryController';
import { dontManagerUser, verifyLoginAdmin, verifyManagerCategory } from "../../middleware/admin/AuthManager";
const router = express.Router();

router.get('/category', dontManagerUser, getCategories);
// router.get('/category/:id', verifyLoginAdmin, getCategoryById);
router.post('/category', verifyLoginAdmin, verifyManagerCategory, createCategory);
router.patch('/category/:id', verifyLoginAdmin, verifyManagerCategory, updatedCategory);
router.delete('/category/:id', verifyLoginAdmin, verifyManagerCategory, deleteCategory);

export default router;