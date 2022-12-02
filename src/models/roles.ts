
import * as Sequelize from 'sequelize-typescript';
import { conn } from '../Database/connection';
import { User } from './user';

export interface RolAddModel {
    id: number,
    nombre: string
}

export interface RolModel extends Sequelize.Model<RolModel, RolAddModel>{
    id: number,
    nombre: string
}

export const Rol = conn.define(
    'roles',
    {
        id: {
            type: Sequelize.DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: Sequelize.DataType.STRING,
            allowNull: false
        }
    }
);

Rol.hasMany(User, {
    foreignKey: 'rolId',
    sourceKey: 'id'
});

User.belongsTo(Rol, {
    foreignKey: 'rolId',
    targetKey: 'id'   
});
