import Category from '../../models/CategoryModel';
import Manager from '../../models/ManagerModel';
import { Op } from "sequelize";

export const getCategories = async (req, res) => {
   try {
      const categories = await Category.findAll({
         attributes: ['uuid', 'name'],
         include: [{
            model: Manager,
            attributes: ['name', 'email', 'role']
         }]
      });
      res.status(200).json(categories);
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

export const getCategoryById = async (req, res) => {
   try {
      const category = await Category.findOne({
         attributes: ['uuid', 'name'],
         where: {
            uuid: req.params.id
         },
         include: [{
            model: Manager,
            attributes: ['name', 'email', 'role']
         }]
      });
      if (!category) return res.status(404).json({ msg: "category not found" });
      res.status(200).json(category);
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

export const createCategory = async (req, res) => {
   const { name } = req.body;
   try {
      await Category.create({
         name: name,
         managerId: req.managerId,
      });
      res.status(201).json({ msg: "category created successfully" });
   } catch (error) {
      res.status(400).json({ msg: error.message })
   }
}

export const updatedCategory = async (req, res) => { // admin updated all category, manager_category update only it created
   try {
      const category = await Category.findOne({
         where: {
            uuid: req.params.id
         }
      })
      if (!category) res.status(404).json({ msg: "category not found" });
      const { name } = req.body;
      await Category.update({
         name: name,
         managerId: req.managerId
      }, {
         where: { id: category.id }
      });
      res.status(200).json({ msg: "category updated successfully" });
   } catch (error) {
      res.status(500).json({ msg: error.message });
   }
}

export const deleteCategory = async (req, res) => {
   try {
      const category = await Category.findOne({
         where: {
            uuid: req.params.id
         }
      })
      if (!category) return res.status(404).json({ msg: "category not found" });
      await Category.destroy({
         where: { id: category.id }
      });
      res.status(200).json({ msg: "category deleted successfully" });
   } catch (error) {
      res.status(500).json({ msg: error.message });
   }
}