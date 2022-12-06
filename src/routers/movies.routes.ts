import { Router } from 'express'
import moviesController from '../controllers/movies.controller';
import validateToken from "../routers/validate-token";

class MoviesRoutes {
    
    router = Router();

    constructor(){
        this.initRoutes();
    }

    initRoutes(){
        this.router.get('/movies', validateToken, moviesController.getList);
        this.router.get('/movies/generos', validateToken, moviesController.getPeliculasPorGenero);
        this.router.get('/movies/:id', moviesController.getOne);
        this.router.post('/movies', validateToken, moviesController.create);
        this.router.patch('/movies/:id', moviesController.update);
        this.router.delete('/movies/:id', moviesController.delete)

        this.router.post('/movies/valoracion', validateToken, moviesController.createValoracionComentario);

    }
}

export default new MoviesRoutes();