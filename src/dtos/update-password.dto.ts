import { Length, IsNotEmpty, IsOptional, IsEmail, IsNumber } from "class-validator";
import { Is } from "sequelize-typescript";

export class UpdatePasswordDto {

    @Length(3,50,{
        message: "El Nombre de Usuario debe tener entre 3 y 50 caracteres"
    })
    @IsNotEmpty()
    accountName:string;

    @Length(0, 250,{
        message: "La contraseña debe tener entre 3 y 20 caracteres"
    })
    @IsNotEmpty()    
    contraseña: string;

    @Length(3, 250)
    @IsNotEmpty()    
    nuevaContraseña: string;

}