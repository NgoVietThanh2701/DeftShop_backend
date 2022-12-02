import Manager from '../../models/ManagerModel';
import argon2 from 'argon2';
import path from "path";
import fs from "fs"

export const getManagers = async (req, res) => {
   try {
      const managers = await Manager.findAll({
         attributes: ['uuid', 'name', 'email', 'image', 'url', 'role', 'createdAt']
      });
      res.status(200).json(managers);
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

export const getManagerById = async (req, res) => {
   try {
      const manager = await Manager.findOne({
         attributes: ['uuid', 'name', 'email', 'image', 'url', 'role', 'createdAt'],
         where: {
            uuid: req.params.id
         }
      });
      if (!manager) return res.status(404).json({ msg: "manager not exists" })
      res.status(200).json(manager)
   } catch (error) {
      res.status(500).json({ msg: error.message });
   }
}

export const createManager = async (req, res) => {
   const { name, email, password, confPassword, role } = req.body;
   if (password !== confPassword)
      return res.status(400).json({ msg: "password not matched" });
   // get all manager for check
   const managers = await Manager.findAll();
   let checkEmail = false;
   managers.map((manager) => {
      if (manager.email === email) { checkEmail = true; }
   });
   if (checkEmail)
      return res.status(404).json({ msg: "email exists, please retype email" })
   const hashPassword = await argon2.hash(password);
   try {
      await Manager.create({
         name: name,
         email: email,
         password: hashPassword,
         role: role
      });
      res.status(201).json({ msg: "create manager successfully" })

   } catch (error) {
      res.status(400).json({ msg: error.message })
   }
}

export const updatedManager = async (req, res) => {
   const manager = await Manager.findOne({
      where: {
         uuid: req.params.id
      }
   });
   if (!manager) return res.status(404).json({ msg: "manager not found" });
   const { name, password, confPassword, role } = req.body;
   let hashPassword;
   if (password === "" || password === null) {
      hashPassword = manager.password;
   } else {
      hashPassword = await argon2.hash(password);
   }
   if (password !== confPassword)
      return res.status(400).json({ msg: "Password not matched" });
   let fileName, url;
   if (req.files === null) {
      fileName = manager.image ? manager.image : null;
      url = manager.url ? manager.url : null;
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

      if (manager.image !== null && manager.url !== null) {
         const filepath = `./public/images/users/${manager.image}`;
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
         email: manager.email,
         image: fileName,
         url: url,
         password: hashPassword,
         role: role
      }, {
         where: { id: manager.id }
      })
      res.status(200).json({ msg: "Manager updated" })
   } catch (error) {
      res.status(400).json({ msg: error.message })
   }
}

export const deleteManager = async (req, res) => {
   const manager = await Manager.findOne({
      where: {
         uuid: req.params.id
      }
   });
   if (!manager) return res.status(404).json({ msg: "manager not found" });
   try {
      await Manager.destroy({
         where: {
            id: manager.id
         }
      });
      res.status(200).json({ msg: "Manager deleted successfully" });
   } catch (error) {
      res.status(400).json({ msg: error.message })
   }
}