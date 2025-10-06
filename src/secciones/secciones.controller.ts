import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { SeccionesService } from './secciones.service';
import { CreateSeccionDto, UpdateSeccionDto } from './dto/secciones.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Secciones')
@Controller('secciones')
export class SeccionesController {
  constructor(private readonly seccionesService: SeccionesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las secciones' })
  @ApiResponse({ status: 200, description: 'Lista de secciones' })
  findAll() {
    return this.seccionesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una sección por ID' })
  findOne(@Param('id') id: number) {
    return this.seccionesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva sección' })
  create(@Body() dto: CreateSeccionDto) {
    return this.seccionesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una sección existente' })
  update(@Param('id') id: number, @Body() dto: UpdateSeccionDto) {
    return this.seccionesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una sección' })
  remove(@Param('id') id: number) {
    return this.seccionesService.remove(id);
  }
}
