import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateEspecialidadDto {
  @ApiProperty({
    example: 'Oceanografía Física',
    description: 'Nombre o descripción de la especialidad',
  })
  @IsString()
  @Length(3, 100, {
    message: 'La especialidad debe tener entre 3 y 100 caracteres',
  })
  descripcion: string;
}

export class UpdateEspecialidadDto extends PartialType(CreateEspecialidadDto) {}
