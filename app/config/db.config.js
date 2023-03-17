const Sequelize = require("sequelize");
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.db_name,
  process.env.db_user,
  process.env.db_password,
  {
    host: process.env.db_host,
    dialect: process.env.db_dialect,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    operatorsAliases: 0,
    pool: {
      max: parseInt(process.env.db_pool_max),
      min: parseInt(process.env.db_pool_min),
      acquire: parseInt(process.env.db_pool_acquire),
      idle: parseInt(process.env.db_pool_idle)
    },
    timezone: '+07:00'
  }
);

const db = {};
db.Sequelize = sequelize;
db.sequelize = sequelize;

async function dbConnection(){
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
dbConnection()

module.exports = db;