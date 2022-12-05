import { Length, IsNotEmpty, IsOptional, IsEmail, IsNumber } from "class-validator";
import { Is } from "sequelize-typescript";

export class CreateUserDto {
    @Length(3,20, {
        message: "El nombre debe tener entre 3 y 20 caracteres"
    })
    @IsNotEmpty()
    nombre: string;

    @Length(3, 20,{
        message: "El apellido debe tener entre 3 y 20 caracteres"
    })
    @IsNotEmpty()    
    apellido: string;

    @Length(3,50,{
        message: "El Nombre de Usuario debe tener entre 3 y 50 caracteres"
    })
    @IsNotEmpty()
    accountName:string;

    @Length(0, 100,{
        message: "El correo debe tener entre 5 y 20 caracteres"
    })
    @IsNotEmpty()
    @IsEmail() 
    correo: string;
    
    @Length(8,8)
    @IsNotEmpty()    
    telefono:number;

    @Length(0, 250,{
        message: "La contraseña debe tener entre 3 y 20 caracteres"
    })
    @IsNotEmpty()    
    contraseña: string;

    @Length(3, 250)
    @IsNotEmpty()    
    repetirContraseña: string;

    @IsNumber()
    @IsNotEmpty()    
    rolId: string;

}