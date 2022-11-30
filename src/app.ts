import express, { json }  from 'express';
import { MoviesController } from './Controllers/movies.controller';
import {UsersController} from './Controllers/user.controller';
import {conn} from './Database/connection';
import { Usuarioss } from './models/user';
import router from './routers/movies.routes';

class App{

    public express : express.Application;
    private port: string | 3001;
  

    moviesController: MoviesController;
    userscontroller: UsersController;


    constructor(){
        this.express = express();
        this.db();
        this.listen(3001);
        this.middlewares();
        this.controllers();
        this.db();
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
        this.express.use('/api', this.moviesController.router)
        this.express.use('/api', this.userscontroller.router)
        this.express.use('api/user', router)
    }
    db(){
        conn
        .sync()
        .then(()=>{
            Usuarioss.sync();
            console.log(`Database is Connected`)
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