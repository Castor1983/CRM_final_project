import * as process from "node:process";

import { Config } from "./config.type";

export default (): Config => ({
  client: {
    port: Number(process.env.CLIENT_PORT) || 5173,
    host: process.env.CLIENT_HOST || "localhost",
  },
  app: {
    port: Number(process.env.APP_PORT) || 3000,
    host: process.env.APP_HOST || "localhost",
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  mysql: {
    port: Number(process.env.MYSQL_PORT),
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    dbName: process.env.MYSQL_DB,
  },
  redis: {
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN),
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN),
    activateSecret: process.env.JWT_ACTIVATE_SECRET,
    activateExpiresIn: Number(process.env.JWT_ACTIVATE_EXPIRES_IN),
  },
});
