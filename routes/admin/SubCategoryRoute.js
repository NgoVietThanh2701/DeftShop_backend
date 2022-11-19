import express from "express";
import {
   getSubCategories,
   getSubCategoryById,
   createSubCategory,
   updatedSubCategory,
   deleteSubCategory
} from '../../controller/SubCategoryController';

const router = express.Router();

router.get('/category/:id', getSubCategories);
router.get('/category/detail/:id', getSubCategoryById);
router.post('/category/detail', createSubCategory);
router.patch('/category/detail/:id', updatedSubCategory);
router.delete('/category/detail/:id', deleteSubCategory);

export default router;