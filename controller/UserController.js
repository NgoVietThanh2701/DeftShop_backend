import User from '../models/admin/UserModel';
import argon2 from "argon2";

export const getUsers = async (req, res) => {
   try {
      const users = await User.findAll({
         attributes: ['uuid', 'name', 'phone', 'email', 'role', 'createdAt']
      });
      res.status(200).json(users);
   } catch (error) {
      res.status(500).json({ msg: error.message })
   }
}

export const getUserById = async (req, res) => {
   try {
      const user = await User.findOne({
         attributes: ['uuid', 'name', 'phone', 'email', 'role', 'createdAt'],
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

export const createUser = async (req, res) => {
   const { name, phone, email, password, confPassword, role } = req.body;
   if (password !== confPassword)
      return res.status(400).json({ msg: "password not matched" });
   if (phone.length !== 10)
      return res.status(400).json({ msg: "phone must is 10 number" })
   const hashPassword = await argon2.hash(password);
   try {
      await User.create({
         name: name,
         phone: phone,
         email: email,
         password: hashPassword,
         role: role
      });
      res.status(201).json({ msg: "create successfully" })
   } catch (error) {
      res.status(400).json({ msg: error.message })
   }
}

export const updatedUser = async (req, res) => {
   const user = await User.findOne({
      where: {
         uuid: req.params.id
      }
   });
   if (!user) return res.status(404).json({ msg: "user not found" });
   const { name, phone, email, password, confPassword, role } = req.body;
   let hashPassword;
   if (password === "" || password === null) {
      hashPassword = user.password;
   } else {
      hashPassword = await argon2.hash(password);
   }
   if (password !== confPassword)
      return res.status(400).json({ msg: "Password not matched" });
   try {
      await User.update({
         name: name,
         phone: phone,
         email: email,
         password: hashPassword,
         role: role
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