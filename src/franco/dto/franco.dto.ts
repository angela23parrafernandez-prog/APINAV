import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFrancoDto {
  @ApiProperty({
    example: '0923456789',
    description: 'Cédula del usuario que está de franco',
  })
  @IsString()
  cedula_usuario: string;

  @ApiProperty({
    example: 1,
    description: 'ID de la razón del franco (FK con razones_franco)',
  })
  @IsNotEmpty()
  id_razon: number;

  @ApiProperty({
    example: '2025-10-10',
    description: 'Fecha de inicio del franco (YYYY-MM-DD)',
  })
  @IsDateString()
  fecha_inicio: string;

  @ApiProperty({
    example: '2025-10-15',
    description: 'Fecha de fin del franco (YYYY-MM-DD)',
  })
  @IsDateString()
  fecha_fin: string;

  @ApiProperty({
    example: 'Autorizado por el comandante',
    description: 'Observación adicional',
    required: false,
  })
  @IsOptional()
  @IsString()
  observacion?: string;

  @ApiProperty({
    example: 'PENDIENTE',
    enum: ['PENDIENTE', 'ACTIVO', 'FINALIZADO', 'CANCELADO'],
    description: 'Estado actual del registro de sanidad',
    required: false,
  })
  @IsOptional()
  @IsEnum(['PENDIENTE', 'ACTIVO', 'FINALIZADO', 'CANCELADO'])
  estado?: 'PENDIENTE' | 'ACTIVO' | 'FINALIZADO' | 'CANCELADO';
}

export class UpdateFrancoDto extends PartialType(CreateFrancoDto) {}
