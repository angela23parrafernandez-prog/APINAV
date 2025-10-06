import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grado } from './entity/grados.entity';
import { CreateGradoDto, UpdateGradoDto } from './dto/grados.dto';

@Injectable()
export class GradosService {
  constructor(
    @InjectRepository(Grado)
    private readonly gradosRepository: Repository<Grado>,
  ) {}

  /** Obtener todos los grados */
  async findAll() {
    try {
      return await this.gradosRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los grados');
    }
  }

  /** Obtener un grado por su ID */
  async findOne(id: number) {
    const grado = await this.gradosRepository.findOne({
      where: { id_grado: id },
    });
    if (!grado) {
      throw new NotFoundException(`No se encontró el grado con ID ${id}`);
    }
    return grado;
  }

  /** Crear un nuevo grado */
  async create(data: CreateGradoDto) {
    try {
      const nuevo = this.gradosRepository.create(data);
      return await this.gradosRepository.save(nuevo);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Ya existe un grado con esa descripción');
      }
      throw new InternalServerErrorException('Error al crear el grado');
    }
  }

  /** Actualizar un grado existente */
  async update(id: number, data: UpdateGradoDto) {
    const grado = await this.findOne(id); // verifica existencia
    try {
      Object.assign(grado, data);
      return await this.gradosRepository.save(grado);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el grado');
    }
  }

  /** Eliminar un grado */
  async remove(id: number) {
    const grado = await this.findOne(id); // verifica existencia
    try {
      await this.gradosRepository.remove(grado);
      return { message: `Grado con ID ${id} eliminado correctamente` };
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el grado');
    }
  }
}
