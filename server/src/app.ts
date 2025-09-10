import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import config from './config/config.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'
import { appLogger } from './middlewares/logger.js'
import { authRoute } from './modules/auth/index.js'

const app = express()

app.use(appLogger)

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Accept',
      'Accept-Language',
      'X-Requested-With',
      'Content-Language',
      'Content-Type',
      'Origin',
      'Authorization',
    ],
    optionsSuccessStatus: 200,
  })
)
app.use(helmet())

app.use(express.json())

app.get('/', (req, res) =>
  res.json({ message: `Welcome to ${config.APP_NAME}` })
)

app.use('/api/auth', authRoute)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
