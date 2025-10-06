import { Role } from './entity/roles.entity';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRolDto, UpdateRolDto } from './dto/roles.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async findAll() {
    try {
      return await this.rolesRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los roles');
    }
  }

  async findOne(id: number) {
    const rol = await this.rolesRepository.findOne({ where: { id_rol: id } });
    if (!rol) throw new NotFoundException(`No se encontró el rol con ID ${id}`);
    return rol;
  }

  async create(data: CreateRolDto) {
    try {
      const nuevo = this.rolesRepository.create(data);
      return await this.rolesRepository.save(nuevo);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Ya existe un rol con esa descripción');
      }
      throw new InternalServerErrorException('Error al crear el rol');
    }
  }

  async update(id: number, data: UpdateRolDto) {
    const rol = await this.findOne(id); // ✅ Verifica existencia
    try {
      Object.assign(rol, data);
      return await this.rolesRepository.save(rol);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el rol');
    }
  }

  async remove(id: number) {
    const rol = await this.findOne(id); // ✅ Verifica existencia
    try {
      await this.rolesRepository.remove(rol);
      return { message: `Rol con ID ${id} eliminado correctamente` };
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el rol');
    }
  }
}
