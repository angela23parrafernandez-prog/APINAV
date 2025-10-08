import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateRazonFrancoDto {
  @ApiProperty({
    example: 'Permiso especial',
    description: 'Descripción de la razón del franco',
  })
  @IsString()
  @Length(3, 100)
  descripcion: string;
}

export class UpdateRazonFrancoDto extends PartialType(CreateRazonFrancoDto) {}
