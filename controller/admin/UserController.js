import User from '../../models/UserModel';
import argon2 from "argon2";
import path from 'path';
import fs from 'fs'

export const getUsers = async (req, res) => {
   try {
      const users = await User.findAll({
         attributes: ['id', 'uuid', 'name', 'phone', 'email', 'image', 'url', 'createdAt']
      });
      res.status(200).json(users);
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

export const getUserById = async (req, res) => {
   try {
      const user = await User.findOne({
         attributes: ['id', 'uuid', 'name', 'phone', 'email', 'image', 'url', 'createdAt'],
         where: {
            uuid: req.params.id
         }
      });
      if (!user) return res.status(404).json({ msg: "user not exists" })
      res.status(200).json(user)
   } catch (error) {
      res.status(500).json({ msg: error.message });
   }
}

export const updatedUser = async (req, res) => { // user updated profile
   const user = await User.findOne({
      where: {
         id: req.userId
      }
   });
   if (!user) return res.status(404).json({ msg: "user not found" });
   const { name, phone, password, confPassword } = req.body;
   let hashPassword;
   if (password === "" || password === null) {
      hashPassword = user.password;
   } else {
      hashPassword = await argon2.hash(password);
   }
   if (password !== confPassword)
      return res.status(400).json({ msg: "Password not matched" });
   // set image
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
      await User.update({
         name: name,
         phone: phone,
         email: user.email,
         image: fileName,
         url: url,
         password: hashPassword,
      }, {
         where: { id: user.id }
      })
      res.status(200).json({ msg: "User updated" })
   } catch (error) {
      res.status(400).json({ msg: error.message })
   }
}

export const deleteUser = async (req, res) => {
   const user = await User.findOne({
      where: {
         uuid: req.params.id
      }
   });
   if (!user) return res.status(404).json({ msg: "user not found" });
   try {
      await User.destroy({
         where: {
            id: user.id
         }
      });
      res.status(200).json({ msg: "User deleted successfully" });
   } catch (error) {
      res.status(400).json({ msg: error.message })
   }
}