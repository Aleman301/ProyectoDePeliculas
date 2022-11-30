import { Length, IsNotEmpty, IsOptional } from "class-validator";


export class CreateMovieDto {
    @Length(3,50, {
        message: "El nombre debe tener entre 3 y 50 caracteres"
    })
    @IsNotEmpty()
    movieName: string;

    @Length(0, 250)
    @IsOptional()
    añoDeLanzamiento: string;

    @Length(0, 250)
    @IsOptional()
    valoraciones: string;

    @Length(0, 250)
    @IsOptional()
    precio: string

    @Length(0, 250)
    @IsOptional()
    disponibilidad: string

}