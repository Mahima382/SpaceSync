const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Resource = sequelize.define('Resource', {
  id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  name: {
    type:      DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Resource name cannot be empty' },
      len:      { args: [2, 150], msg: 'Name must be 2–150 characters' },
    },
  },
  type: {
    type:         DataTypes.STRING(80),
    allowNull:    false,
    defaultValue: 'Room',
    validate: {
      notEmpty: { msg: 'Resource type cannot be empty' },
    },
  },
  capacity: {
    type:         DataTypes.INTEGER,
    allowNull:    false,
    defaultValue: 1,
    validate: {
      min: { args: [1], msg: 'Capacity must be at least 1' },
    },
  },
}, {
  tableName:  'resources',
  timestamps: true,
})

module.exports = Resource
