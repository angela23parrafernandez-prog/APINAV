import { Module } from '@nestjs/common';
import { FrancoController } from './franco.controller';
import { FrancoService } from './franco.service';
import { Franco } from './entity/franco.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RazonFranco } from 'src/razon-franco/entity/razon-franco.entity';
import { Usuario } from 'src/usuarios/entity/usuarios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Franco, Usuario, RazonFranco])],
  controllers: [FrancoController],
  providers: [FrancoService],
  exports: [FrancoService],
})
export class FrancoModule {}
