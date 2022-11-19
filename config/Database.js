import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(
   process.env.DATABASE_NAME,
   process.env.DB_USERNAME,
   process.env.DB_PASSWORD, {
   host: process.env.HOST_NAME,
   dialect: process.env.DIALECT,
})

export default db;   