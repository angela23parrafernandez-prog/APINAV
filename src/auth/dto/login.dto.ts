import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: '0923456789',
    description: 'Cédula del usuario para autenticación',
  })
  @IsString()
  @Length(10, 10, { message: 'La cédula debe tener exactamente 10 caracteres' })
  cedula: string;

  @ApiProperty({
    example: '123456',
    description: 'Contraseña del usuario',
  })
  @IsString()
  contrasena: string;
}
