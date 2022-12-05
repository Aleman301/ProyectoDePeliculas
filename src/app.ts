import express, { json }  from 'express';
import { MoviesController } from './controllers/movies.controller';
import {UsersController} from './controllers/user.controller';
import {conn} from './database/connection';
import { Comentario } from './models/comentarios';
import { Genero } from './models/generos';
import { Pelicula } from './models/peliculas';
import { PeliculaGenero } from './models/peliculas_generos';
import { Rol } from './models/roles';
import { User } from './models/usuarios';
import { ValoracionComentario } from './models/valoraciones_comentarios';
import moviesRoutes from './routers/movies.routes';
import router from './routers/movies.routes';
import rolRoutes from './routers/rol.routes';
import userRoutes from './routers/user.routes';
import validateToken from './routers/validate-token';
import generosService from './services/generos.service';
import rolService from './services/rol.service';

class App{

    public express : express.Application;  

    moviesController: MoviesController;
    userscontroller: UsersController;

    constructor(){
        this.express = express();
        this.db();
        this.middlewares();
        // this.controllers();
        this.routes();
    }
    controllers(){
        this.moviesController = new MoviesController();
        this.userscontroller=new UsersController();
    }

    middlewares(){
        this.express.use(json());
    }

    routes(){
        this.express.use('/api', moviesRoutes.router);
        this.express.use('/api', userRoutes.router);
        this.express.use('/api', rolRoutes.router)

        // this.express.use('api/user', router)
    }
    db(){
        conn
        .sync()
        .then(()=>{

            Rol.sync();
            User.sync();
            Genero.sync();
            Pelicula.sync();
            Comentario.sync();
            ValoracionComentario.sync();
            PeliculaGenero.sync();

            console.log(`Database is Connected`);

            rolService.createdRoles();
            generosService.createdGeneros();

        })
        .catch((err: any)=>{
            console.log(`Error`,err);
        });
    }

    listen(port: number){
        
        this.express.listen(port,()=> console.log(`Server run in: http://localhost:${port}`));

    }


}
export default new App();