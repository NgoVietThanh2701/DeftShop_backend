import express from "express";
import {
   getSubCategorybyCate,
   createSubCategory,
   updatedSubCategory,
   deleteSubCategory,
} from '../../controller/admin/SubCategoryController';
import { verifyLoginAdmin, verifySeller, dontManagerUser } from "../../middleware/admin/AuthManager";

const router = express.Router();

router.get('/category/:id', verifyLoginAdmin, dontManagerUser, getSubCategorybyCate);
// router.get('/category/:id/:subId', verifyLoginAdmin, getSubCategoryById);
router.post('/category/:id', verifyLoginAdmin, verifySeller, createSubCategory);
router.patch('/category/:id/:subId', verifyLoginAdmin, verifySeller, updatedSubCategory);
router.delete('/category/:id/:subId', verifyLoginAdmin, verifySeller, deleteSubCategory);

export default router;