import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { EspecialidadesService } from './especialidades.service';
import {
  CreateEspecialidadDto,
  UpdateEspecialidadDto,
} from './dto/especialidades.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Especialidades')
@Controller('especialidades')
export class EspecialidadesController {
  constructor(private readonly especialidadesService: EspecialidadesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las especialidades' })
  @ApiResponse({ status: 200, description: 'Lista de especialidades' })
  findAll() {
    return this.especialidadesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una especialidad por ID' })
  findOne(@Param('id') id: number) {
    return this.especialidadesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva especialidad' })
  create(@Body() dto: CreateEspecialidadDto) {
    return this.especialidadesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una especialidad existente' })
  update(@Param('id') id: number, @Body() dto: UpdateEspecialidadDto) {
    return this.especialidadesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una especialidad' })
  remove(@Param('id') id: number) {
    return this.especialidadesService.remove(id);
  }
}
