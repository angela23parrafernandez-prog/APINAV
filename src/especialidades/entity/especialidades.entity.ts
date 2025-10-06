import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from 'src/usuarios/entity/usuarios.entity';

@Entity('especialidades')
export class Especialidad {
  @ApiProperty({
    example: 1,
    description: 'Identificador único de la especialidad',
  })
  @PrimaryGeneratedColumn()
  id_especialidad: number;

  @ApiProperty({ example: 'Naviera', description: 'Nombre de la especialidad' })
  @Column({ length: 100 })
  descripcion: string;

  @OneToMany(() => Usuario, (usuario) => usuario.especialidad)
  usuarios: Usuario[];
}
