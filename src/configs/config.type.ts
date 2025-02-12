export type Config = {
  app: AppConfig;
  admin: AdminConfig;
  mysql: MysqlConfig;
  jwt: JwtConfig;
  redis: RedisConfig;
  client: ClientConfig;
};

export type ClientConfig = {
  port: number;
  host: string;
};
export type AppConfig = {
  port: number;
  host: string;
};

export type AdminConfig = {
  email: string;
  password: string;
};

export type MysqlConfig = {
  port: number;
  host: string;
  user: string;
  password: string;
  dbName: string;
};

export type JwtConfig = {
  accessSecret: string;
  accessExpiresIn: number;
  refreshSecret: string;
  refreshExpiresIn: number;
  activateSecret: string;
  activateExpiresIn: number;
};

export type RedisConfig = {
  port: number;
  host: string;
};