import express from "express";
import {
   getProductsBySubCate,
   getProductsBySubCateById,
   createProduct,
   updatedProduct,
   deleteProduct,
   getAllProducts,
   deleteProductByCate
} from '../../controller/admin/ProductController';
import { verifyLoginAdmin, verifySeller } from "../../middleware/admin/AuthManager"

const router = express.Router();

router.get('/products', verifyLoginAdmin, getAllProducts); // get all products 
router.delete('/products/:proId', verifyLoginAdmin, deleteProduct); // delete admin
router.get('/category/:id/:subId', verifyLoginAdmin, getProductsBySubCate); //get product from subcategory
router.get('/category/:id/:subId/:proId', verifyLoginAdmin, verifySeller, getProductsBySubCateById);// get product id
router.post('/category/:id/:subId', verifyLoginAdmin, verifySeller, createProduct);
router.patch('/category/:id/:subId/:proId', verifyLoginAdmin, verifySeller, updatedProduct);
router.delete('/category/:id/:subId/:proId', verifyLoginAdmin, deleteProductByCate);

export default router;