import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GuardiaService } from './guardia.service';
import { CreateGuardiaDto, UpdateGuardiaDto } from './dto/guardia.dto';

@ApiTags('Guardia')
@Controller('guardia')
export class GuardiaController {
  constructor(private readonly guardiasService: GuardiaService) {}

  @Post()
  create(@Body() dto: CreateGuardiaDto) {
    return this.guardiasService.create(dto);
  }

  @Get()
  findAll() {
    return this.guardiasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guardiasService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGuardiaDto) {
    return this.guardiasService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guardiasService.remove(+id);
  }
}
