import app from './app.js'
import config from './config/config.js'
import db from './config/db.js'
import logger from './middlewares/logger.js'

const PORT = config.PORT || 8000

const startServer = async () => {
  try {
    await db.connect()
    logger.info('Database connected')

    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server is running on port ${PORT}`)
    })
  } catch (err) {
    logger.error('Unable to connect to the database', err)
    process.exit(1)
  }
}

startServer()

process.on('SIGTERM', async () => {
  logger.info('SIGINT recieved. Closing DB connection...')

  await db.disconnect()
  process.exit(0)
})
