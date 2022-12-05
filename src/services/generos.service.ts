
import utilidades from "../common/utilidades/utilidades";
import { Genero } from "../models/generos";

class GenerosServices {

    private generos = ["Comedia", "Drama", "Accion", "Ciencia ficcion", "Fantasia", "Musical",
    "Terror", "Suspenso", "Romance", "Melodrama", "Policiaco", "Belico", "Biografico",
    "Western", "Animacion", "Cine independiente", "Cine negro", "Serie B", "Road Movie",
    "Cine experimental", "Historico", "Cine de gangsters", "Cine infantil", "Documental"]

    public async getGenerosList () {

        const generos = await Genero.findAll({ attributes: ['nombre'] });

        const listGeneros = generos.map(genero => {
            return genero.dataValues.nombre;
        });

        return listGeneros;

    } 

    public async buscarGeneroPorNombre (nombre: string) {

        const genero = await Genero.findOne({ where: { nombre }, attributes: ['id', 'nombre'] }).then(data => data?.toJSON());

        return genero;

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
