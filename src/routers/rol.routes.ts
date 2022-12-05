
import { Router } from "express";
import rolController from "../controllers/rol.controller";
import validateToken from "./validate-token";

class RolesRoutes {
    
    router = Router();

    constructor(){
        this.initRoutes();

    }

    initRoutes(){
        this.router.get('/rol', validateToken, rolController.getRolUser);
        this.router.get('/rol/:id', validateToken, rolController.getOneRol);
        this.router.post('/rol', validateToken, rolController.createRol);
        this.router.patch('/rol/:id', validateToken, rolController.update);
        this.router.delete('/rol/:id', validateToken, rolController.deleteRol);
    }

} 

export default new RolesRoutes();
