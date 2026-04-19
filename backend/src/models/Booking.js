const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Booking = sequelize.define('Booking', {
  id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  resource_id: {
    type:       DataTypes.INTEGER,
    allowNull:  false,
    references: { model: 'resources', key: 'id' },
    onDelete:   'CASCADE',
  },
  requested_by: {
    type:      DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Requester name cannot be empty' },
    },
  },
  booking_date: {
    type:      DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: { msg: 'booking_date must be a valid date' },
    },
  },
  status: {
    type:         DataTypes.STRING(50),
    allowNull:    false,
    defaultValue: 'Confirmed',
  },
}, {
  tableName:  'bookings',
  timestamps: true,
})

module.exports = Booking
