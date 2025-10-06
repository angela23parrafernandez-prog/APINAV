import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateRolDto {
  @ApiProperty({
    example: 'admin',
    description: 'Nombre o descripción del rol',
  })
  @IsString()
  @Length(3, 50, {
    message: 'El nombre del rol debe tener entre 3 y 50 caracteres',
  })
  descripcion: string;
}

export class UpdateRolDto extends PartialType(CreateRolDto) {}
