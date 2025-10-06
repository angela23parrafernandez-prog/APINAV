import { Module } from '@nestjs/common';
import { EspecialidadesService } from './especialidades.service';
import { EspecialidadesController } from './especialidades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Especialidad } from './entity/especialidades.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Especialidad])],
  providers: [EspecialidadesService],
  controllers: [EspecialidadesController],
})
export class EspecialidadesModule {}
