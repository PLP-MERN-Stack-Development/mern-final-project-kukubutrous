import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(
    isProduction ? process.env.MYSQL_URL : process.env.MYSQL_DATABASE,
    isProduction ? undefined : process.env.MYSQL_USER,
    isProduction ? undefined : process.env.MYSQL_PASSWORD,
    {
        host: isProduction ? undefined : process.env.MYSQL_HOST,
        dialect: 'mysql',
        logging: false,
        dialectOptions: isProduction
            ? { ssl: { require: true, rejectUnauthorized: false } }
            : {},
        pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
    }
);

export default sequelize;
