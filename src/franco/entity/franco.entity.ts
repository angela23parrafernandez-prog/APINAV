import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from 'src/usuarios/entity/usuarios.entity';
import { RazonFranco } from 'src/razon-franco/entity/razon-franco.entity';
@Entity('francos')
export class Franco {
  @ApiProperty({ example: 1, description: 'ID único del registro de franco' })
  @PrimaryGeneratedColumn()
  id_franco: number;

  @ApiProperty({ description: 'Usuario asociado al franco' })
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'cedula_usuario' })
  usuario: Usuario;

  @ApiProperty({
    description: 'Razón del franco (relación con razones_franco)',
  })
  @ManyToOne(() => RazonFranco)
  @JoinColumn({ name: 'id_razon' })
  razon: RazonFranco;

  @ApiProperty({
    example: '2025-10-10',
    description: 'Fecha de inicio del franco',
  })
  @Column({ type: 'date' })
  fecha_inicio: string;

  @ApiProperty({
    example: '2025-10-15',
    description: 'Fecha de fin del franco',
  })
  @Column({ type: 'date' })
  fecha_fin: string;

  @ApiProperty({
    example: 'Salida por comisión',
    description: 'Observación adicional',
  })
  @Column({ type: 'text', nullable: true })
  observacion?: string;

  @ApiProperty({
    example: 'ACTIVO',
    enum: ['ACTIVO', 'FINALIZADO', 'CANCELADO'],
    description: 'Estado actual del franco',
  })
  @Column({
    type: 'enum',
    enum: ['ACTIVO', 'FINALIZADO', 'CANCELADO'],
    default: 'ACTIVO',
  })
  estado: 'ACTIVO' | 'FINALIZADO' | 'CANCELADO';

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({ description: 'Última fecha de actualización del registro' })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
