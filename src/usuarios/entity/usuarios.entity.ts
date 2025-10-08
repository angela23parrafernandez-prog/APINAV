import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/roles/entity/roles.entity';
import { Grado } from 'src/grados/entity/grados.entity';
import { Especialidad } from 'src/especialidades/entity/especialidades.entity';
import { Seccion } from 'src/secciones/entity/secciones.entity';
import { Franco } from 'src/franco/entity/franco.entity';

@Entity('usuarios')
export class Usuario {
  @ApiProperty({ example: '0923456789', description: 'Cédula del usuario' })
  @PrimaryColumn({ type: 'varchar', length: 10 })
  cedula: string;

  @ApiProperty({ example: 'Erick', description: 'Nombre del usuario' })
  @Column({ length: 50 })
  nombre: string;

  @ApiProperty({ example: 'Cisneros', description: 'Apellido del usuario' })
  @Column({ length: 50 })
  apellido: string;

  @ApiProperty({ example: '0999999999', description: 'Teléfono del usuario' })
  @Column({ length: 15, nullable: true })
  telefono: string;

  @ApiProperty({
    example: 'erick@marina.mil.ec',
    description: 'Correo electrónico del usuario',
  })
  @Column({ length: 100, unique: true })
  correo: string;

  @ApiProperty({
    example: 'hash_encriptado',
    description: 'Contraseña encriptada del usuario',
  })
  @Column({ length: 255 })
  contrasena: string;

  @ApiProperty({
    example: true,
    description: 'Estado del usuario: activo o inactivo',
  })
  @Column({ default: true })
  estado: boolean;

  @Column({ type: 'int', nullable: true })
  id_rol?: number;

  @Column({ type: 'int', nullable: true })
  id_grado?: number;

  @Column({ type: 'int', nullable: true })
  id_especialidad?: number;

  @Column({ type: 'int', nullable: true })
  id_seccion?: number;

  @ApiProperty({ description: 'Rol asignado al usuario' })
  @ManyToOne(() => Role, (role) => role.usuarios)
  @JoinColumn({ name: 'id_rol' })
  rol: Role;

  @ApiProperty({ description: 'Grado del usuario' })
  @ManyToOne(() => Grado, (grado) => grado.usuarios)
  @JoinColumn({ name: 'id_grado' })
  grado: Grado;

  @ApiProperty({ description: 'Especialidad del usuario' })
  @ManyToOne(() => Especialidad, (esp) => esp.usuarios)
  @JoinColumn({ name: 'id_especialidad' })
  especialidad: Especialidad;

  @ApiProperty({ description: 'Sección a la que pertenece el usuario' })
  @ManyToOne(() => Seccion, (sec) => sec.usuarios)
  @JoinColumn({ name: 'id_seccion' })
  seccion: Seccion;

  @ApiProperty({
    type: () => [Franco],
    description: 'Lista de francos asociados al usuario',
  })
  @OneToMany(() => Franco, (franco) => franco.usuario)
  francos: Franco[];
}
