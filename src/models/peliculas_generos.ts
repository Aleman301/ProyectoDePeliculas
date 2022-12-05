
import * as Sequelize from 'sequelize-typescript';
import { conn } from '../database/connection';

export interface PeliculaGeneroAddModel {
    peliculaId: number,
    generoId: number
}

export interface PeliculaGeneroModel extends Sequelize.Model<PeliculaGeneroModel, PeliculaGeneroAddModel>{
    peliculaId: number,
    generoId: number
}

export const PeliculaGenero = conn.define(
    'peliculas_generos',
    {
        peliculaId: {
            type: Sequelize.DataType.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        generoId: {
            type: Sequelize.DataType.INTEGER,
            primaryKey: true,
            allowNull: false
        }
    }
);
