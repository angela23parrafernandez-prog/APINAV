import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Franco } from 'src/franco/entity/franco.entity';
@Entity('razones_franco')
export class RazonFranco {
  @ApiProperty({ example: 1, description: 'ID único de la razón de franco' })
  @PrimaryGeneratedColumn()
  id_razon: number;

  @ApiProperty({
    example: 'Vacaciones',
    description: 'Descripción del motivo del franco',
  })
  @Column({ length: 100, unique: true })
  descripcion: string;

  @OneToMany(() => Franco, (franco) => franco.razon)
  francos: Franco[];
}
