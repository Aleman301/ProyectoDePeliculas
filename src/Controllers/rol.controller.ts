import rolService from "../services/rol.service";
import { Request, Response, Router } from "express"
import { validate } from "class-validator";
import { plainToClass } from 'class-transformer';
import 'dotenv/config';
import { CreateRolDto } from "../dtos/create-rol.dto";
import { UpdateRolDto } from "../dtos/update-rol.dto";

export class RolController {

    async getRolUser( req: Request, res: Response): Promise<Response> {
        const responseDto = await rolService.getRolList();
        return res.status(responseDto.code).json(responseDto);
    }

    async getOneRol( req: Request, res: Response ): Promise<Response> {
        const { id } = req.params;
        const rol = await rolService.getOneRol(+id);
        return res.json(rol);
    }

    async createRol( req: Request, res: Response ): Promise<Response> {                            
        const payload = req.body;

        let createRolDto = plainToClass(CreateRolDto, payload);

        const errors = await validate(createRolDto);

        if(errors.length > 0){
            
            console.log(errors);
        
            return  res.status(400).json({
                        "Validation-errors" : errors
                    });
        }

        const responseDto = await rolService.createRol(createRolDto);

        return res.status(responseDto.code).json(responseDto);

    }

    async update( req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const payload = req.body

        let updateRolDto = plainToClass(UpdateRolDto, payload)
        const errors = await validate(updateRolDto);

        if(errors.length > 0) {
            console.log(errors);

            return res.status(400).json({
                "Validation-errors" : errors
            })
        }

        let rol = await rolService.updateRol(payload, +id);

        console.log(rol)
        return res.json(rol);

    }

    async deleteRol( req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        await rolService.deleteRol(+id);

        return res.status(200).json();
    }

}

export default new RolController();