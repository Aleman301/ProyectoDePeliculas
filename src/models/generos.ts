
import * as Sequelize from 'sequelize-typescript';
import { conn } from '../database/connection';
import { PeliculaGenero } from './peliculas_generos';

export interface GeneroAddModel {
    id: number,
    nombre: string
}

export interface GeneroModel extends Sequelize.Model<GeneroModel, GeneroAddModel>{
    id: number,
    nombre: string
}

export const Genero = conn.define('generos', {
        id: {
            type: Sequelize.DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: Sequelize.DataType.STRING(50),
            allowNull: false
        }
    }
);

Genero.hasMany(PeliculaGenero, {
    foreignKey: 'generoId',
    sourceKey: 'id'
});

PeliculaGenero.belongsTo(Genero, {
    foreignKey: 'generoId',
    targetKey: 'id'
});
