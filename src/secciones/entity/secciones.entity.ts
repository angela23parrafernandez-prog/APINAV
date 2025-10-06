import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from 'src/usuarios/entity/usuarios.entity';

@Entity('secciones')
export class Seccion {
  @ApiProperty({ example: 1, description: 'Identificador único de la sección' })
  @PrimaryGeneratedColumn()
  id_seccion: number;

  @ApiProperty({
    example: 'Primera',
    description: 'Nombre o descripción de la sección',
  })
  @Column({ length: 100 })
  descripcion: string;

  @OneToMany(() => Usuario, (usuario) => usuario.seccion)
  usuarios: Usuario[];
}
