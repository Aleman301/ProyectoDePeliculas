
import * as Sequelize from 'sequelize-typescript';
import { conn } from '../database/connection';
import { User } from './usuarios';

export interface RolAddModel {
    id: number,
    nombre: string
}

export interface RolModel extends Sequelize.Model<RolModel, RolAddModel>{
    id: number,
    nombre: string
}

export const Rol = conn.define<RolModel, RolAddModel>('roles', {
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
