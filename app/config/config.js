require('dotenv').config()

const config = {
  development: {
    port: process.env.PORT,
    username: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name,
    host: process.env.db_host,
    dialect: process.env.db_dialect
  },
  test: {
    port: process.env.PORT,
    username: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name,
    host: process.env.db_host,
    dialect: process.env.db_dialect
  },
  production: {
    port: process.env.PORT,
    username: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name,
    host: process.env.db_host,
    dialect: process.env.db_dialect
  },
};

module.exports = config;