import express from "express";
import {
   getProducts,
   getProductById,
   createProduct,
   updatedProduct,
   deleteProduct
} from '../../controller/ProductController';

const router = express.Router();

router.get('/category', getProducts);
router.get('/category/:id', getProductById);
router.post('/category', createProduct);
router.patch('/category/:id', updatedProduct);
router.delete('/category/:id', deleteProduct);

export default router;