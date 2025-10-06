import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto/usuario.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios sin contraseñas',
  })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':cedula')
  @ApiOperation({ summary: 'Obtener un usuario por cédula' })
  @ApiParam({ name: 'cedula', description: 'Cédula del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('cedula') cedula: string) {
    return this.usuariosService.findOne(cedula);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario (contraseña encriptada)' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos duplicados o inválidos' })
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.create(dto);
  }

  @Put(':cedula')
  @ApiOperation({ summary: 'Actualizar un usuario existente' })
  @ApiParam({ name: 'cedula', description: 'Cédula del usuario a actualizar' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(@Param('cedula') cedula: string, @Body() dto: UpdateUsuarioDto) {
    return this.usuariosService.update(cedula, dto);
  }

  @Delete(':cedula')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('cedula') cedula: string) {
    return this.usuariosService.remove(cedula);
  }
}
