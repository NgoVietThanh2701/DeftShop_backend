import { Sequelize } from "sequelize";
import db from "../config/Database";
import Manager from "./ManagerModel";

const { DataTypes } = Sequelize;

const User = db.define('user', {
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
         len: [3, 100]
      }
   },
   phone: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
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
   image: {
      type: DataTypes.STRING,
      allowNull: true,
   },
   url: {
      type: DataTypes.STRING,
      allowNull: true,
   },
   password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true,
      }
   },
}, {
   freezeTableName: true
});

// automatic model to table db
// (async () => {
//    await db.sync();
// })();


export default User