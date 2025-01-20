export type Config = {
  app: AppConfig;
  admin: AdminConfig;
  mysql: MysqlConfig;
  jwt: JwtConfig;
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
};
