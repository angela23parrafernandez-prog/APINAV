import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateGuardiaDto {
  @ApiProperty({
    example: 'Gustavo Cisneros',
    description: 'Nombre del militar',
  })
  @IsString()
  @Length(3, 100)
  nombre: string;

  @ApiProperty({ example: 'Henao', description: 'Compañía del militar' })
  @IsString()
  @Length(2, 50)
  compania: string;
  @ApiProperty({
    example: '2025-10-09T14:30:00',
    description: 'Fecha y hora del registro (opcional)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  hora_registro?: string;
}
export class UpdateGuardiaDto extends PartialType(CreateGuardiaDto) {}
