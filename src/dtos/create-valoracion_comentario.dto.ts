
import { IsNumber, IsNotEmpty, Length, IsOptional, IsString } from 'class-validator';
import { Is } from 'sequelize-typescript';

export class CreateValoracionComentarioDto {

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    public accountName: number;

    @IsString()
    @IsNotEmpty()
    public nombre: string;

    @IsNumber()
    @IsNotEmpty()
    public valoracion: number;

    @IsString()
    @Length(10, 250)
    @IsNotEmpty()
    public comentario: string;

}
