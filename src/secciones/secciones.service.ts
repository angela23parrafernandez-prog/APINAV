import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seccion } from './entity/secciones.entity';
import { CreateSeccionDto, UpdateSeccionDto } from './dto/secciones.dto';

@Injectable()
export class SeccionesService {
  constructor(
    @InjectRepository(Seccion)
    private readonly seccionesRepository: Repository<Seccion>,
  ) {}

  /** Obtener todas las secciones */
  async findAll() {
    try {
      return await this.seccionesRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las secciones');
    }
  }

  /** Obtener una sección por su ID */
  async findOne(id: number) {
    const seccion = await this.seccionesRepository.findOne({
      where: { id_seccion: id },
    });
    if (!seccion) {
      throw new NotFoundException(`No se encontró la sección con ID ${id}`);
    }
    return seccion;
  }

  /** Crear una nueva sección */
  async create(data: CreateSeccionDto) {
    try {
      const nueva = this.seccionesRepository.create(data);
      return await this.seccionesRepository.save(nueva);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(
          'Ya existe una sección con esa descripción',
        );
      }
      throw new InternalServerErrorException('Error al crear la sección');
    }
  }

  /** Actualizar una sección existente */
  async update(id: number, data: UpdateSeccionDto) {
    const seccion = await this.findOne(id); // Verifica existencia
    try {
      Object.assign(seccion, data);
      return await this.seccionesRepository.save(seccion);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar la sección');
    }
  }

  /** Eliminar una sección */
  async remove(id: number) {
    const seccion = await this.findOne(id); // Verifica existencia
    try {
      await this.seccionesRepository.remove(seccion);
      return { message: `Sección con ID ${id} eliminada correctamente` };
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la sección');
    }
  }
}
