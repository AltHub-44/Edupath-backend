const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbConnection = new Sequelize(process.env.PG_DATABASE, process.env.PG_USERNAME, process.env.PG_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
});

module.exports = dbConnection;
