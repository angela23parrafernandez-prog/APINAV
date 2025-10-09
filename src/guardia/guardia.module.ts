import { Module } from '@nestjs/common';
import { GuardiaController } from './guardia.controller';
import { GuardiaService } from './guardia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guardia } from './entity/guardia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guardia])],
  controllers: [GuardiaController],
  providers: [GuardiaService],
})
export class GuardiaModule {}
