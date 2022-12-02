import express, { json }  from 'express';
import { MoviesController } from './Controllers/movies.controller';
import {UsersController} from './Controllers/user.controller';
import {conn} from './Database/connection';
import { Rol } from './models/roles';
import { User } from './models/user';
import { Valoracion } from './models/valoracion';
import moviesRoutes from './routers/movies.routes';
import router from './routers/movies.routes';
import userRoutes from './routers/user.routes';
import validateToken from './routers/validate-token';

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
        this.express.use('/api', moviesRoutes.router)
        this.express.use('/api', userRoutes.router)
        // this.express.use('api/user', router)
    }
    db(){
        conn
        .sync()
        .then(()=>{

            Rol.sync();
            User.sync();
            Valoracion.sync();
            
            console.log(`Database is Connected`);

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