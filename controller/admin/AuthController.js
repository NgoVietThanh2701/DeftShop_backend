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
   var match, uuid, name, email, role, user;
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
      user = await User.findOne({
         where: { id: manager.userId }
      });
      uuid = user.uuid;
      name = user.name;
      email = user.email;
   }
   match = await argon2.verify(user ? user.password : manager.password, req.body.password);
   if (!match) return res.status(400).json({ msg: "Wrong password!" });
   user ? req.session.adminUUID = user.uuid : req.session.adminUUID = manager.uuid
   if (!user) {
      uuid = manager.uuid;
      name = manager.name;
      email = manager.email;
      role = manager.role;
   }
   res.status(200).json({ uuid, name, email, role });
}

export const me = async (req, res) => {
   if (!req.session.adminUUID) {
      return res.status(401).json({ msg: "Please login account!" });
   }
   var manager = await Manager.findOne({
      attributes: ['id', 'uuid', 'name', 'email', 'image', 'url', 'role'],
      where: {
         uuid: req.session.adminUUID
      }
   });
   if (!manager) {
      const user = await User.findOne({
         where: { uuid: req.session.adminUUID }
      });
      manager = await Seller.findOne({
         attributes: ['id', 'nameShop', 'address', 'description', 'createdAt'],
         where: {
            userId: user.id
         },
         include: [{
            model: User
         }]
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