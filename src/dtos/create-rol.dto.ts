import { Length } from "class-validator";

export class CreateRolDto {
    @Length(3, 20, {
        message: "Debe ser de 3 o mas caracterers"
    })
    nombre: string;
}