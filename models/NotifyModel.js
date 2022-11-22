import { Sequelize } from "sequelize";
import db from '../config/Database.js';
import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const Notify = db.define('notify', {
   uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   },
   type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true,
      }
   },
   title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   },
   content: {
      type: DataTypes.STRING,
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
   },
}, {
   freezeTableName: true
});

User.hasMany(Notify);
Notify.belongsTo(User, { foreignKey: 'userId' });

// (async () => {
//    await db.sync();
// })();

export default Notify