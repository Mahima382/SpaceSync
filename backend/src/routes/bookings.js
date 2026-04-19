const express  = require('express')
const router   = express.Router()
const { Op }   = require('sequelize')
const { Booking, Resource } = require('../models')

// ─── GET /api/bookings ────────────────────────
// Returns all bookings with eagerly-loaded Resource (JOIN)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model:      Resource,
          as:         'Resource',
          attributes: ['id', 'name', 'type', 'capacity'],
        },
      ],
      order: [['booking_date', 'ASC'], ['createdAt', 'DESC']],
    })
    return res.json(bookings)
  } catch (err) {
    console.error('[GET /bookings]', err)
    return res.status(500).json({ error: 'Failed to fetch bookings' })
  }
})

// ─── POST /api/bookings ───────────────────────
// Create a new booking
// Body: { resource_id, requested_by, booking_date }
// Bonus: Prevents double-booking same resource on same date
router.post('/', async (req, res) => {
  const { resource_id, requested_by, booking_date } = req.body

  // Field validation
  if (!resource_id || !requested_by || !booking_date) {
    return res.status(400).json({
      error: 'resource_id, requested_by, and booking_date are all required',
    })
  }

  // Verify resource exists
  const resource = await Resource.findByPk(resource_id)
  if (!resource) {
    return res.status(404).json({
      error: `Resource with id ${resource_id} does not exist`,
    })
  }

  try {
    // ── Bonus: Double-booking check ──────────────
    const conflict = await Booking.findOne({
      where: {
        resource_id,
        booking_date,
      },
    })

    if (conflict) {
      return res.status(400).json({
        error: `"${resource.name}" is already booked on ${booking_date}. Please choose a different date.`,
      })
    }

    // Create the booking
    const booking = await Booking.create({
      resource_id,
      requested_by: requested_by.trim(),
      booking_date,
      status: 'Confirmed',
    })

    // Return with associated resource
    const full = await Booking.findByPk(booking.id, {
      include: [{ model: Resource, as: 'Resource', attributes: ['id', 'name', 'type', 'capacity'] }],
    })

    return res.status(201).json(full)
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map((e) => e.message)
      return res.status(400).json({ error: messages.join('; ') })
    }
    console.error('[POST /bookings]', err)
    return res.status(500).json({ error: 'Failed to create booking' })
  }
})

// ─── DELETE /api/bookings/:id ─────────────────
// Cancel / delete a specific booking
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const booking = await Booking.findByPk(id)

    if (!booking) {
      return res.status(404).json({ error: `Booking #${id} not found` })
    }

    await booking.destroy()
    return res.json({ message: `Booking #${id} cancelled successfully` })
  } catch (err) {
    console.error('[DELETE /bookings/:id]', err)
    return res.status(500).json({ error: 'Failed to delete booking' })
  }
})

module.exports = router
