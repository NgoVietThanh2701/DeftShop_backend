import express from "express";
import {
   getProductsBySubCate,
   getProductsBySubCatetById,
   createProduct,
   updatedProduct,
   deleteProduct,
   getProductsByCate,
   getAllProducts
} from '../../controller/admin/ProductController';
import { dontManagerUser, verifyLoginAdmin, verifySeller } from "../../middleware/admin/AuthManager"

const router = express.Router();

router.get('/products', verifyLoginAdmin, dontManagerUser, getAllProducts);
router.get('/category-product/:id/', verifyLoginAdmin, dontManagerUser, getProductsByCate);
router.get('/category/:id/:subId', verifyLoginAdmin, dontManagerUser, getProductsBySubCate);
router.get('/category/:id/:subId/:proId', verifyLoginAdmin, verifySeller, getProductsBySubCatetById);
router.post('/category/:id/:subId', verifyLoginAdmin, verifySeller, createProduct);
router.patch('/category/:id/:subId/:proId', verifyLoginAdmin, verifySeller, updatedProduct);
router.delete('/category/:id/:subId/:proId', verifyLoginAdmin, dontManagerUser, deleteProduct);

export default router;