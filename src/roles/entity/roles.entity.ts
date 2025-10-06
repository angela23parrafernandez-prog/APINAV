import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from 'src/usuarios/entity/usuarios.entity';

@Entity('roles')
export class Role {
  @ApiProperty({ example: 1, description: 'Identificador único del rol' })
  @PrimaryGeneratedColumn()
  id_rol: number;

  @ApiProperty({
    example: 'admin',
    description: 'Nombre o descripción del rol',
  })
  @Column({ length: 50 })
  descripcion: string;

  @OneToMany(() => Usuario, (usuario) => usuario.rol)
  usuarios: Usuario[];
}
