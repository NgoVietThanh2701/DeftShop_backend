import Category from '../../models/CategoryModel';
import SubCategory from '../../models/SubCategoryModel';
import { Op } from 'sequelize';
import Manager from '../../models/ManagerModel';

export const getSubCategorybyCate = async (req, res) => {
   try {
      const category = await Category.findOne({
         where: {
            uuid: req.params.id
         },
      });
      var subCategory;
      if (req.sellerId) {
         subCategory = await SubCategory.findAll({
            where: {
               [Op.and]: [{ sellerId: req.sellerId }, { categoryId: category.id }]
            }
         })
      } else {
         subCategory = await SubCategory.findAll({
            where: { categoryId: category.id }
         });
      }
      if (!subCategory) return res.status(404).json({ msg: "subCategory not found" });
      res.status(200).json(subCategory);
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

export const createSubCategory = async (req, res) => {
   const category = await Category.findOne({ where: { uuid: req.params.id } })
   if (!category) return res.status(200).json({ msg: "category not found" })
   const { name } = req.body;
   try {
      await SubCategory.create({
         name: name,
         categoryId: category.id,
         sellerId: req.sellerId,
      });
      res.status(201).json({ msg: "category created successfully" });
   } catch (error) {
      res.status(400).json({ msg: error.message })
   }
}

export const updatedSubCategory = async (req, res) => {
   try {
      const category = await Category.findOne({
         where: {
            uuid: req.params.id
         },
      });
      const subCategory = await SubCategory.findOne({
         where: {
            [Op.and]: [{ categoryId: category.id }, { uuid: req.params.subId }]
         }
      })
      if (!subCategory) return res.status(404).json({ msg: "subCategory not found" });
      if (req.sellerId !== subCategory.sellerId) return res.status(400).json({ msg: "category not belong to you" })
      const { name } = req.body
      await SubCategory.update({ name }, {
         where: {
            id: subCategory.id
         }
      })
      res.status(200).json({ msg: "updated successfully" });
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

export const deleteSubCategory = async (req, res) => {
   try {
      const category = await Category.findOne({
         where: {
            uuid: req.params.id
         },
      });
      const subCategory = await SubCategory.findOne({
         where: {
            [Op.and]: [{ categoryId: category.id }, { uuid: req.params.subId }]
         }
      });
      if (req.sellerId && req.sellerId !== subCategory.sellerId)
         return res.status(400).json({ msg: "category no belong to you" })
      await SubCategory.destroy({
         where: {
            id: subCategory.id
         }
      });
      res.status(200).json({ msg: "delete successfully" })
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}