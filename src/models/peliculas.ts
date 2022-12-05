
import * as Sequelize from 'sequelize-typescript'
import { conn} from "../database/connection"
import { PeliculaGenero } from './peliculas_generos';
import { ValoracionComentario } from './valoraciones_comentarios';

export interface PeliculaAddModel {
    id: number;
    nombre:string;
    añoDeLanzamiento:string;
    valoraciones_promedio:string;
    precio:string
    disponibilidad:string;
}

export interface PeliculaModel extends Sequelize.Model<PeliculaModel, PeliculaAddModel>{
    id: number;
    nombre:string;
    añoDeLanzamiento:string;
    valoraciones_promedio:string;
    precio:string
    disponibilidad:string;
    createdAt: Date;
    updateAt: Date; 
}

export const Pelicula = conn.define<PeliculaModel, PeliculaAddModel>('peliculas', {
    id: {
        type: Sequelize.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: Sequelize.DataType.STRING(250),
        unique: true,
    },
    añoDeLanzamiento: {
        type: Sequelize.DataType.STRING(250)
    },
    valoraciones_promedio: {
        type: Sequelize.DataType.INTEGER
    },
    precio: {
        type: Sequelize.DataType.STRING(250)
    },
    disponibilidad: {
        type: Sequelize.DataType.STRING(250)
    }
})

Pelicula.hasMany(ValoracionComentario, {
    foreignKey: 'peliculaId',
    sourceKey: 'id'
});

ValoracionComentario.belongsTo(Pelicula, {
    foreignKey: 'peliculaId',
    targetKey: 'id'
});

Pelicula.hasMany(PeliculaGenero, {
    foreignKey: 'peliculaId',
    sourceKey: 'id'
});

PeliculaGenero.belongsTo(Pelicula, {
    foreignKey: 'peliculaId',
    targetKey: 'id'
});


/** 
@Table({
    tableName: 'peliculas'
})
export class Pelicula extends Model{

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    public id: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
        unique: true,
    })
    public peliculaName: string;

    @Column({
        type: DataType.STRING,
    })
    public añoDeLanzamiento: string

    @Column({
        type: DataType.STRING(250)
    })
    public valoraciones: string

    @Column({
        type: DataType.STRING(50)
    })
    public precio: string

    @Column({
        type: DataType.STRING(50)
    })
    public disponibilidad: string




}**/