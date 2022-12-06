import { Request, Response, Router } from "express"
import bcrypt from 'bcrypt';
//import { User } from "../models/user";
import moviesService from "../services/movies.service";
import { CreateMovieDto } from "../dtos/create-movies.dto";
import { validate } from "class-validator";
import { plainToClass } from 'class-transformer';
import { UpdateMovieDto } from "../dtos/update-movie.dto";
import { CreateValoracionComentarioDto } from "../dtos/create-valoracion_comentario.dto";
import { ResponseDto } from "../common/dto/response.dto";
import { decodeToken } from "../routers/validate-token";
import generosService from "../services/generos.service";
import utilidades from "../common/utilidades/utilidades";
import { PeliculaGenero } from "../models/peliculas_generos";
import { ValoracionComentario } from "../models/valoraciones_comentarios";
import { CreateGeneroDto } from "../dtos/create-genero.dto";

export class GeneroController {

    async getList( req: Request, res: Response): Promise<Response> { 
        const responseDto = await generosService.getList();
        return res.status(responseDto.code).json(responseDto);
    }

    async getOne( req: Request, res: Response ): Promise<Response> {
        const { id } = req.params;
        const genero = await generosService.getOne(+id);

        if (!genero) {

            const response = {
                code: 404,
                message: `No existe ningun genero con el id: ${id}`
            }

            return res.status(response.code).json(response)
        }

        return res.status(200).json({ code: 200, genero });
    }

    async create( req: Request, res: Response): Promise<Response> { 

        if (decodeToken.rol !== 'admin') {
            
            const response: ResponseDto = {
                code: 401,
                message: 'No tiene permiso para agregar un genero'
            }

            return res.status(response.code).send(response);

        }

        const payload = req.body;

        let creteGeneroDto = plainToClass(CreateGeneroDto, payload);

        const errors = await validate(creteGeneroDto);

        if(errors.length > 0) {
            
            console.log(errors);

            return res.status(400).json({
                "Validation-errors" : errors
            });

        }

        const responseDto = await generosService.createGenero(creteGeneroDto);

        if (responseDto.code === 400 || responseDto.code === 500) {

            return  res.status(responseDto.code).json(
                        responseDto
                    );

        }

        return  res.status(200).json(
                    responseDto
                );
                
    }            

    async update( req: Request, res: Response): Promise<Response> { 
        
        if (decodeToken.rol !== 'admin') {
            
            const response: ResponseDto = {
                code: 401,
                message: 'No tiene permiso para agregar un genero'
            }

            return res.status(response.code).send(response);

        }
        
        const { id } = req.params;
        const payload = req.body;

        let updateGeneroDto = plainToClass(CreateGeneroDto, payload);
        const errors = await validate(updateGeneroDto);

        if(errors.length > 0) {
            console.log(errors);

            return res.status(400).json({
                "Validation-errors" : errors
            });

        }

        let genero =  await generosService.updateGenero(+id, updateGeneroDto);

        return res.status(genero.code).json(genero);

    }

    async delete( req: Request, res: Response): Promise<Response> { 
        
        if (decodeToken.rol !== 'admin') {
            
            const response: ResponseDto = {
                code: 401,
                message: 'No tiene permiso para eliminar un genero'
            }

            return res.status(response.code).send(response);

        }

        const { id } = req.params;

        const deleteGenero = await generosService.deleteGenero(+id);

        return res.status(deleteGenero.code).json(deleteGenero);
    }      

}

export default new GeneroController();
