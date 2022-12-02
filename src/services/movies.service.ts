import { ResponseDto } from '../common/dto/response.dto'
import { Request, Response } from 'express';
import { Movie } from '../models/movies';
import { CreateMovieDto } from '../dtos/create-movies.dto';
import { UpdateMovieDto } from '../dtos/update-movie.dto';
import { decodeToken } from '../routers/validate-token';
import { CreateValoracionDto } from '../dtos/create-valoracion.dto';
import { validate } from 'class-validator';
import userService from './user.service';

interface CrearValoracion {
    usuarioId: number,
    movieId: number,
    valoracion: number
}

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
            this.responseDto.message = 'Pelicula creada satisfactoriamente';
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
   
    public buscarPorMovieName = async (movieName: string) => {

        const movie = await Movie.findOne({ where: { movieName } });

        if (!movie) return null;
        
        return movie.dataValues.id;

    };

    public validarValoracion = async (valoracion: CreateValoracionDto): Promise<CrearValoracion | any> => {

        const errors = await validate(valoracion);

        if(errors.length > 0) {
            
            console.log(errors);

            return errors;

        }

        const { accountName } = decodeToken;

        const existeUsuario = await userService.buscarPorAccountName(accountName);
        // console.log(existeUsuario);

        if (!existeUsuario) return null;

        const existePelicula = await this.buscarPorMovieName(valoracion.movieName);
        
        if (!existePelicula) return { code: 404, mensaje: 'No existe la pelicula.' };

        return {
            usuarioId: existeUsuario,
            movieId: existePelicula,
            valoracion: valoracion.valoracion
        };

    };   

}

    

export default new MoviesService();