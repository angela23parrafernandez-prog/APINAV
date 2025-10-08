import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateRazonFrancoDto,
  UpdateRazonFrancoDto,
} from './dto/razon-franco.dto';
import { Repository } from 'typeorm';
import { RazonFranco } from './entity/razon-franco.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RazonFrancoService {
  constructor(
    @InjectRepository(RazonFranco)
    private readonly razonRepo: Repository<RazonFranco>,
  ) {}

  async findAll() {
    return await this.razonRepo.find();
  }

  async findOne(id: number) {
    const razon = await this.razonRepo.findOne({ where: { id_razon: id } });
    if (!razon)
      throw new NotFoundException(`No se encontró la razón con ID ${id}`);
    return razon;
  }

  async create(data: CreateRazonFrancoDto) {
    try {
      const nueva = this.razonRepo.create(data);
      return await this.razonRepo.save(nueva);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al crear la razón de franco',
      );
    }
  }

  async update(id: number, data: UpdateRazonFrancoDto) {
    const razon = await this.findOne(id);
    Object.assign(razon, data);
    return await this.razonRepo.save(razon);
  }

  async remove(id: number) {
    const razon = await this.findOne(id);
    return await this.razonRepo.remove(razon);
  }
}
