import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FrancoService } from './franco.service';
import { CreateFrancoDto, UpdateFrancoDto } from './dto/franco.dto';

@ApiTags('Francos')
@Controller('francos')
export class FrancoController {
  constructor(private readonly francosService: FrancoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los francos registrados' })
  @ApiResponse({ status: 200, description: 'Lista de francos' })
  findAll() {
    return this.francosService.findAll();
  }
  // 🆕 NUEVA RUTA
  @Get('activos')
  @ApiOperation({
    summary:
      'Listar francos activos o pendientes (excluye finalizados y cancelados)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de francos en estado ACTIVO o PENDIENTE',
  })
  findActivos() {
    return this.francosService.findActivos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un franco por su ID' })
  findOne(@Param('id') id: number) {
    return this.francosService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo franco' })
  create(@Body() dto: CreateFrancoDto) {
    return this.francosService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un franco existente' })
  update(@Param('id') id: number, @Body() dto: UpdateFrancoDto) {
    return this.francosService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un franco' })
  remove(@Param('id') id: number) {
    return this.francosService.remove(id);
  }
}
