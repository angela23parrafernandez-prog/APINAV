import { Module } from '@nestjs/common';
import { RazonFrancoController } from './razon-franco.controller';
import { RazonFrancoService } from './razon-franco.service';
import { RazonFranco } from './entity/razon-franco.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RazonFranco])],
  controllers: [RazonFrancoController],
  providers: [RazonFrancoService],
})
export class RazonFrancoModule {}
