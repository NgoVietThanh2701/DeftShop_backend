import { DataTypes, Sequelize } from "sequelize";
import db from '../config/Database'
import User from '../models/UserModel';
import Product from './ProductModel'

const Cart = db.define('carts', {
   uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   },
   userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
         notEmpty: true,
      }
   },
   productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   },
   quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
         notEmpty: true,
      }
   }
});

User.hasMany(Cart);
Cart.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(Cart);
Cart.belongsTo(Product, { foreignKey: "productId" });

// (async () => {
//    await db.sync();
// })();

export default Cart