import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entity/usuarios.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Franco } from 'src/franco/entity/franco.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Franco])],
  providers: [UsuariosService],
  controllers: [UsuariosController],
  exports: [UsuariosService],
})
export class UsuariosModule {}
