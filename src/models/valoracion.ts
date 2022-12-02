
import * as Sequelize from 'sequelize-typescript';
import { conn } from '../Database/connection';

export interface ValoracionAddModel {
    usuarioId: number,
    movieId: number,
    valoracion: number
}

export interface ValoracionModel extends Sequelize.Model<ValoracionModel, ValoracionAddModel>{
    usuarioId: number,
    movieId: number,
    valoracion: number   
}

export const Valoracion = conn.define(
    'valoraciones_usuarios',
    {
        usuarioId:{
            type: Sequelize.DataType.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        movieId:{
            type: Sequelize.DataType.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        valoracion:{
            type: Sequelize.DataType.INTEGER,
            allowNull: false
        }
    }
);
