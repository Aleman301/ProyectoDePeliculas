import { Router } from 'express'
import generoController from '../controllers/genero.controller';
import moviesController from '../controllers/movies.controller';
import validateToken from "./validate-token";

class GenerosRoutes {
    
    router = Router();

    constructor(){
        this.initRoutes();
    }

    initRoutes(){
        this.router.get('/generos', generoController.getList);
        this.router.get('/generos/:id', generoController.getOne);
        this.router.post('/generos', validateToken, generoController.create);
        this.router.patch('/generos/:id', validateToken, generoController.update);
        this.router.delete('/generos/:id', validateToken, generoController.delete);
    }
}

export default new GenerosRoutes();