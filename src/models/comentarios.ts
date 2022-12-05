
import * as Sequelize from 'sequelize-typescript';
import { conn } from '../database/connection';
import { Pelicula } from './peliculas';
import { ValoracionComentario } from './valoraciones_comentarios';

export interface ComentarioAddModel {
    id: number,
    comentario: string
}

export interface ComentarioModel extends Sequelize.Model<ComentarioModel, ComentarioAddModel>{
    id: number,
    comentario: string
}

export const Comentario = conn.define('comentarios', {
        id: {
            type: Sequelize.DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        comentario: {
            type: Sequelize.DataType.STRING(250),
            allowNull: false
        }
    }
);

Comentario.hasMany(ValoracionComentario, {
    foreignKey: 'comentarioId',
    sourceKey: 'id'
});

ValoracionComentario.belongsTo(Comentario, {
    foreignKey: 'comentarioId',
    targetKey: 'id'
});
