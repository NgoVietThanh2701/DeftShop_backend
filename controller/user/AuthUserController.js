import User from "../../models/UserModel";
import argon2 from 'argon2';

export const registryUser = async (req, res) => {
   const { name, email, password, confPassword } = req.body;
   if (password !== confPassword)
      return res.status(400).json({ msg: "password not matched" });
   const hashPassword = await argon2.hash(password);
   try {
      await User.create({
         name: name,
         email: email,
         password: hashPassword,
      });
      res.status(201).json({ msg: "create successfully" })
   } catch (error) {
      res.status(400).json({ msg: error.message })
   }
}

export const login = async (req, res) => {
   const user = await User.findOne({
      where: {
         email: req.body.email
      }
   });
   if (!user) return res.status(404).json({ msg: "user not found!" });
   const match = await argon2.verify(user.password, req.body.password);
   if (!match) return res.status(400).json({ msg: "Wrong password!" });
   req.session.userUUID = user.uuid;
   const uuid = user.uuid;
   const name = user.name;
   const email = user.email;
   res.status(200).json({ uuid, name, email });
}

export const me = async (req, res) => {
   if (!req.session.userUUID) {
      return res.status(401).json({ msg: "Please login account!" });
   }
   var user = await User.findOne({
      attributes: ['id', 'uuid', 'name', 'phone', 'email', 'image', 'url', 'createdAt'],
      where: {
         uuid: req.session.userUUID
      }
   });
   if (!user) return res.status(404).json({ msg: "user not found!" });
   res.status(200).json(user);
}

export const logout = (req, res) => {
   req.session.destroy((err) => {
      if (err) return res.status(400).json({ msg: "logout fail!" });
      res.status(200).json({ msg: "logout successfully" })
   });
}
