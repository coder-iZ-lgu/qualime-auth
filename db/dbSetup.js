const { Sequelize } = require("sequelize");

const db = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT,
  username: process.env.DB_USERNAME,
  password: `${process.env.DB_PASSWORD}`,
  logging: process.env.DB_LOG ? console.log : false,
  timezone: "+00:00",
  define: {
    timestamps: false
  }
})

module.exports = db;
