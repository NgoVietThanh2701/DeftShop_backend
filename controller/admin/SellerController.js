import Seller from "../../models/SellerModel";
import Notify from "../../models/NotifyModel"
import User from "../../models/UserModel";

export const createSeller = async (req, res) => { // user registry seller
   const { nameShop, address, description } = req.body;
   // get all manager for check
   const sellers = await Seller.findAll();
   let checkSeller = false;
   sellers.map((s) => {
      if (s.userId === req.userId) { checkSeller = true; }
   });
   if (checkSeller)
      return res.status(404).json({ msg: "Please await, you are registered before!" })
   try {
      await Seller.create({
         name: req.name,
         phone: req.phone,
         email: req.email,
         nameShop: nameShop,
         address: address,
         description: description,
         userId: req.userId
      });
      res.status(201).json({ msg: "create successfully" });
      // send notify to admin
      await Notify.create({
         type: "admin",
         title: "Đăng ký bán hàng",
         content: `${req.name} muốn đăng ký bán hàng`,
         userId: req.userId
      });
   } catch (error) {
      res.status(400).json({ msg: error.message })
   }
}

export const getSellers = async (req, res) => { // admin get all seller
   try {
      const seller = await Seller.findAll({
         attributes: ['name', 'phone', 'email', 'nameShop', 'address', 'description', 'status', 'userId']
      });
      res.status(200).json(seller)
   } catch (error) {
      res.status(400).json({ msg: error.message })
   }
}

export const updatedStatusSeller = async (req, res) => { // admin updated
   const seller = await Seller.findOne({
      where: {
         id: req.params.id
      }
   });
   if (!seller) return res.status(400).json({ msg: "seller not found" });
   if (seller.status === 'yes') return res.status(400).json({ msg: "status is yes" });
   try {
      await Seller.update({
         status: "yes"
      }, {
         where: {
            id: seller.id,
         }
      });
      res.status(200).json({ msg: "seller updated state" })
      // get uuid user
      const user = await User.findOne({
         where: { id: seller.userId }
      });
      if (!user) return res.status(400).json({ msg: "user not found" })
      // send notify to user
      await Notify.create({
         type: "user",
         title: "Đăng ký bán hàng",
         content: "Chúc mừng bạn đã đăng ký thành công! Đăng nhập tại \"http://localhost:5000/admin\"",
         userId: user.id
      });
   } catch (error) {
      return res.status(400).json({ msg: error.message })
   }
}


