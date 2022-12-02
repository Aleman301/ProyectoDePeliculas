
import { IsNumber, IsNotEmpty, Length, IsOptional, IsString } from 'class-validator';

export class CreateValoracionDto {

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    public accountName: number;

    @IsString()
    @IsNotEmpty()
    public movieName: string;

    @IsNumber()
    @IsNotEmpty()
    public valoracion: number;

}
