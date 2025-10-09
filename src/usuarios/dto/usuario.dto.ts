import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  Length,
  IsNumber,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    example: '0923456789',
    description: 'Cédula única del usuario',
  })
  @IsString()
  @Length(10, 10, { message: 'La cédula debe tener exactamente 10 caracteres' })
  cedula: string;

  @ApiProperty({
    example: 'Erick',
    description: 'Nombre del usuario',
  })
  @IsString()
  nombre: string;

  @ApiProperty({
    example: 'Cisneros',
    description: 'Apellido del usuario',
  })
  @IsString()
  apellido: string;

  @ApiProperty({
    example: '0999999999',
    description: 'Teléfono del usuario',
    required: false,
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({
    example: 'erick@marina.mil.ec',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  correo: string;

  @ApiProperty({
    example: '123456',
    description: 'Contraseña del usuario (será encriptada automáticamente)',
  })
  @IsString()
  contrasena: string;

  @ApiProperty({
    example: true,
    description: 'Estado del usuario (activo o inactivo)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  // 🔹 IDs de relaciones (FKs)
  @ApiProperty({
    example: 1,
    description: 'ID del rol asociado (FK con tabla roles)',
  })
  @IsNumber({}, { message: 'El id_rol debe ser un número' })
  id_rol: number;

  @ApiProperty({
    example: 1,
    description: 'ID del grado asociado (FK con tabla grados)',
  })
  @IsNumber({}, { message: 'El id_grado debe ser un número' })
  id_grado: number;

  @ApiProperty({
    example: 2,
    description: 'ID de la especialidad asociada (FK con tabla especialidades)',
  })
  @IsNumber({}, { message: 'El id_especialidad debe ser un número' })
  id_especialidad: number;

  @ApiProperty({
    example: 3,
    description: 'ID de la sección asociada (FK con tabla secciones)',
  })
  @IsNumber({}, { message: 'El id_seccion debe ser un número' })
  id_seccion: number;
  // 🔹 Nueva propiedad para compañía
  @ApiProperty({
    example: 1,
    description:
      'ID de la compañía (1: Henao, 2: Acevedo, 3: Hayes, 4: Valverde, 5: BGD)',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El id_compania debe ser un número' })
  id_compania?: number;
}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}
