import { Length, IsNotEmpty, IsOptional } from "class-validator";


export class CreateUserDto {
    @Length(3,20, {
        message: "El nombre debe tener entre 3 y 20 caracteres"
    })
    @IsNotEmpty()
    nombre: string;

    @Length(0, 250)
    apellido: string;

    @Length(0, 250)
    correo: string;
    
    @Length(0,8)
    telefono: number;

    @Length(0, 250)
    contraseña: string;

    @Length(0, 250)
    repetirContraseña: string;

}