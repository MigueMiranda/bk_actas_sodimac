require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',

  port: process.env.PORT || 3000,

  // 👉 SIEMPRE usar DATABASE_URL (local o prod)
  dbUrl: process.env.DATABASE_URL,

  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,

  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

module.exports = { config };
