import cookie_parser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Middlewares {
  corsCredentials?: boolean
  corsOrigin?: RegExp | string
  cookieParser?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getExpress(options?: Middlewares) {
  const {
    corsCredentials = true,
    corsOrigin = process.env.NODE_ENV === 'dev'
      ? '*'
      : /(.*\.)?(redwall|zelpay)\.(solutions|store)/,
    cookieParser = true,
  } = options || {}
  const app = express()
  app.use(
    cors({
      credentials: corsCredentials,
      origin: corsOrigin,
    }),
  )
  if (cookieParser) {
    app.use(cookie_parser())
  }
  return app
}
