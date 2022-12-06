import { ResponseDto } from "../common/dto/response.dto";
import utilidades from "../common/utilidades/utilidades";
import { CreateGeneroDto } from "../dtos/create-genero.dto";
import { Genero } from "../models/generos";

class GenerosServices {

    private generos = ["Comedia", "Drama", "Accion", "Ciencia ficcion", "Fantasia", "Musical",
    "Terror", "Suspenso", "Romance", "Melodrama", "Policiaco", "Belico", "Biografico",
    "Western", "Animacion", "Cine independiente", "Cine negro", "Serie B", "Road Movie",
    "Cine experimental", "Historico", "Cine de gangsters", "Cine infantil", "Documental"];

    private responseDto: ResponseDto;

    public async getGenerosList () {

        const generos = await Genero.findAll({ attributes: ['nombre'] });

        const listGeneros = generos.map(genero => {
            return genero.dataValues.nombre;
        });

        return listGeneros;

    } 

    public async getList () {

        const generos = await Genero.findAll();

        return {
            code: 200,
            message: 'Lista de generos',
            generos: generos
        };

    } 

    public async getOne (id: number) {

        const genero = await Genero.findByPk(id);

        return genero;

    }

    public async buscarGeneroPorNombre (nombre: string) {

        const genero = await Genero.findOne({ where: { nombre }, attributes: ['id', 'nombre'] }).then(data => data?.toJSON());

        return genero;

    } 

    public async createGenero (createGeneroDto: CreateGeneroDto) {

        this.responseDto = new ResponseDto();

        try {

            createGeneroDto.nombre = utilidades.formateoDePalabras(createGeneroDto.nombre);

            if (await this.buscarGeneroPorNombre(createGeneroDto.nombre)) return { code: 400, message: 'El genero ya existe' }
            
            this.responseDto.code = 201;
            this.responseDto.message = 'Genero creado satisfactoriamente';
            this.responseDto.data = await Genero.create({ ...createGeneroDto });

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

    public async updateGenero (id: number, updateGeneroDto: CreateGeneroDto) {

        this.responseDto = new ResponseDto();

        try {

            if (!(await this.getOne(id))) return { code: 400, message: `No existe ningun genero con el id: ${id}` }; 

            updateGeneroDto.nombre = utilidades.formateoDePalabras(updateGeneroDto.nombre);

            if (await this.buscarGeneroPorNombre(updateGeneroDto.nombre)) return { code: 400, message: 'Ya existe un genero con ese nombre' }
            
            this.responseDto.code = 201;
            this.responseDto.message = 'Genero actualizado satisfactoriamente';
            
            await Genero.update({ ...updateGeneroDto }, { where: { id } });

            this.responseDto.data = await this.getOne(id);

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

    public async deleteGenero (id: number) {

        const genero = await this.getOne(id);

        if (!genero) return { code: 400, message: `No existe ningun genero con el id: ${id}` }; 

        await Genero.destroy({ where: { id } });

        return {
            code: 200,
            message: `El genero ${genero.dataValues.nombre} eliminado satisfactoriamente`
        }

    }

    public async createdGeneros () {

        const generosCount = await Genero.findAndCountAll();

        if (generosCount.count === 0) {

            this.generos.map(async (genero) => {
                await Genero.create({
                    nombre: utilidades.formateoDePalabras(genero)
                });
            });

        }

    }

}

export default new GenerosServices();