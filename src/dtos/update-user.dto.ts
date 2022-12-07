import { CreateUserDto } from "./create-user.dto";
import { Length, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserDto {
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
    
    @Length(8,8)
    @IsNotEmpty()    
    telefono:number;

    @IsNumber()
    @IsNotEmpty()    
    rolId: string;  
}