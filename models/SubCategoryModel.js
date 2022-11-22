import { Sequelize } from "sequelize";
import db from "../config/Database";
import Category from "./CategoryModel";
import Seller from "./SellerModel";

const { DataTypes } = Sequelize;

const SubCategory = db.define('sub_category', {
   uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   },
   name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true,
         len: [3, 80]
      }
   },
   categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
         notEmpty: true,
      }
   },
   sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
         notEmpty: true,
      }
   }
}, {
   freezeTableName: true
});

Category.hasMany(SubCategory);
SubCategory.belongsTo(Category, { foreignKey: 'categoryId' });

Seller.hasMany(SubCategory);
SubCategory.belongsTo(Seller, { foreignKey: 'sellerId' });

// (async () => {
//    await db.sync();
// })();

export default SubCategory