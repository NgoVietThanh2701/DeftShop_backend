import Product from '../../models/ProductModel';
import path from "path";
import fs from "fs"
import Category from '../../models/CategoryModel';
import SubCategory from '../../models/SubCategoryModel';
import { Op, where } from 'sequelize';
import User from '../../models/UserModel';
import Seller from '../../models/SellerModel';
import Notify from '../../models/NotifyModel';
import Manager from '../../models/ManagerModel';

export const getProductsBySubCate = async (req, res) => {
   //check 
   const category = await Category.findOne({ where: { uuid: req.params.id } });
   const subCategory = await SubCategory.findOne({ where: { uuid: req.params.subId } });
   if (req.sellerId && subCategory.sellerId !== req.sellerId) return res.status(400).json({ msg: "subcategory not belong you" })
   if (subCategory.categoryId !== category.id) return res.status(400).json({ msg: "subCategory not belong to category" })
   try {
      const products = await Product.findAll({
         attributes: ["uuid", 'name', 'image', 'url', 'description', 'price'],
         where: {
            subCategoryId: subCategory.id
         },
         include: [{
            model: Category,
            attributes: ['id', 'uuid', 'name', 'managerId']
         },
         {
            model: SubCategory,
            attributes: ['id', 'uuid', 'name', 'categoryId', 'sellerId']
         }]
      });
      res.status(200).json(products)
   } catch (error) {
      res.status(400).json({ msg: error.message });
   }
}

export const getProductsByCate = async (req, res) => {
   //check 
   const category = await Category.findOne({ where: { uuid: req.params.id } });
   if (!category) return res.status(400).json({ msg: "Category not found" })
   try {
      const products = await Product.findAll({
         attributes: ["uuid", 'name', 'image', 'url', 'description', 'price'],
         where: {
            categoryId: category.id
         },
         include: [{
            model: Manager,
            attributes: ['id', 'uuid', 'name', 'email', 'role']
         },]
      });
      res.status(200).json(products)
   } catch (error) {
      res.status(400).json({ msg: error.message });
   }
}


export const getProductsBySubCatetById = async (req, res) => {
   //check 
   const category = await Category.findOne({ where: { uuid: req.params.id } });
   const subCategory = await SubCategory.findOne({ where: { uuid: req.params.subId } });
   if (req.sellerId && subCategory.sellerId !== req.sellerId) return res.status(400).json({ msg: "subcategory not belong you" })
   if (subCategory.categoryId !== category.id) return res.status(400).json({ msg: "subCategory not belong to category" })
   try {
      const products = await Product.findOne({
         attributes: ["uuid", 'name', 'image', 'url', 'description', 'price'],
         where: {
            [Op.and]: [{ subCategoryId: subCategory.id }, { uuid: req.params.proId }]
         },
         include: [{
            model: Category,
            attributes: ['id', 'uuid', 'name', 'managerId']
         },
         {
            model: SubCategory,
            attributes: ['id', 'uuid', 'name', 'categoryId', 'sellerId']
         }]
      });
      res.status(200).json(products)
   } catch (error) {
      res.status(400).json({ msg: error.message });
   }
}

export const createProduct = async (req, res) => {
   if (req.files === null) return res.status(400).json({ msg: "No File uploaded" });
   const name = req.body.name;
   const description = req.body.description;
   const price = req.body.price;
   const file = req.files.file;
   const fileSize = file.data.length;
   const ext = path.extname(file.name);

   const fileName = file.md5 + ext;
   const url = `${req.protocol}://${req.get("host")}/images/products/${fileName}`;
   const allowedType = ['.png', '.jpg', '.jpeg'];

   if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
   if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

   //check 
   const category = await Category.findOne({ where: { uuid: req.params.id } });
   const subCategory = await SubCategory.findOne({ where: { uuid: req.params.subId } });
   if (subCategory.sellerId !== req.sellerId) return res.status(400).json({ msg: "subcategory not belong you" })
   if (subCategory.categoryId !== category.id) return res.status(400).json({ msg: "subCategory not belong to category" })

   file.mv(`./public/images/products/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
         await Product.create(
            {
               name: name,
               image: fileName,
               url: url,
               description: description,
               price: price,
               categoryId: category.id,
               subCategoryId: subCategory.id,
            });
         res.status(201).json({ msg: "Product Created Successfully" });
      } catch (error) {
         res.status(400).json({ msg: error.message });
      }
   })
}

export const updatedProduct = async (req, res) => {
   //check 
   const category = await Category.findOne({ where: { uuid: req.params.id } });
   const subCategory = await SubCategory.findOne({ where: { uuid: req.params.subId } });
   if (req.sellerId && subCategory.sellerId !== req.sellerId) return res.status(400).json({ msg: "subcategory not belong you" })
   if (subCategory.categoryId !== category.id) return res.status(400).json({ msg: "subCategory not belong to category" })
   const product = await Product.findOne({
      where: {
         [Op.and]: [{ subCategoryId: subCategory.id }, { uuid: req.params.proId }]
      },
   });
   if (!product) return res.status(400).json({ msg: "product not found" });
   let fileName;
   if (req.files === null) {
      fileName = product.image;
   } else {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const allowedType = ['.png', '.jpg', '.jpeg'];

      if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
      if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

      const filepath = `./public/images/products/${product.image}`;
      fs.unlinkSync(filepath); // delete file in path folder public/images/products

      file.mv(`./public/images/products/${fileName}`, (err) => {
         if (err) return res.status(500).json({ msg: err.message });
      });
   }
   const { name, description, price } = req.body;
   const url = `${req.protocol}://${req.get("host")}/images/products/${fileName}`;
   try {
      await Product.update({
         name: name,
         image: fileName,
         url: url,
         description: description,
         price: price
      },
         {
            where: {
               uuid: req.params.proId
            }
         }
      )
      res.status(200).json({ msg: "updated successfully" })
   } catch (error) {
      return res.status(400).json({ msg: error.message })
   }
}

export const deleteProduct = async (req, res) => {
   //check 
   const category = await Category.findOne({ where: { uuid: req.params.id } });
   const subCategory = await SubCategory.findOne({ where: { uuid: req.params.subId } });
   if (req.sellerId && subCategory.sellerId !== req.sellerId) return res.status(400).json({ msg: "subcategory not belong you" })
   if (subCategory.categoryId !== category.id) return res.status(400).json({ msg: "subCategory not belong to category" })
   const product = await Product.findOne({
      where: {
         [Op.and]: [{ subCategoryId: subCategory.id }, { uuid: req.params.proId }]
      },
   });
   if (!product) return res.status(400).json({ msg: "product not found" });
   try {
      const filepath = `./public/images/products/${product.image}`;
      fs.unlinkSync(filepath);
      // send notify for seller
      // get uuid user
      const seller = await Seller.findOne({
         where: { id: subCategory.sellerId }
      });
      if (!seller) return res.status(400).json({ msg: "seller not found" })
      await Notify.create({
         type: "seller",
         title: "Sản phẩm không hợp lệ",
         content: `Sản phẩm ${product.name} đã bị xoá do vi phạm tiêu chuẩn cộng đồng`,
         userId: seller.userId
      });
      //delete db
      await Product.destroy({
         where: {
            id: product.id
         }
      });
      res.status(200).json({ msg: "Product Deleted Successfully" });
   } catch (error) {
      console.log(error.message);
   }
}