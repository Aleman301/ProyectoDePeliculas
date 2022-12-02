
import { Router } from 'express'
import moviesController from '../Controllers/movies.controller';
import validateToken from "../routers/validate-token";

class MoviesRoutes {
    
    router = Router();

    constructor(){
        this.initRoutes();
    }

    initRoutes(){
        this.router.get('/movies', validateToken, moviesController.getList);
        this.router.get('/movies/:id', moviesController.getOne);
        this.router.post('/movies', moviesController.create);
        this.router.patch('/movies/:id', moviesController.update);
        this.router.delete('/movies/:id', moviesController.delete)

        this.router.post('/movies/valoracion', validateToken, moviesController.valoracion);

    }
}

export default new MoviesRoutes();
