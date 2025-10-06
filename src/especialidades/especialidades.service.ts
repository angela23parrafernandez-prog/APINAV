import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Especialidad } from './entity/especialidades.entity';
import {
  CreateEspecialidadDto,
  UpdateEspecialidadDto,
} from './dto/especialidades.dto';

@Injectable()
export class EspecialidadesService {
  constructor(
    @InjectRepository(Especialidad)
    private readonly especialidadesRepository: Repository<Especialidad>,
  ) {}

  /** Obtener todas las especialidades */
  async findAll() {
    try {
      return await this.especialidadesRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener las especialidades',
      );
    }
  }

  /** Obtener una especialidad por ID */
  async findOne(id: number) {
    const especialidad = await this.especialidadesRepository.findOne({
      where: { id_especialidad: id },
    });
    if (!especialidad) {
      throw new NotFoundException(
        `No se encontró la especialidad con ID ${id}`,
      );
    }
    return especialidad;
  }

  /** Crear una nueva especialidad */
  async create(data: CreateEspecialidadDto) {
    try {
      const nueva = this.especialidadesRepository.create(data);
      return await this.especialidadesRepository.save(nueva);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(
          'Ya existe una especialidad con esa descripción',
        );
      }
      throw new InternalServerErrorException('Error al crear la especialidad');
    }
  }

  /** Actualizar una especialidad existente */
  async update(id: number, data: UpdateEspecialidadDto) {
    const especialidad = await this.findOne(id); // verifica existencia
    try {
      Object.assign(especialidad, data);
      return await this.especialidadesRepository.save(especialidad);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al actualizar la especialidad',
      );
    }
  }

  /** Eliminar una especialidad */
  async remove(id: number) {
    const especialidad = await this.findOne(id); // verifica existencia
    try {
      await this.especialidadesRepository.remove(especialidad);
      return { message: `Especialidad con ID ${id} eliminada correctamente` };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al eliminar la especialidad',
      );
    }
  }
}
