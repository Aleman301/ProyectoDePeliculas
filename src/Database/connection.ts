import {Sequelize} from 'sequelize-typescript';

class Connection{

    public connection: Sequelize;

    constructor(){
        this.connection = new Sequelize({
            dialect: "postgres",
            host:"localhost",
            username: "postgres",
            password: "1234",
            database:"Peliculas",
            //port:5432,
            logging:false
        });
    }
}

export default Connection;