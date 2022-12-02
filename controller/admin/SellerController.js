import Seller from "../../models/SellerModel";
import Notify from "../../models/NotifyModel"
import User from "../../models/UserModel";
import { Op } from "sequelize";
import path from 'path'
import fs from 'fs'

export const createSeller = async (req, res) => { // user registry seller
   const { nameShop, address, description } = req.body;
   // get all manager for check
   const sellers = await Seller.findAll();
   let checkSeller;
   sellers.map((s) => {
      if (s.userId === req.userId) { checkSeller = true; }
   });
   if (checkSeller)
      return res.status(404).json({ msg: "Please await, you are registered before!" })
   try {
      await Seller.create({
         nameShop: nameShop,
         address: address,
         description: description,
         userId: req.userId
      });
      res.status(201).json({ msg: "create successfully" });
      const user = await User.findOne({ where: { id: req.userId } });
      // send notify to admin
      await Notify.create({
         type: "admin",
         title: "Đăng ký bán hàng",
         content: `${user.name} muốn đăng ký bán hàng`,
         userId: req.userId
      });
   } catch (error) {
      res.status(400).json({ msg: error.message })
   }
}

export const getSellers = async (req, res) => { // admin get all seller
   try {
      const seller = await Seller.findAll({
         attributes: ['id', 'nameShop', 'address', 'description', 'status', 'createdAt'],
         include: [{
            model: User,
         }],
         where: { status: "yes" }
      });
      res.status(200).json(seller)
   } catch (error) {
      res.status(400).json({ msg: error.message })
   }
}


export const getSellerById = async (req, res) => { // admin get all seller
   try {
      const seller = await Seller.findAll({
         attributes: ['id', 'nameShop', 'address', 'description', 'status'],
         where: { id: req.params.id },
         include: [{
            model: User
         }]
      });
      res.status(200).json(seller)
   } catch (error) {
      res.status(400).json({ msg: error.message })
   }
}

export const updatedStatusSeller = async (req, res) => { // admin browser seller

   const seller = await Seller.findOne({
      where: {
         userId: req.params.id
      }
   });
   if (!seller) return res.status(400).json({ msg: "seller not found" });
   if (seller.status === 'yes') return res.status(400).json({ msg: "status was yes" });
   try {
      //delete notify admin
      const notify = await Notify.findOne({
         where: {
            [Op.and]: [{ type: "admin" }, { userId: seller.userId }]
         }
      });
      await Notify.destroy({ where: { id: notify.id } });
      // send notify to user
      await Notify.create({
         type: "user",
         title: "Đăng ký bán hàng",
         content: "Chúc mừng bạn đã đăng ký thành công! Đăng nhập tại \"http://localhost:5000/admin\"",
         userId: seller.userId
      });
      await Seller.update({
         status: "yes"
      }, {
         where: {
            id: seller.id,
         }
      });
      res.status(200).json({ msg: "seller updated state" });
   } catch (error) {
      return res.status(400).json({ msg: error.message })
   }
}

export const updateSeller = async (req, res) => {
   const seller = await Seller.findOne({
      where: {
         id: req.params.id
      }
   });
   const user = await User.findOne({ where: { id: seller.userId } })
   if (!user) return res.status(404).json({ msg: "seller not found" });
   const { nameShop, description, address, name } = req.body;
   let fileName, url;
   if (req.files === null) {
      fileName = user.image ? user.image : null;
      url = user.url ? user.url : null;
   }
   else {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      let date_ob = new Date();
      fileName = file.md5 + date_ob.getHours() + date_ob.getMinutes() + date_ob.getSeconds() + ext;
      const allowedType = ['.png', '.jpg', '.jpeg'];

      if (!allowedType.includes(ext.toLocaleLowerCase()))
         return res.status(422).json({ msg: "Invalid image" })
      if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

      if (user.image !== null && user.url !== null) {
         const filepath = `./public/images/users/${user.image}`;
         fs.unlinkSync(filepath); // delete file in path folder public/images/products
      }
      url = `${req.protocol}://${req.get("host")}/images/users/${fileName}`;
      file.mv(`./public/images/users/${fileName}`, (err) => {
         if (err) return res.status(500).json({ msg: err.message });
      });
   }
   try {
      await User.update({
         name: name,
         image: fileName,
         url: url
      }, {
         where: { id: user.id }
      });
      await Seller.update({
         nameShop: nameShop,
         address: address,
         description: description
      }, { where: { id: seller.id } })
      res.status(200).json({ msg: "Seller updated" })
   } catch (error) {
      res.status(400).json({ msg: error.message })
   }
}


