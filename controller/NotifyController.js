import Notify from "../models/NotifyModel"
import { Op } from "sequelize";

export const createNotify = async (req, res) => {
   const { type, content } = req.body;
   try {
      await Notify.create({

      })
   } catch (error) {
      return res.status(400).json({ msg: error.message });
   }
}

export const getNotify = async (req, res) => {
   try {
      const notify = await Notify.findAll({
         attributes: ["uuid", 'type', 'title', 'content', 'userId'],
         where: {
            type: "admin"
         }
      });
      res.status(200).json(notify);
   } catch (error) {
      return res.status(500).json({ msg: error.message })
   }
}

export const getNotifyById = async (req, res) => {
   try {
      const notify = await Notify.findAll({
         attributes: ["uuid", 'type', 'title', 'content', 'userId'],
         where: {
            [Op.and]: [{ type: "user" }, { userId: req.userId }]
         }
      });
      res.status(200).json(notify);
   } catch (error) {
      return res.status(500).json({ msg: error.message })
   }
}