import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateGeneroDto {

    @Length(3, 50)
    @IsString()
    @IsNotEmpty()
    public nombre: string;

}