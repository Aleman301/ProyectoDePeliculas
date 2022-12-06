import { ResponseDto } from '../common/dto/response.dto'
import { Request, Response } from 'express';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../models/usuarios';
import { UpdateUserDto } from '../dtos/update-user.dto';
import bcrypt from 'bcrypt';
import rolService from './rol.service';
import { UpdatePasswordDto } from '../dtos/update-password.dto';

class UserService{

    private responseDto: ResponseDto;

    public async login(){
        
        this.responseDto = new ResponseDto();
        try {

            this.responseDto.data = await User.findAll({});
            this.responseDto.code = 200;
            this.responseDto.message = 'Usuario encontrado exitosamente';

            return this.responseDto;

        } catch (error) {

            this.responseDto.code = 500;
            this.responseDto.message = 'Usuario no registra';

            console.log({error});

            return this.responseDto;

        }

    }

    public async getUserList() {
        
        this.responseDto = new ResponseDto();
        try {
            this.responseDto.code = 200;
            this.responseDto.message = 'Este es el listado de Usuario'
            this.responseDto.data = await User.findAll({});
            return this.responseDto;
        } catch (error) {
            this.responseDto.code = 500;
            this.responseDto.message = 'Error Interno, porfavor revisar los logs';
            console.log({error});
            return this.responseDto;
        }
        
    }

    public async getOneUser( id: number ){
        const user = await User.findOne({ where : {id} })
        return user;
    }

    public async getOneAccountName (accountName: string) {
        const user = await User.findOne({ where : { accountName } });
        return user;
    }

    public async createUser ( createUserDto : CreateUserDto ) {

        this.responseDto = new ResponseDto();

        try {
            
            createUserDto.contraseña = await bcrypt.hash(createUserDto.contraseña, 10);
            
            this.responseDto.code = 201;
            this.responseDto.message = 'Usuario creado satisfactoriamente';
            this.responseDto.data = await User.create({
                ...createUserDto
            });

            return this.responseDto;
        
        } catch (error) {

            if(error.parent.code == "23505"){
                
                this.responseDto.code = 400;
                this.responseDto.message = 'Error al registrar el usuario, no se puede ingresar una usuario nuevamente';
                
                return this.responseDto;
            
            }

            this.responseDto.code = 500;
            this.responseDto.message = 'Error al registrar Usuario';

            if (!(await rolService.getOneRol(+createUserDto.rolId))) {
                this.responseDto.message = 'El rol que esta tratando de ingresar no existe!';
            }
            
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

        const updatepUser = await User.update(updateUser, {where : {id}});

        return this.getOneUser(id)

    }

    public async updatePassword (updatePassword: UpdatePasswordDto) {

        const nuevaContraseña = await bcrypt.hash(updatePassword.nuevaContraseña, 10);

        const updateUser = await User.update({ contraseña: nuevaContraseña }, { where : { accountName: updatePassword.accountName }});

        return {
            code: 200,
            user: await this.getOneAccountName(updatePassword.accountName)
        };     
        
    }

    public async deleteUser ( id : number ) {
        
        const user = await this.getOneUser(id);

        if(!user){
            return null;
        }

        const deletedUser = await User.destroy({ where: {id} });

        return true;

    }

    public buscarPorAccountName = async (accountName: string) => {

        const user = await User.findOne({ where: { accountName } });

        if (!user) return null;
        
        return user.dataValues.id;

    };

}

    

export default new UserService();