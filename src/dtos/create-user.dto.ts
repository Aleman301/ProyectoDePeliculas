import { Length, IsNotEmpty, IsOptional, length } from "class-validator";


export class CreateUserDto {
    @Length(3,20, {
        message: "El nombre debe tener entre 3 y 20 caracteres"
    })
    @IsNotEmpty()
    nombre: string;

    @Length(3, 20,{
        message: "El apellido debe tener entre 3 y 20 caracteres"
    })
    apellido: string;

    @Length(3,50,{
        message: "El Nombre de Usuario debe tener entre 3 y 50 caracteres"
    })
    accountName:string;

    @Length(0, 100,{
        message: "El correo debe tener entre 5 y 20 caracteres"
    })
    correo: string;
    
    @Length(0,9)
    telefono:number;

    @Length(0, 250,{
        message: "La contraseña debe tener entre 3 y 20 caracteres"
    })
    contraseña: string;

    @Length(3, 250)
    repetirContraseña: string;

}