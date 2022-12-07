import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateRolDto } from "./create-rol.dto";


export class UpdateRolDto {
    @IsNotEmpty()
    @IsNumber()
    public rolId: number;
    
}