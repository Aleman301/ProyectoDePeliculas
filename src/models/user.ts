import * as Sequelize from 'sequelize-typescript'
import { conn} from "../Database/connection"
import { Valoracion } from './valoracion';


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

export const User = conn.define<UserModel, UserAddModel>('usuarios', {
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

User.hasMany(Valoracion, {
    foreignKey: 'usuarioId',
    sourceKey: 'id'
});

Valoracion.belongsTo(User, {
    foreignKey: 'movieId',
    targetKey: 'id'
});
