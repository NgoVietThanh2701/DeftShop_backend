import Cart from '../../models/CartModel'
import Product from '../../models/ProductModel'
import { Op } from 'sequelize'

export const createCart = async (req, res) => {
   const product = await Product.findOne({ where: { uuid: req.params.id } });
   if (!product) return res.status(400).json({ msg: "product not found" });
   const { quantity } = req.body;
   try {
      const cart = await Cart.findOne({
         where: {
            [Op.and]: [{ productId: product.id }, { userId: req.userId }]
         }
      });
      if (cart) {
         await Cart.update({
            quantity: parseInt(cart.quantity) + parseInt(quantity)
         }, {
            where: { id: cart.id }
         })
      } else {
         await Cart.create({
            userId: req.userId,
            productId: product.id,
            quantity: quantity
         });
      }
      return res.status(200).json({ msg: "add cart successfully" });
   } catch (error) {
      return res.status(400).json({ msg: error.message });
   }
}