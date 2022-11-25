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
   if (!manager) {
      const user = await User.findOne({
         where: { uuid: req.session.adminUUID }
      });
      manager = await Seller.findOne({
         where: {
            userId: user.id
         }
      });
      if (!manager)
         return res.status(404).json({ msg: "manager not found!" });
      if (manager.status === "no")
         return res.status(404).json({ msg: "please wait! we will approval account you" });
      req.sellerId = manager.id
   }
   next()
}

export const dontManagerUser = async (req, res, next) => {
   var manager = await Manager.findOne({
      where: {
         uuid: req.session.adminUUID
      }
   });
   if (!manager) {
      const user = await User.findOne({
         where: { uuid: req.session.adminUUID }
      });
      manager = await Seller.findOne({
         where: {
            userId: user.id
         }
      });
      if (!manager)
         return res.status(404).json({ msg: "manager not found!" });
      if (manager.status === "no")
         return res.status(404).json({ msg: "please wait! we will approval account you" });
   }
   if (manager.role && manager.role === "manager_user")
      return res.status(400).json({ msg: "please,login with account allow" })
   next()
}

export const verifySeller = async (req, res, next) => {
   const user = await User.findOne({ where: { uuid: req.session.adminUUID } });
   if (!user) return res.status(400).json({ msg: "must login with seller" })
   const seller = await Seller.findOne({
      where: {
         userId: user.id
      }
   });
   if (!seller) return res.status(400).json({ msg: "seller not found" });
   req.sellerId = seller.id;
   next();
}

export const verifyManagerCategory = async (req, res, next) => { // admin va manager_category
   const manager = await Manager.findOne({
      where: {
         uuid: req.session.adminUUID
      }
   });
   if (!manager) return res.status(400).json({ msg: "manager not found" });
   if (manager.role !== "admin" && manager.role !== "manager_category")
      return res.status(404).json({ msg: "must login with admin or manager category" });
   req.managerId = manager.id;
   req.role = manager.role;
   next();
}

export const verifyManagerUser = async (req, res, next) => { // admin va manager_category
   const manager = await Manager.findOne({
      where: {
         uuid: req.session.adminUUID
      }
   });
   if (!manager) return res.status(400).json({ msg: "manager not found" });
   if (manager.role !== "admin" && manager.role !== "manager_user")
      return res.status(404).json({ msg: "must login with admin or manager user" });
   req.managerId = manager.id;
   req.role = manager.role;
   next();
}