//database connection
require('dotenv').config();
const { Sequelize } = require("sequelize");
const { PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env

const dbConnection = new Sequelize(PG_DATABASE, PG_USERNAME, PG_PASSWORD, { dialect: 'postgres'})

  module.exports = dbConnection;