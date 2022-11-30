import { ResponseDto } from '../common/dto/response.dto'
import { Request, Response } from 'express';
import { Movie } from '../models/movies';
import { CreateMovieDto } from '../dtos/create-movies.dto';
import { UpdateMovieDto } from '../dtos/update-movie.dto';

class MoviesService{

    private responseDto: ResponseDto;

    public async getList() {
        
        this.responseDto = new ResponseDto();
        try {
            this.responseDto.data = await Movie.findAll({});
            this.responseDto.code = 200;
            this.responseDto.message = 'Este es el listado de Peliculas'
            return this.responseDto;
        } catch (error) {
            this.responseDto.code = 500;
            this.responseDto.message = 'Error Interno, porfavor revisar los logs';
            console.log({error});
            return this.responseDto;
        }
        
    }

    public async getOne( id: number ){
        const category = await Movie.findOne({ where : {id} })
        return category;
    }

    public async create ( createMovieDto : CreateMovieDto ) {

        this.responseDto = new ResponseDto();

        try {
            this.responseDto.data = await Movie.create(createMovieDto)
            this.responseDto.code = 201;
            this.responseDto.message = 'Categoria creada satisfactoriamente';
            return this.responseDto;
        } catch (error) {

            if(error.parent.code == "23505"){
                this.responseDto.code = 400;
                this.responseDto.message = 'Error al registrar la pelicula, no se puede ingresar una pelicula nuevamente';
                return this.responseDto;
            }

            this.responseDto.code = 500;
            this.responseDto.message = 'Error al registrar la pelicula';
            
            return this.responseDto;
        }

    }


    public async update( UpdateMovieDto : UpdateMovieDto, id: number ) {

        const movie = await this.getOne(id);

        if(!movie){
            return null;
        }

        const updateMovie = {
            id,
            ...UpdateMovieDto
        }

        const updatepMovie = await Movie.update(updateMovie, {where : {id}});

        return this.getOne(id)

    }

    public async delete ( id : number ) {
        
        const movie = await this.getOne(id);

        if(!movie){
            return null;
        }

        const deletedMovie = await Movie.destroy({ where: {id} });

        return true;

    }

    

}

    

export default new MoviesService();