import {Sequelize} from 'sequelize-typescript';
import * as dotenv from 'dotenv';
//import { Movie } from '../models/movies';

    dotenv.config();


export const conn : Sequelize = new Sequelize({
    dialect: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false
})