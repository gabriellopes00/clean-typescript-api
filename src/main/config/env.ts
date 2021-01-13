import 'dotenv/config'

export default {
  mongoUrl:
    process.env.MONGO_URL || 'mongodb://mongo:27017/clean-typescript-api',
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET_KEY || 'jw3R4fdaF74Fd7dfH'
}
