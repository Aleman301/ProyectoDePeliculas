import { Router } from "express";
import usersController from "../Controllers/user.controller";

class UsersRoutes {
    
    router = Router();

    constructor(){
        this.initRoutes();

    }

    initRoutes(){
        this.router.post('/user', usersController.createUser)
        this.router.get('/user', usersController.getUserList);
        this.router.get('/user/:id', usersController.getOneUser);
        this.router.post('/userRegister', usersController.createUser);
        this.router.patch('/user/:id', usersController.update);
        this.router.delete('/user/:id', usersController.delete)
        this.router.post('/user/login', usersController.login)
    }

} 


export default new UsersRoutes();