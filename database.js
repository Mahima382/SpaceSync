const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.DB_NAME || '| spacesync_db|',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || 'nabin3414',
  {
    host:    process.env.DB_HOST    || 'localhost',
    port:    process.env.DB_PORT    || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development'
      ? (msg) => console.log(`\x1b[36m[SQL]\x1b[0m ${msg}`)
      : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle:    10000,
    },
  }
)

module.exports = sequelize
