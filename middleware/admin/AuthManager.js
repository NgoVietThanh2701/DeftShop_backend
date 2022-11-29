import User from "../../models/UserModel";
import Manager from "../../models/ManagerModel"
import Seller from "../../models/SellerModel";

export const verifyLoginAdmin = async (req, res, next) => {
   if (!req.session.adminUUID) {
      return res.status(401).json({ msg: "please login admin account " });
   }
   var manager = await Manager.findOne({
      where: {
         uuid: req.session.adminUUID
      }
   })
   let user;
   if (!manager) {
      user = await User.findOne({
         where: { uuid: req.session.adminUUID }
      });
      if (!user) return res.status(400).json({ msg: "user login not found" })
      manager = await Seller.findOne({
         where: {
            userId: user.id
         }
      });
      if (!manager)
         return res.status(404).json({ msg: "manager not found!" });
      if (manager.status === "no")
         return res.status(404).json({ msg: "please wait! we will approval account you" });
      req.sellerId = manager.id;
   }
   req.loginUUID = user ? user.uuid : manager.uuid;
   next()
}

export const verifySeller = async (req, res, next) => {
   const user = await User.findOne({ where: { uuid: req.session.adminUUID } });
   if (!user) return res.status(400).json({ msg: "must login with role is seller" })
   const seller = await Seller.findOne({
      where: {
         userId: user.id
      }
   });
   if (!seller) return res.status(400).json({ msg: "seller not found" });
   if (seller.status === "no")
      return res.status(404).json({ msg: "please wait! we will approval account you" });
   req.sellerId = seller.id;
   next();
}

export const verifyOnlyAdmin = async (req, res, next) => {
   const admin = await Manager.findOne({ where: { uuid: req.session.adminUUID } });
   if (!admin) return res.status(400).json({ msg: "admin not found" });
   if (admin.role !== 'admin') return res.status(401).json({ msg: "please, login with role is admin" })
   req.adminId = admin.id;
   next();
}