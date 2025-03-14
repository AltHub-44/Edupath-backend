//database connection
require('dotenv').config();
const { Sequelize } = require("sequelize");
const { PG_DATABASE, PG_USERNAME, PG_PASSWORD, PG_HOST, PG_PORT } = process.env

const dbConnection = new Sequelize(PG_DATABASE, PG_USERNAME, PG_PASSWORD, { 
  host: PG_HOST,
  port: PG_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true, // Ensure proper SSL validation
    },
  },
}
)

  module.exports = dbConnection;