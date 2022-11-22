import express from "express";
import {
   getSubCategories,
   getSubCategoryById,
   createSubCategory,
   updatedSubCategory,
   deleteSubCategory
} from '../../controller/admin/SubCategoryController';

const router = express.Router();

router.get('/category/:id', getSubCategories);
router.get('/category/:id', getSubCategoryById);
router.post('/category/', createSubCategory);
router.patch('/category/:id', updatedSubCategory);
router.delete('/category/:id', deleteSubCategory);

export default router;