import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from 'src/usuarios/entity/usuarios.entity';

@Entity('grados')
export class Grado {
  @ApiProperty({ example: 1, description: 'Identificador único del grado' })
  @PrimaryGeneratedColumn()
  id_grado: number;

  @ApiProperty({
    example: 'GN1',
    description: 'Código o descripción del grado',
  })
  @Column({ length: 50 })
  descripcion: string;

  @OneToMany(() => Usuario, (usuario) => usuario.grado)
  usuarios: Usuario[];
}
