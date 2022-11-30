import { Request, Response, Router } from "express"
import bcryp from 'bcrypt';
//import { User } from "../models/user";
import moviesService from "../services/movies.service";
import { CreateMovieDto } from "../dtos/create-movies.dto";
import { validate } from "class-validator";
import { plainToClass } from 'class-transformer';
import { UpdateMovieDto } from "../dtos/update-movie.dto";
import { Movie } from "../models/movies";
import { where } from "sequelize";


export class MoviesController {

     router = Router();

     constructor(){
        this.initRoutes();
     }

     initRoutes(){
        this.router.get('/movies', this.getList);
        this.router.get('/movies/:id', this.getOne);
        this.router.post('/movies', this.create);
        this.router.patch('/movies/:id', this.update);
        this.router.delete('/movies/:id', this.delete)
     }

     async getList( req: Request, res: Response): Promise<Response> { 
        const responseDto = await moviesService.getList();
        return res.status(responseDto.code).json(responseDto);
    }

    async getOne( req: Request, res: Response ): Promise<Response> {
        const { id } = req.params;
        const movie = await moviesService.getOne(+id);
        return res.json(movie);
    }

    async create( req: Request, res: Response): Promise<Response> { 

        const payload = req.body;

        let createMovieDto = plainToClass(CreateMovieDto, payload);

        const errors = await validate(createMovieDto);

        if(errors.length > 0) {
            console.log(errors);

            return res.status(400).json({
                "Validation-errors" : errors
            });

        }

        const responseDto = await moviesService.create(createMovieDto);

        return res.status(responseDto.code).json(
            responseDto
        ) ;
    }            

    async update( req: Request, res: Response): Promise<Response> { 
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

        return res.json(category) ;
    }

    async delete( req: Request, res: Response): Promise<Response> { 
        const { id } = req.params;

        await moviesService.delete(+id)

        return res.status(200).json();
    }

}
































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
