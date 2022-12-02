import Notify from "../models/NotifyModel"
import { Op } from "sequelize";
import Seller from "../models/SellerModel";
import User from "../models/UserModel";

export const createNotify = async (req, res) => {
   const { type, content } = req.body;
   try {
      await Notify.create({

      })
   } catch (error) {
      return res.status(400).json({ msg: error.message });
   }
}

export const getNotifyAdmin = async (req, res) => {
   try {
      const notify = await Notify.findAll({
         attributes: ['id', "uuid", 'type', 'title', 'content', 'createdAt'],
         where: {
            type: "admin"
         },
         include: [{
            model: User
         }]
      });
      res.status(200).json(notify);
   } catch (error) {
      return res.status(500).json({ msg: error.message })
   }
}

export const getNotifyByIdUser = async (req, res) => {
   try {
      const notify = await Notify.findAll({
         attributes: ['id', "uuid", 'type', 'title', 'content', 'userId', 'createdAt'],
         where: {
            [Op.and]: [{ type: "user" }, { userId: req.userId }]
         }
      });
      res.status(200).json(notify);
   } catch (error) {
      return res.status(500).json({ msg: error.message })
   }
}

export const getNotifySellerById = async (req, res) => {
   if (!req.sellerId) return res.status(400).json({ msg: "please login with seller" })
   const seller = await Seller.findOne({ where: { id: req.sellerId } });

   try {
      const notify = await Notify.findAll({
         attributes: ['id', "uuid", 'type', 'title', 'content', 'userId', 'createdAt'],
         where: {
            [Op.and]: [{ type: "seller" }, { userId: seller.userId }]
         }
      });
      res.status(200).json(notify);
   } catch (error) {
      return res.status(500).json({ msg: error.message })
   }
}

export const deleteNotify = async (req, res) => {
   try {
      const notify = await Notify.findOne({ where: { uuid: req.params.id } });
      if (!notify) return res.status(400).json({ msg: "notify not found" });
      await Notify.destroy({ where: { id: notify.id } });
      res.status(200).json({ msg: "delete successfully" });
   } catch (error) {
      return res.status(400).json({ msg: error.message })
   }
}