import express from "express";
import {
   getCategories,
   getCategoryById,
   createCategory,
   updatedCategory,
   deleteCategory
} from '../../controller/CategoryController';

const router = express.Router();

router.get('/category', getCategories);
router.get('/category/:id', getCategoryById);
router.post('/category', createCategory);
router.patch('/category/:id', updatedCategory);
router.delete('/category/:id', deleteCategory);

export default router;