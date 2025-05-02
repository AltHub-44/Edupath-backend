//database connection
require('dotenv').config();
const { Sequelize } = require("sequelize");
const { PG_DATABASE, PG_USERNAME, PG_PASSWORD, PG_HOST, PG_PORT } = process.env;

const dbConnection = new Sequelize(PG_DATABASE, PG_USERNAME, PG_PASSWORD, { 
  host: PG_HOST,
  port: PG_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Changed to false for development
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false // Disable logging in production
});

// Test the connection
dbConnection
  .authenticate()
  .then(() => {
    console.log('✅ Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });

module.exports = dbConnection;