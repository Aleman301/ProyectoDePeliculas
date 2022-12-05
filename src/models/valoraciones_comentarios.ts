
import * as Sequelize from 'sequelize-typescript';
import { conn } from '../database/connection';

export interface ValoracionComentarioAddModel {
    usuarioId: number,
    peliculaId: number,
    valoracion: number,
    comentario: string
}

export interface ValoracionComentarioModel extends Sequelize.Model<ValoracionComentarioModel, ValoracionComentarioAddModel>{
    usuarioId: number,
    peliculaId: number,
    valoracion: number,
    comentario: string 
}

export const ValoracionComentario = conn.define(
    'valoraciones_comentarios',
    {
        usuarioId: {
            type: Sequelize.DataType.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        peliculaId: {
            type: Sequelize.DataType.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        comentarioId: {
            type: Sequelize.DataType.INTEGER,
            primaryKey: true,
            allowNull: true
        },
        valoracion:{
            type: Sequelize.DataType.INTEGER,
            allowNull: false
        }
    }
);
