const env = (variable: string): any => {
  const value = process.env[variable]

  if (!value) throw new Error(`${variable} not set in ENV`)

  return value
}

const config = {
  NODE_ENV: env('NODE_ENV'),
  PORT: env('PORT'),
  APP_NAME: env('APP_NAME'),
  SERVER_URL: env('SERVER_URL'),
  DATABASE_URL: env('DATABASE_URL'),
  jwt: {
    ACCESS_TOKEN_SECRET: env('ACCESS_TOKEN_SECRET'),
    REFRESH_TOKEN_SECRET: env('REFRESH_TOKEN_SECRET'),
  },
  email: {
    USER: env('EMAIL_USER'),
    PASS: env('EMAIL_PASS'),
  },
}
export default config
