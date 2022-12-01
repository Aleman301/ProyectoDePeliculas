import { Request, Response, Router } from "express"
import bcryp from 'bcrypt';
//import { User } from "../models/user";
import { validate } from "class-validator";
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from "../dtos/create-user.dto";
import userService from "../services/user.service";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { User } from "../models/user";
import jwt from 'jsonwebtoken';
/*
export const newUser = async (req: Request, res: Response) => {

    const { username, password } = req.body;

    const hashedPassword = await bcryp.hash(password, 10);
    
    

}

export const login = (req: Request, res: Response) => {

    const { body } =req;

    res.json({
        msg: 'Login User',
        body
    })

}
*/ 
export class UsersController {

    router = Router();

    constructor(){
        this.initRoutes();

    }

    initRoutes(){
        this.router.post('/user', this.createUser)
        this.router.get('/user', this.getUserList);
        this.router.get('/user/:id', this.getOneUser);
        this.router.post('/userRegistrer', this.createUser);
        this.router.patch('/user/:id', this.update);
        this.router.delete('/user/:id', this.delete)
        this.router.post('/user/login', this.login)
    }

    async login(req: Request, res: Response):Promise<Response> {
        const {accountName, contraseña} = req.body;

        //Validar si el usuario existe en la base de datos
        const user = await User.findOne({ where: { accountName: accountName } })

        if(!user){
            return res.status(400).json({
                msg: `No existe un usuario con el nombre ${accountName} en la base de datos`
            })
        }
        
        //Validar contraseña
        
        const contraseñaValidad = await bcryp.compare(contraseña, user.contraseña)

        if(!contraseñaValidad) {
            return res.status(400).json({
                msg:'Password Incorrecto'
            })
        }
        
        //Generar Token
        const token = jwt.sign({
            accountName: accountName
        }, process.env.SECRET_KEY || 'Erlin99', {
            expiresIn: '100000'
        });
        
        
        return res.json(token);
        
        //const responseDto = await userService.login();

        //return res.status(responseDto.code).json(responseDto)

       
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

        const { nombre, apellido, accountName, correo, telefono, contraseña, repetirContraseña } = req.body;

        //Validar si el usuario existe en la base de datos
        const user = await User.findOne( {where: { accountName: accountName }} )

        if(user){
            return  res.status(400).json({
                    msg: `El usuario ${accountName} ya existe`
                })
        }

        const hashedPassword = await bcryp.hash(contraseña, 10);
        console.log(hashedPassword);

        try {
            //Guarda usuario en la base de datos
            await   User.create({
                nombre: nombre, 
                apellido: apellido, 
                accountName: accountName, 
                correo: correo, 
                telefono: telefono ,
                contraseña: hashedPassword, 
                repetirContraseña: repetirContraseña
        })

        res.json({
            msg: `Usuario ${accountName} creado exitosamente`
        })
        } catch (error) {
            res.status(400).json({
                msg:'Ocurrio un error',
                error
            })
        }

        

        let createUserDto = plainToClass(CreateUserDto, { nombre, apellido, accountName, correo, telefono, contraseña, repetirContraseña });

        const errors = await validate(createUserDto);

        if(errors.length > 0) {
            console.log(errors);

            return res.status(400).json({
                "Validation-errors" : errors
            })

        }
        
        const responseDto = await userService.createUser(createUserDto);

        return res.status(responseDto.code).json(
            responseDto
        )

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

        return res.json(user) ;
    }

    async delete( req: Request, res: Response): Promise<Response> { 
        const { id } = req.params;

        await userService.deleteUser(+id)

        return res.status(200).json();
    }

}