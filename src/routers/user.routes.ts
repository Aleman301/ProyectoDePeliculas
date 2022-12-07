import { Router } from "express";
import usersController from "../controllers/user.controller";
import validateToken from "./validate-token";

class UsersRoutes {
    
    router = Router();

    constructor(){
        this.initRoutes();

    }

    initRoutes(){
        this.router.post('/user', usersController.createUser);
        this.router.get('/user', validateToken,usersController.getUserList);
        this.router.get('/user/:id', validateToken, usersController.getOneUser);
        this.router.post('/userRegister', usersController.createUser);
        this.router.patch('/user/:id', validateToken, usersController.update);
        this.router.delete('/user/:id', validateToken, usersController.delete);
        this.router.post('/user/login', usersController.login);

        this.router.post('/user/cambiarContra', usersController.cambiarContraseña);

    }

} 


export default new UsersRoutes();