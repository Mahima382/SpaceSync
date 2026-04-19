const Resource = require('./Resource')
const Booking  = require('./Booking')

// ─── Associations ─────────────────────────────
// One Resource  →  Many Bookings
Resource.hasMany(Booking,  { foreignKey: 'resource_id', as: 'Bookings' })
Booking.belongsTo(Resource, { foreignKey: 'resource_id', as: 'Resource' })

module.exports = { Resource, Booking }
