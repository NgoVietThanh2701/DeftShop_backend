import User from "../../models/UserModel";

export const verifyLogin = async (req, res, next) => {
   if (!req.session.userUUID) {
      return res.status(401).json({ msg: "please login account" });
   }
   var user = await User.findOne({
      where: {
         uuid: req.session.userUUID
      }
   })
   if (!user)
      return res.status(404).json({ msg: "user not found!" });
   req.userId = user.id;
   req.name = user.name;
   req.phone = user.phone;
   req.email = user.email;
   next()
}