export const configuration = () => ({
  env: process.env.NODE_ENV,
  port: (parseInt(process.env.APP_PORT, 10) || 3000) as number,
  jwt: {
    secret: process.env.APP_JWT_SECRET,
    expiresIn: process.env.APP_JWT_EXPIRATION,
    revocationSeconds: process.env.APP_JWT_REVOCATION_SECONDS,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    type: process.env.DB_TYPE,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
});
