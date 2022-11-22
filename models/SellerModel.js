import { Sequelize } from "sequelize";
import db from "../config/Database";
import Manager from "./ManagerModel";
import User from "./UserModel";

const { DataTypes } = Sequelize;

const Seller = db.define('seller', {
   name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true,
         len: [3, 100]
      }
   },
   phone: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
         notEmpty: true,
         len: 10,
      }
   },
   email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true,
         isEmail: true
      }
   },
   nameShop: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true,
         len: [3, 100]
      }
   },
   address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true,
         len: [3, 100]
      }
   },
   description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true,
         len: [3, 500]
      }
   },
   status: {
      type: DataTypes.STRING,
      defaultValue: "no",
      allowNull: false,
      validate: {
         notEmpty: true,
      }
   },
   userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
   },
}, {
   freezeTableName: true
});

User.hasOne(Seller);
Seller.belongsTo(User, { foreignKey: 'userId' });


// automatic model to table db
// (async () => {
//    await db.sync();
// })();

export default Seller