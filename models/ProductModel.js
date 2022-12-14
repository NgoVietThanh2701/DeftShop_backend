import { Sequelize } from "sequelize";
import db from "../config/Database";
import SubCategory from "./SubCategoryModel";
import Category from "./CategoryModel";
import User from "./UserModel";
import Seller from "./SellerModel";

const { DataTypes } = Sequelize;

const Product = db.define('product', {
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
   image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true,
      }
   },
   url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true,
      }
   },
   description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: false,
         len: [3, 500]
      }
   },
   price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
         notEmpty: true,
      }
   },
   discount: {
      type: DataTypes.INTEGER,
      allowNull: true
   },
   categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
         notEmpty: true,
      }
   },
   subCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   },
   sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   },
}, {
   freezeTableName: true
});

Category.hasMany(Product);
Product.belongsTo(Category, { foreignKey: 'categoryId' });

SubCategory.hasMany(Product);
Product.belongsTo(SubCategory, { foreignKey: 'subCategoryId' });

Seller.hasMany(Product);
Product.belongsTo(Seller, { foreignKey: 'sellerId' });

// (async () => {
//    await db.sync();
// })();

export default Product