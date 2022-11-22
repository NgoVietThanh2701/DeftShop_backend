import Seller from '../../models/SellerModel';
import Manager from '../../models/ManagerModel';
import argon2 from 'argon2';
import User from '../../models/UserModel';

export const login = async (req, res) => {
   var manager = await Manager.findOne({
      where: {
         email: req.body.email
      }
   });
   if (!manager) {
      manager = await Seller.findOne({
         where: {
            email: req.body.email
         }
      });
      if (!manager)
         return res.status(404).json({ msg: "manager not found!" });
      if (manager.status === "no")
         return res.status(404).json({ msg: "please wait! we will approval account you" });
   }
   const user = await User.findOne({
      where: { id: manager.userId }
   });
   const match = await argon2.verify(user.password, req.body.password);
   if (!match) return res.status(400).json({ msg: "Wrong password!" });
   req.session.adminUUID = user.uuid;
   const uuid = user.uuid;
   const name = user.name;
   const email = user.email;
   const nameShop = manager.nameShop;
   const userId = manager.userId;
   res.status(200).json({ uuid, name, email, nameShop, userId });
}

export const me = async (req, res) => {
   if (!req.session.adminUUID) {
      return res.status(401).json({ msg: "Please login account!" });
   }
   var manager = await Manager.findOne({
      attributes: ['uuid', 'name', 'email', 'role'],
      where: {
         uuid: req.session.adminUUID
      }
   });
   if (!manager) {
      const user = await User.findOne({
         where: { uuid: req.session.adminUUID }
      });
      manager = await Seller.findOne({
         attributes: ['id', 'name', 'phone', 'email', 'nameShop', 'address', 'description', 'userId'],
         where: {
            userId: user.id
         }
      })
      if (!manager) return res.status(404).json({ msg: "manager not found!" });
   }
   res.status(200).json(manager);
}

export const logout = (req, res) => {
   req.session.destroy((err) => {
      if (err) return res.status(400).json({ msg: "logout fail!" });
      res.status(200).json({ msg: "logout successfully" })
   });
}