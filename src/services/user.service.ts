import { ResponseDto } from '../common/dto/response.dto'
import { Request, Response } from 'express';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Usuarioss } from '../models/user';
import { UpdateUserDto } from '../dtos/update-user.dto';

class UserService{

    private responseDto: ResponseDto;

    public async getUserList() {
        
        this.responseDto = new ResponseDto();
        try {
            this.responseDto.data = await Usuarioss.findAll({});
            this.responseDto.code = 200;
            this.responseDto.message = 'Este es el listado de Usuario'
            return this.responseDto;
        } catch (error) {
            this.responseDto.code = 500;
            this.responseDto.message = 'Error Interno, porfavor revisar los logs';
            console.log({error});
            return this.responseDto;
        }
        
    }

    public async getOneUser( id: number ){
        const user = await Usuarioss.findOne({ where : {id} })
        return user;
    }

    public async createUser ( createUserDto : CreateUserDto ) {

        this.responseDto = new ResponseDto();

        try {
            this.responseDto.data = await Usuarioss.create(createUserDto)
            this.responseDto.code = 201;
            this.responseDto.message = 'Usuario creado satisfactoriamente';
            return this.responseDto;
        } catch (error) {

            if(error.parent.code == "23505"){
                this.responseDto.code = 400;
                this.responseDto.message = 'Error al registrar el usuario, no se puede ingresar una usuario nuevamente';
                return this.responseDto;
            }

            this.responseDto.code = 500;
            this.responseDto.message = 'Error al registrar Usuario';
            
            return this.responseDto;
        }

    }


     public async updateUser ( UpdateUserDto : UpdateUserDto, id: number ) {

        const user = await this.getOneUser(id);

        if(!user){
            return null;
        }

        const updateUser = {
            id,
            ...UpdateUserDto
        }

        const updatepUser = await Usuarioss.update(updateUser, {where : {id}});

        return this.getOneUser(id)

    }

    public async deleteUser ( id : number ) {
        
        const user = await this.getOneUser(id);

        if(!user){
            return null;
        }

        const deletedUser = await Usuarioss.destroy({ where: {id} });

        return true;

    }

  

}

    

export default new UserService();