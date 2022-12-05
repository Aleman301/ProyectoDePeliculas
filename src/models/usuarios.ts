import * as Sequelize from 'sequelize-typescript'
import { conn} from "../database/connection"
import { ValoracionComentario } from './valoraciones_comentarios';


export interface UserAddModel {
    id: number;
    nombre: string;
    apellido: string;
    accountName:string;
    correo:string;
    telefono: number;
    contraseña:string;
}

export interface UserModel extends Sequelize.Model<UserModel, UserAddModel> {
    id: number;
    nombre: string;
    apellido: string;
    accountName:string;
    correo:string;
    telefono: number;
    contraseña:string;
    createdAt: string;
    updatedAt: string;
}

export const User = conn.define ('usuarios', {
    id: {
        type:Sequelize.DataType.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    nombre: {
        type: Sequelize.DataType.STRING(20),
  
    },
    apellido: {
        type: Sequelize.DataType.STRING(20)
    }, 
    accountName:{
        type:Sequelize.DataType.STRING(50),
        unique: true,
    },
    correo:{
        type:Sequelize.DataType.STRING(100),
        unique: true,
    },
    telefono:{
        type: Sequelize.DataType.INTEGER,
    },
    contraseña:{
        type: Sequelize.DataType.STRING(250)
    }
});

User.hasMany(ValoracionComentario, {
    foreignKey: 'usuarioId',
    sourceKey: 'id'
});

ValoracionComentario.belongsTo(User, {
    foreignKey: 'usuarioId',
    targetKey: 'id'
});
