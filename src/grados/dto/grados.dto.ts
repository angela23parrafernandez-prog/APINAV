import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateGradoDto {
  @ApiProperty({
    example: 'GN1',
    description: 'Código o nombre del grado militar',
  })
  @IsString()
  @Length(2, 50, { message: 'El grado debe tener entre 2 y 50 caracteres' })
  descripcion: string;
}

export class UpdateGradoDto extends PartialType(CreateGradoDto) {}
