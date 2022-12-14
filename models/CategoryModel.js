import { Sequelize } from "sequelize";
import db from "../config/Database";
import Manager from '../models/ManagerModel'

const { DataTypes } = Sequelize;

const Category = db.define('category', {
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
   managerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
         notEmpty: true,
      }
   }

}, {
   freezeTableName: true
});

// (async () => {
//    await db.sync();
// })();

Manager.hasMany(Category);
Category.belongsTo(Manager, { foreignKey: 'managerId' })

export default Category