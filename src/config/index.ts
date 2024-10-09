import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  default_user_pass: process.env.DEFAULT_USER_PASS,
  env: process.env.NODE_ENV,
  production_db_url: process.env.PRODUCTION_DB_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  smtp_host: process.env.SMTP_HOST,
  smtp_port: process.env.SMTP_PORT,
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASSWORD,
  client_port: process.env.CLIENT_PORT,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  vercel: {
    org_id: process.env.VERCEL_ORG_ID,
    project_id: process.env.VERCEL_PROJECT_ID,
  },
  redis: {
    redis_password: process.env.REDIS_PASSWORD,
    redis_host: process.env.REDIS_HOST,
    redis_port: process.env.REDIS_PORT,
  },
  stripe: {
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    stripe_webhook_secret_key: process.env.STRIPE_WEBHOOK_SECRET,
    stripe_payment_success_url: process.env.STRIPE_PAYMENT_SUCCESS_URL,
    stripe_payment_failed_url: process.env.STRIPE_PAYMENT_FAILED_URL,
  },
}
