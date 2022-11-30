import * as Sequelize from 'sequelize-typescript'
import { conn} from "../Database/connection"


export interface UserAddModel {
    id: number;
    nombre: string;
    apellido: string;
    correo:string;
    telefono: string;
    contraseña:string;
    repetircontraseña:string;
}

export interface UserModel extends Sequelize.Model<UserModel, UserAddModel> {
    id: number;
    nombre: string;
    apellido: string;
    correo:string;
    telefono: number;
    contraseña:string;
    repetircontraseña:string;
    createdAt: string;
    updatedAt: string;
}

export const Usuarioss = conn.define<UserModel, UserAddModel>('Usuarios', {
    id: {
        type:Sequelize.DataType.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    nombre: {
        type: Sequelize.DataType.STRING(250),
  
    },
    apellido: {
        type: Sequelize.DataType.STRING(250)
    },
    correo:{
        type:Sequelize.DataType.STRING(250)
    },
    telefono:{
        type: Sequelize.DataType.INTEGER,
        unique: true,
    },
    contraseña:{
        type: Sequelize.DataType.STRING(250)
    },
    repetircontraseña:{
        type:Sequelize.DataType.STRING(250)
    }
});
