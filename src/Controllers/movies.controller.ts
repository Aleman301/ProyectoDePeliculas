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
import { Pelicula } from '../models/peliculas';

export class MoviesController {

    async getList( req: Request, res: Response): Promise<Response> { 
        const responseDto = await moviesService.getList();
        return res.status(responseDto.code).json(responseDto);
    }

    async getOne( req: Request, res: Response ): Promise<Response> {
        const { id } = req.params;
        const movie = await moviesService.getOne(+id);
        return res.json(movie);
    }

    async getPeliculasPorGenero ( req: Request, res: Response): Promise<Response> { 

        let { nombre } = req.body;

        if (nombre === undefined) {

            const response = {
                code: 400,
                message: `Nombre vacio, es necesario que ingrese un nombre`
            }

            return res.status(response.code).json(response);
        }

        nombre = utilidades.formateoDePalabras(nombre);

        if (!(await generosService.buscarGeneroPorNombre(nombre))) { 
            
            const response = { 
                code: 400, 
                message: 'Ya existe un genero con ese nombre' 
            }
    
            return res.status(response.code).json(response);

        }

        const peliculas = await moviesService.getPeliculasPorGenero(nombre);

        if (peliculas === null) {

            const response = {
                code: 500,
                message: `No hay peliculas ingresadas`
            }

            return res.status(response.code).json(response);

        }

        const response = {
            code: 200,
            peliculas
        }

        return res.status(response.code).json(response);
    }


    async create( req: Request, res: Response): Promise<Response> { 

        if (decodeToken.rol !== 'admin') {
            
            const response: ResponseDto = {
                code: 401,
                message: 'No tiene permiso de crear una pelicula'
            }

            return res.status(response.code).send(response);

        }

        const payload = req.body;

        let createMovieDto = plainToClass(CreateMovieDto, payload);

        const errors = await validate(createMovieDto);

        if(errors.length > 0) {
            
            console.log(errors);

            return res.status(400).json({
                "Validation-errors" : errors
            });

        }

        if (createMovieDto.generos.length === 0) {
            
            return res.status(400).json({
                code: 400,
                message: 'Es necesario que ingrese generos.',
                generos_disponibles: await generosService.getGenerosList()
            });

        }

        // para verificar antes de guardar y retornar solo los generos que si existen
        let generosExistentes = [];

        for (const genero of payload.generos) {

            const nombreFormateado = utilidades.formateoDePalabras(genero);

            const existeGenero = await generosService.buscarGeneroPorNombre(nombreFormateado);

            if (!existeGenero) {

                return  res.status(400).json({
                            code: 400,
                            message: `El genero '${genero}' no existe, solo existen los siguientes generos...`,
                            generos_disponibles: await generosService.getGenerosList()
                        });

            }

            generosExistentes.push(existeGenero);

        }

        const responseDto = await moviesService.create(createMovieDto);

        if (responseDto.code === 400 || responseDto.code === 500) {

            return  res.status(responseDto.code).json(
                        responseDto
                    );

        }

        const pelicula = JSON.parse(JSON.stringify(responseDto.data));

        // para guardar en la tabla peliculas_generos despues de crear la pelicula.
        generosExistentes.map(async (genero) => {
            await PeliculaGenero.create({
                peliculaId: pelicula.id,
                generoId: genero.id
            });
        });

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

        let updateCategoryDto = plainToClass(UpdateMovieDto, payload)
        const errors = await validate(updateCategoryDto);

        if(errors.length > 0) {
            console.log(errors);

            return res.status(400).json({
                "Validation-errors" : errors
            });

        }

        let category =  await moviesService.update(payload, +id);

        console.log(category)

        return res.json(category);

    }

    async delete( req: Request, res: Response): Promise<Response> { 
        
        if (decodeToken.rol !== 'admin') {
            
            const response: ResponseDto = {
                code: 401,
                message: 'No tiene permiso para agregar un genero'
            }

            return res.status(response.code).send(response);

        }

        const { id } = req.params;

        await moviesService.delete(+id)

        return res.status(200).json();
    }      
    
    public async createValoracionComentario (req: Request, res: Response) {
        
        if (decodeToken.rol !== 'critico') {
            
            const response: ResponseDto = {
                code: 401,
                message: 'No tiene permiso de crear una valoracion'
            }

            return res.status(response.code).send(response);

        }

        const payload = req.body;

        let createValoracionComentarioDto = plainToClass(CreateValoracionComentarioDto, payload);
        const valoracionValidada = await moviesService.validarValoracion(createValoracionComentarioDto);
        
        if (valoracionValidada.code !== 201) {
                    
            return res.status(valoracionValidada.code).json(valoracionValidada);
        
        }

        await ValoracionComentario.create({ ...valoracionValidada.data });

        const valoraciones = await ValoracionComentario.findAll({ where: { peliculaId: valoracionValidada.data.peliculaId } });
        
        let totalValoraciones = valoraciones.length;
        let sumaValoraciones = 0;

        valoraciones.forEach((val) => {
            
            sumaValoraciones += val.dataValues.valoracion;
            
        });

        const promValoraciones = (sumaValoraciones/totalValoraciones).toString();

        await Pelicula.update({ valoraciones_promedio: promValoraciones.toString() }, { where: { id: valoracionValidada.data.peliculaId } });
        
        return res.status(valoracionValidada.code).json(
            valoracionValidada
        );
                
    }

}

export default new MoviesController();





























/**import { Router, Request, Response} from 'express';
import { Movie } from '../models/movies';
import moviesService from '../services/movies.service';
import { ResponseDto } from 'c:/Users/honda/OneDrive/Escritorio/Tarea 5 SJDL/sif-Examen/src/common/dto/response.dto'

export class MoviesController {

    router = Router();

    contructor(){
        this.initRoutes();
    }

    initRoutes(){
        this.router.get('/movies', this.getList)
    }

    async getList( req: Request, res: Response): Promise<Response> {
        const responseDto = await moviesService.getList();
        return res.status(responseDto.code).json(responseDto)
    }

}**/