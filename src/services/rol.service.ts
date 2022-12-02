import { ResponseDto } from "../common/dto/response.dto";
import { CreateRolDto } from "../dtos/create-rol.dto";
import { UpdateRolDto } from "../dtos/update-rol.dto";
import { Rol } from "../models/roles";
import { User } from "../models/user";


class rolService{

    private responseDto: ResponseDto;

    public async getRolList() {

        this.responseDto = new ResponseDto();
        try {
            this.responseDto.data = await Rol.findAll({});
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

    public async getOneRol( id:number ) {
        const rol = await Rol.findOne({ where : {id} })
        return rol;
    }

    public async createRol ( createRolDto : CreateRolDto ) {

        this.responseDto = new ResponseDto();

        try {
            this.responseDto.data = await Rol.create(createRolDto)
            this.responseDto.code = 201;
            this.responseDto.message = 'Rol creado satisfactoriamente';
            return this.responseDto;
        } catch (error) {

            if(error.parent.code == "23505"){
                this.responseDto.code = 400;
                this.responseDto.message = 'Error al registrar';
                return this.responseDto;
            }

            this.responseDto.code = 500;
            this.responseDto.message = 'Error al registrar Rol';
            
            return this.responseDto;
        }

    }

    public async updateRol( UpdateRolDto : UpdateRolDto, id: number) {
        const rol = await this.getOneRol(id);

        if(!rol){
            return null;
        }

        const updateRol = {
            id,
            ...UpdateRolDto
        }

        const updatepRol = await Rol.update(updateRol, {where:{id}});

        return this.getOneRol(id);

    }

    public async deleteRol (id : number) {
        const rol = await this.getOneRol(id);

        if(!rol){
            return null;
        }

        const deletedRol = await Rol.destroy({where: {id}});

        return true;

    }


}

export default new rolService();