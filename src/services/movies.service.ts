import { ResponseDto } from '../common/dto/response.dto'
import { Pelicula } from '../models/peliculas';
import { CreateMovieDto } from '../dtos/create-movies.dto';
import { UpdateMovieDto } from '../dtos/update-movie.dto';
import { decodeToken } from '../routers/validate-token';
import { CreateValoracionComentarioDto } from '../dtos/create-valoracion_comentario.dto';
import { validate } from 'class-validator';
import userService from './user.service';
import utilidades from '../common/utilidades/utilidades';
import { Comentario } from '../models/comentarios';
import { Genero } from '../models/generos';
import { PeliculaGenero } from '../models/peliculas_generos';
import { ValoracionComentario } from '../models/valoraciones_comentarios';

interface CrearValoracion {
    usuarioId: number,
    movieId: number,
    valoracion: number
}

class PeliculasService{

    private responseDto: ResponseDto;

    public async getList() {
        
        this.responseDto = new ResponseDto();
        try {
            this.responseDto.code = 200;
            this.responseDto.message = 'Este es el listado de Peliculas'
            this.responseDto.data = await Pelicula.findAll({});
            return this.responseDto;
        } catch (error) {
            this.responseDto.code = 500;
            this.responseDto.message = 'Error Interno, porfavor revisar los logs';
            console.log({error});
            return this.responseDto;
        }
        
    }

    public async getOne( id: number ){
        const category = await Pelicula.findOne({ where : {id} });
        return category;
    }

    public async getPeliculasPorGenero (nombre: string) {

        const peliculas = await Genero.findAll({ where: { nombre }, include: [{ model: PeliculaGenero, include: [{ model: Pelicula }] }] });

        return peliculas;

    }

    public async create ( createMovieDto : CreateMovieDto ) {

        this.responseDto = new ResponseDto();

        try {

            createMovieDto.nombre = utilidades.formateoDePalabras(createMovieDto.nombre);
            
            this.responseDto.code = 201;
            this.responseDto.message = 'Pelicula creada satisfactoriamente';
            this.responseDto.data = await Pelicula.create(createMovieDto)

            return this.responseDto;
        
        } catch (error) {

            if(error.parent.code == "23505"){
                
                this.responseDto.code = 400;
                this.responseDto.message = 'Error al registrar la pelicula, ya existe una pelicula con ese nombre.';
                
                return this.responseDto;
            
            }

            this.responseDto.code = 500;
            this.responseDto.message = 'Error al registrar la pelicula';
            
            return this.responseDto;
        }

    }


    public async update( updateMovieDto : UpdateMovieDto, id: number ) {

        const movie = await this.getOne(id);

        if(!movie){
            return null;
        }

        const updatePelicula = {
            id,
            ...updateMovieDto
        }

        const updatepPelicula = await Pelicula.update(updatePelicula, {where : {id}});

        return this.getOne(id)

    }

    public async delete ( id : number ) {
        
        const movie = await this.getOne(id);

        if(!movie){
            return null;
        }

        const deletedPelicula = await Pelicula.destroy({ where: {id} });

        return true;

    }
   
    public buscarPorPeliculaName = async (nombre: string) => {

        const movie = await Pelicula.findOne({ where: { nombre } });

        if (!movie) return null;
        
        return movie.dataValues.id;

    };

    public validarValoracion = async (valoracion: CreateValoracionComentarioDto): Promise<CrearValoracion | any> => {

        const errors = await validate(valoracion);

        if(errors.length > 0) {
            
            return {
                code: 400,
                message: 'Errors',
                data: errors
            };

        }

        const { accountName } = decodeToken;

        const existeUsuario = await userService.buscarPorAccountName(accountName);
        // console.log(existeUsuario);

        if (!existeUsuario) return null;

        valoracion.nombre = utilidades.formateoDePalabras(valoracion.nombre);

        const existePelicula = await this.buscarPorPeliculaName(valoracion.nombre);
        
        if (!existePelicula) 
            return { code: 404, mensaje: 'No existe la pelicula.' };

        if (valoracion.valoracion > 5 || valoracion.valoracion <= 0) 
            return { code: 400, mensaje: 'Solo puede valorar entre 1 y 5, 1 lo minimo y 5 en lo maximo.' };

        const comentarioNuevo = await Comentario.create({ comentario: valoracion.comentario });

        return {
            code: 201,
            data: {
                usuarioId: existeUsuario,
                peliculaId: existePelicula,
                valoracion: valoracion.valoracion,
                comentarioId: comentarioNuevo.dataValues.id
            }
        };

    };   

}

export default new PeliculasService();