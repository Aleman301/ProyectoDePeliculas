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
    acountname:string;

    @Length(0, 100,{
        message: "El correo debe tener entre 5 y 20 caracteres"
    })
    correo: string;
    
    @Length(1,8)
    telefono:number;

    @Length(3, 25,{
        message: "La contraseña debe tener entre 3 y 20 caracteres"
    })
    contraseña: string;

    @Length(3, 25)
    repetirContraseña: string;

}