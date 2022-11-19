import { Sequelize } from "sequelize";
import db from "../../config/Database";
import Category from "./CategoryModel";
import User from '../admin/UserModel';
import Manager from '../admin/ManagerModel';

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
   userId: {
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

User.hasMany(SubCategory);
SubCategory.belongsTo(User, { foreignKey: 'userId' });

export default SubCategory