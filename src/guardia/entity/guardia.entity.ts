import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('guardias')
export class Guardia {
  @ApiProperty({ example: 1, description: 'ID único de la guardia' })
  @PrimaryGeneratedColumn()
  id_guardia: number;

  @ApiProperty({
    example: 'Gustavo Cisneros',
    description: 'Nombre del militar',
  })
  @Column({ length: 100 })
  nombre: string;

  @ApiProperty({ example: 'Henao', description: 'Compañía del militar' })
  @Column({ length: 50 })
  compania: string;

  @ApiProperty({
    example: '2025-10-05T20:31:00Z',
    description: 'Fecha y hora del registro',
  })
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  hora_registro: Date;
}
