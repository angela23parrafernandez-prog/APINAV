import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto/usuario.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

   /** Nuevo endpoint */
  @Get('con-credenciales')
  async findUsuariosConCredenciales() {
    return this.usuariosService.findUsuariosConCredenciales();
  }


  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios sin contraseñas',
  })


  findAll() {
    return this.usuariosService.findAll();
  }
  @Get('normales')
  @ApiOperation({
    summary: 'Obtener todos los usuarios con rol normal (id_rol = 2)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios con rol normal, sin contraseñas',
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener los usuarios normales',
  })
  findUsuariosNormales() {
    return this.usuariosService.findByRol(2);
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

  @Get('en-reparto')
  @ApiOperation({
    summary:
      'Listar usuarios con rol 2 que están actualmente en el reparto (no franco activo)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios en reparto actualmente',
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener usuarios en reparto',
  })
  async getUsuariosEnReparto() {
    try {
      return await this.usuariosService.findUsuariosEnReparto();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener usuarios en reparto',
      );
    }
  }

  //  Usuarios actualmente EN FRANCO
  @Get('en-franco')
  @ApiOperation({
    summary: 'Listar usuarios con rol 2 que están actualmente de franco',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios actualmente de franco',
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener usuarios en franco',
  })
  async getUsuariosEnFranco() {
    try {
      return await this.usuariosService.findUsuariosEnFranco();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener usuarios en franco',
      );
    }
  }





}
