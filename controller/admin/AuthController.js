import Seller from '../../models/SellerModel';
import Manager from '../../models/ManagerModel';
import argon2 from 'argon2';
import User from '../../models/UserModel';
import path from 'path';
import fs from 'fs'

export const loginAdmin = async (req, res) => {
   var manager = await Manager.findOne({
      where: {
         email: req.body.email
      }
   });
   var match, uuid, name, email, role, user;
   if (!manager) {
      user = await User.findOne({
         where: {
            email: req.body.email
         }
      });
      if (!user) return res.status(401).json({ msg: "email login not found" })
      manager = await Seller.findOne({ where: { userId: user.id } })
      if (!manager)
         return res.status(404).json({ msg: "manager not found!" });
      if (manager.status === "no")
         return res.status(404).json({ msg: "please wait! we will approval account you" });
      uuid = user.uuid;
      name = user.name;
      email = user.email;
   }
   match = await argon2.verify(user ? user.password : manager.password, req.body.password);
   if (!match) return res.status(400).json({ msg: "Wrong password!" });
   req.session.adminUUID = user ? user.uuid : manager.uuid
   if (!user) {
      uuid = manager.uuid;
      name = manager.name;
      email = manager.email;
      role = manager.role;
   }
   user ? res.status(200).json({ uuid, name, email }) : res.status(200).json({ uuid, name, email, role });
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
            model: User,
         }]
      })
      if (!manager) return res.status(404).json({ msg: "manager not found!" });
   }
   res.status(200).json(manager);
}

export const updatedProfile = async (req, res) => {
   if (!req.sellerId) {
      const { name, password, confPassword } = req.body;
      const admin = await Manager.findOne({ where: { uuid: req.loginUUID } })
      if (!admin) return res.status(404).json({ msg: "admin not found" });
      let hashPassword;
      if (password === "" || password === null) {
         hashPassword = admin.password;
      } else {
         hashPassword = await argon2.hash(password);
      }
      if (password !== confPassword)
         return res.status(400).json({ msg: "Password not matched" });
      let fileName, url;
      if (req.files === null) {
         fileName = admin.image ? admin.image : null;
         url = admin.url ? admin.url : null;
      }
      else {
         const file = req.files.file;
         const fileSize = file.data.length;
         const ext = path.extname(file.name);
         let date_ob = new Date();
         const fileName = file.md5 + date_ob.getHours() + date_ob.getMinutes() + date_ob.getSeconds() + ext;
         const allowedType = ['.png', '.jpg', '.jpeg'];

         if (!allowedType.includes(ext.toLocaleLowerCase()))
            return res.status(422).json({ msg: "Invalid image" })
         if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

         if (admin.image !== null && admin.url !== null) {
            const filepath = `./public/images/users/${admin.image}`;
            fs.unlinkSync(filepath); // delete file in path folder public/images/products
         }
         url = `${req.protocol}://${req.get("host")}/images/users/${fileName}`;
         file.mv(`./public/images/users/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
         });
      }
      try {
         await Manager.update({
            name: name,
            email: admin.email,
            image: fileName,
            url: url,
            password: hashPassword,
         }, {
            where: { id: admin.id }
         })
         res.status(200).json({ msg: "Manager updated" })
      } catch (error) {
         res.status(400).json({ msg: error.message })
      }
   } else {
      const user = await User.findOne({ where: { uuid: req.loginUUID } });
      if (!user) return res.status(404).json({ msg: "user not found" });
      const { name, phone, password, confPassword, nameShop, address, description } = req.body;
      let hashPassword;
      if (password === "" || password === null) {
         hashPassword = user.password;
      } else {
         hashPassword = await argon2.hash(password);
      }
      if (password !== confPassword)
         return res.status(400).json({ msg: "Password not matched" });
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
         const fileName = file.md5 + date_ob.getHours() + date_ob.getMinutes() + date_ob.getSeconds() + ext;
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
         const seller = await Seller.findOne({ where: { userId: user.id } })
         await Seller.update({
            nameShop: nameShop,
            address: address,
            description: description,
         }, {
            where: { id: seller.id }
         });
         await User.update({
            name: name,
            phone: phone,
            image: fileName,
            url: url,
            password: hashPassword
         }, {
            where: { id: user.id }
         })
         res.status(200).json({ msg: "Updated profile" })
      } catch (error) {
         res.status(400).json({ msg: error.message })
      }
   }
}

export const logoutAdmin = (req, res) => {
   req.session.destroy((err) => {
      if (err) return res.status(400).json({ msg: "logout fail!" });
      res.status(200).json({ msg: "logout successfully" })
   });
}