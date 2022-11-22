import Manager from '../../models/ManagerModel';
import argon2 from 'argon2';

export const getManagers = async (req, res) => {
   try {
      const managers = await Manager.findAll({
         attributes: ['uuid', 'name', 'email', 'role', 'createdAt']
      });
      res.status(200).json(managers);
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

export const getManagerById = async (req, res) => {
   try {
      const manager = await Manager.findOne({
         attributes: ['uuid', 'name', 'email', 'role', 'createdAt'],
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
   const { name, email, password, confPassword, role } = req.body;
   // get all manager for check
   const managers = await Manager.findAll();
   let checkEmail = false;
   managers.map((m) => {
      if (m.email === email && manager.email !== email) { checkEmail = true; }
   });
   console.log(manager.email)
   if (checkEmail)
      return res.status(404).json({ msg: "email exists, please retype email" })
   let hashPassword;
   if (password === "" || password === null) {
      hashPassword = user.password;
   } else {
      hashPassword = await argon2.hash(password);
   }
   if (password !== confPassword)
      return res.status(400).json({ msg: "Password not matched" });
   try {
      await Manager.update({
         name: name,
         email: email,
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