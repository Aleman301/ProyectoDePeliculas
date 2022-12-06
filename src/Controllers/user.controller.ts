import { Request, Response, Router } from "express"
import bcrypt from 'bcrypt';
//import { User } from "../models/user";
import { validate } from "class-validator";
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from "../dtos/create-user.dto";
import userService from "../services/user.service";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { User } from "../models/usuarios";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import rolService from "../services/rol.service";
import utilidades from "../common/utilidades/utilidades";
import { UpdatePasswordDto } from "../dtos/update-password.dto";
/*
export const newUser = async (req: Request, res: Response) => {

    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    
}

export const login = (req: Request, res: Response) => {

    const { body } =req;

    res.json({
        message: 'Login User',
        body
    })

}
*/ 
export class UsersController {

    async login(req: Request, res: Response):Promise<Response> {
        let {accountName, contraseña} = req.body;

        accountName = utilidades.formateoDePalabras(accountName);

        //Validar si el usuario existe en la base de datos
        const user = await User.findOne({ where: { accountName: accountName } }).then(data => data?.toJSON());

        if(!user){
            return res.status(400).json({
                message: `No existe un usuario con el nombre ${accountName} en la base de datos`
            })
        }
        
        //Validar contraseña
        const contraseñaValidad = await bcrypt.compare(contraseña, user.contraseña);

        if(!contraseñaValidad) {
            return res.status(400).json({
                message:'Password Incorrecto'
            })
        }
        
        //Generar Token
        const token = jwt.sign({
            accountName: accountName,
            rol: await rolService.getUserRol(accountName)
        }, process.env.SECRET_KEY || 'Erlin99', {
            expiresIn: '10min'
        });
        
        return res.json({
            code: 200,
            message: 'Inicio de sesion exitoso!',
            token
        });
        
    }

    async cambiarContraseña (req: Request, res: Response) {

        const payload = req.body;

        // console.log(payload.accountName);

        // const hashedPassword = await bcrypt.hash(contraseña, 10);
        // console.log(hashedPassword);

        let updatePasswordDto = plainToClass(UpdatePasswordDto, payload);

        const errors = await validate(updatePasswordDto);

        if(errors.length > 0) {
            console.log(errors);

            return  res.status(400).json({
                        "Validation-errors" : errors
                    });

        }

        updatePasswordDto.accountName = utilidades.formateoDePalabras(updatePasswordDto.accountName);

        if(updatePasswordDto.contraseña === updatePasswordDto.nuevaContraseña){
            return  res.status(400).json({
                        message: `Las contraseñas coinciden`
                    });
        }

        const user = await User.findOne({ where: { accountName: updatePasswordDto.accountName } }).then(data => data?.toJSON());

        if(!user){
            return res.status(400).json({
                message: `No existe un usuario con el nombre ${updatePasswordDto.accountName} en la base de datos`
            })
        }
        
        const contraseñaValidad = await bcrypt.compare(updatePasswordDto.contraseña, user.contraseña);

        if(!contraseñaValidad) {
            return res.status(400).json({
                message:'Password Incorrecto'
            })
        }

        const responseDto = await userService.updatePassword(updatePasswordDto);
        
        return res.status(responseDto.code).json(responseDto);

    }

    async getUserList( req: Request, res: Response): Promise<Response> { 
        const responseDto = await userService.getUserList();
        return res.status(responseDto.code).json(responseDto);
    }

    async getOneUser( req: Request, res: Response ): Promise<Response> {
        const { id } = req.params;
        const user = await userService.getOneUser(+id);
        return res.json(user);
    }

    async createUser( req: Request, res: Response): Promise<Response> {

        const payload = req.body;

        // console.log(payload.accountName);

        // const hashedPassword = await bcrypt.hash(contraseña, 10);
        // console.log(hashedPassword);

        let createUserDto = plainToClass(CreateUserDto, payload);

        const errors = await validate(createUserDto);

        if(errors.length > 0) {
            console.log(errors);

            return  res.status(400).json({
                        "Validation-errors" : errors
                    });

        }

        createUserDto.accountName = utilidades.formateoDePalabras(createUserDto.accountName);

        //Validar si el usuario existe en la base de datos
        const user = await User.findOne( {where: { accountName: createUserDto.accountName }} );

        if(user){
            return  res.status(400).json({
                        message: `El usuario ${createUserDto.accountName} ya existe`
                    });
        }        
        
        //Validar si el usuario existe en la base de datos
        const correo = await User.findOne( {where: { correo: createUserDto.correo }} );

        if(correo){
            return  res.status(400).json({
                    message: `El correo ${createUserDto.correo} ya existe`
                })
        }      
        
        if(createUserDto.contraseña !== createUserDto.repetirContraseña){
            return  res.status(400).json({
                        message: `Las contraseñas no coinciden`
                    });
        } 

        const responseDto = await userService.createUser(createUserDto);

        
        /*
        let info = {
            mensaje: '',
            paginas: []
        };
        let rol = 1;

            // suponiendo que el rolId '1' sea igual critico
        if (rol === 1) {

            info = {
                mensaje: 'Usted tiene acceso a las siguientes paginas.',
                paginas: [
                    'Ver todas las peliculas',
                    'Tiene acceso a comentar',
                    'Tiene acceso a ver todos su comentarios',
                    'Tiene acceso a eliminar sus comentarios'
                ]
            }

        }

        const response = {
            responseDto,
            info
        }

        return (info.mensaje === '') 
            ?   res.status(responseDto.code).json(
                    responseDto,  
                );
            :   res.status(responseDto.code).json(
                    response
                );
        */

        // const existeUsuario = await userService.buscarPorEmail(createUserDto.correo);
        // console.log(existeUsuario);

        return res.status(responseDto.code).json(responseDto);

    }

    async update( req: Request, res: Response): Promise<Response> { 
        const { id } = req.params;
        const payload = req.body;

        let updateUserDto = plainToClass(UpdateUserDto, payload)
        const errors = await validate(updateUserDto);

        if(errors.length > 0) {
            console.log(errors);

            return res.status(400).json({
                "Validation-errors" : errors
            });

        }

        let user =  await userService.updateUser(payload, +id);

        console.log(user)

        return res.json(user);
    }

    async delete( req: Request, res: Response): Promise<Response> { 
        const { id } = req.params;

        await userService.deleteUser(+id)

        return res.status(200).json();
    }

}

export default new UsersController();