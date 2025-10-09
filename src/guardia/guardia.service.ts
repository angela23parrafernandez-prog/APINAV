import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guardia } from './entity/guardia.entity';
import { CreateGuardiaDto, UpdateGuardiaDto } from './dto/guardia.dto';

@Injectable()
export class GuardiaService {
  constructor(
    @InjectRepository(Guardia)
    private readonly guardiasRepo: Repository<Guardia>,
  ) {}

  async create(dto: CreateGuardiaDto): Promise<Guardia> {
    console.log(dto);
    const nueva = this.guardiasRepo.create(dto);
    return await this.guardiasRepo.save(nueva);
  }

  async findAll(): Promise<Guardia[]> {
    return await this.guardiasRepo.find({
      order: { hora_registro: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Guardia> {
    const guardia = await this.guardiasRepo.findOneBy({ id_guardia: id });
    if (!guardia) throw new NotFoundException('Guardia no encontrada');
    return guardia;
  }

  async update(id: number, dto: UpdateGuardiaDto): Promise<Guardia> {
    const guardia = await this.findOne(id);
    Object.assign(guardia, dto);
    return await this.guardiasRepo.save(guardia);
  }

  async remove(id: number): Promise<void> {
    const result = await this.guardiasRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Guardia no encontrada');
  }
}
