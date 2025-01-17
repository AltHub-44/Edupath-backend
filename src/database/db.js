//database connection
require('dotenv').config();
const { Sequelize } = require("sequelize");
const { PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env

const dbConnection = async () => {
    try {
        //use pg connection uri or credential based on the one available to you
        // const sequelize = new Sequelize(process.env.PG_CONNECTION_URI, { dialect: 'postgres'})
        const sequelize = new Sequelize(PG_DATABASE, PG_USERNAME, PG_PASSWORD, { dialect: 'postgres'})
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
  };

  module.exports = { dbConnection };