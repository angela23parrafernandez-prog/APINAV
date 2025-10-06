import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateSeccionDto {
  @ApiProperty({
    example: 'Primera',
    description: 'Nombre o descripción de la sección',
  })
  @IsString()
  @Length(3, 100, { message: 'La sección debe tener entre 3 y 100 caracteres' })
  descripcion: string;
}

export class UpdateSeccionDto extends PartialType(CreateSeccionDto) {}
