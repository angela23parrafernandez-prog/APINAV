import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RazonFrancoService } from './razon-franco.service';
import {
  CreateRazonFrancoDto,
  UpdateRazonFrancoDto,
} from './dto/razon-franco.dto';

@ApiTags('Razones de Franco')
@Controller('razones-franco')
export class RazonFrancoController {
  constructor(private readonly razonesService: RazonFrancoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las razones de franco' })
  @ApiResponse({ status: 200, description: 'Lista de razones de franco' })
  findAll() {
    return this.razonesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una razón de franco por ID' })
  findOne(@Param('id') id: number) {
    return this.razonesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva razón de franco' })
  create(@Body() dto: CreateRazonFrancoDto) {
    return this.razonesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una razón de franco existente' })
  update(@Param('id') id: number, @Body() dto: UpdateRazonFrancoDto) {
    return this.razonesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una razón de franco' })
  remove(@Param('id') id: number) {
    return this.razonesService.remove(id);
  }
}
