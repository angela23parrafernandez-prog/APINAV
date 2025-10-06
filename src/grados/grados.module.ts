import { Module } from '@nestjs/common';
import { GradosService } from './grados.service';
import { GradosController } from './grados.controller';
import { Grado } from './entity/grados.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Grado])],
  providers: [GradosService],
  controllers: [GradosController],
})
export class GradosModule {}
