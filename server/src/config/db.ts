import mongoose from 'mongoose'
import config from './config.js'

const db = {
  connect: async () => {
    try {
      const url = config.DATABASE_URL

      await mongoose.connect(url, {
        autoIndex: process.env.NODE_ENV !== 'production',
      })
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  },
  disconnect: () => mongoose.disconnect(),
}

export default db
