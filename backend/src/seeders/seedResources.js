// ─────────────────────────────────────────────
//  SpaceSync — Resource Seeder
//  Run: node src/seeders/seedResources.js
// ─────────────────────────────────────────────
require('dotenv').config()
const sequelize  = require('../config/database')
const { Resource } = require('../models')

const SEED_DATA = [
  { name: 'Networking Lab',        type: 'Lab',       capacity: 30 },
  { name: 'Seminar Library',       type: 'Library',   capacity: 50 },
  { name: 'Multimedia Projector A',type: 'Equipment', capacity: 1  },
  { name: 'Conference Room 101',   type: 'Room',      capacity: 20 },
  { name: 'Computer Lab B',        type: 'Lab',       capacity: 40 },
]

async function seed() {
  try {
    await sequelize.authenticate()
    console.log('✔  Database connected')

    await sequelize.sync({ alter: true })
    console.log('✔  Tables synced')

    // Avoid duplicate seeding
    const existing = await Resource.count()
    if (existing > 0) {
      console.log(`⚠  Resources table already has ${existing} row(s). Skipping seed.`)
      console.log('   Delete existing rows first if you want to re-seed.')
      process.exit(0)
    }

    const created = await Resource.bulkCreate(SEED_DATA)
    console.log(`✔  Seeded ${created.length} resources:`)
    created.forEach(r => console.log(`   [${r.id}] ${r.name} — ${r.type} (cap: ${r.capacity})`))

    process.exit(0)
  } catch (err) {
    console.error('✖  Seed failed:', err.message)
    process.exit(1)
  }
}

seed()
