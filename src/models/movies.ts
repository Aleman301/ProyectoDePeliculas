
import * as Sequelize from 'sequelize-typescript'
import { conn} from "../Database/connection"
import { Valoracion } from './valoracion';

export interface MovieAddModel {
    id: number;
    movieName:string;
    añoDeLanzamiento:string;
    valoraciones:string;
    precio:string
    disponibilidad:string;
}

export interface MovieModel extends Sequelize.Model<MovieModel, MovieAddModel>{
    id: number;
    movieName:string;
    añoDeLanzamiento:string;
    valoraciones:string;
    precio:string
    disponibilidad:string;
    createdAt: Date;
    updateAt: Date; 
}

export const Movie = conn.define<MovieModel, MovieAddModel>('movies', {
    id: {
        type: Sequelize.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    movieName: {
        type: Sequelize.DataType.STRING(250),
        unique: true,
    },
    añoDeLanzamiento: {
        type: Sequelize.DataType.STRING(250)
    },
    valoraciones: {
        type: Sequelize.DataType.STRING(250)
    },
    precio: {
        type: Sequelize.DataType.STRING(250)
    },
    disponibilidad: {
        type: Sequelize.DataType.STRING(250)
    }
})

Movie.hasMany(Valoracion, {
    foreignKey: 'movieId',
    sourceKey: 'id'
});

Valoracion.belongsTo(Movie, {
    foreignKey: 'movieId',
    targetKey: 'id'
});



/** 
@Table({
    tableName: 'movies'
})
export class Movie extends Model{

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
    public movieName: string;

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