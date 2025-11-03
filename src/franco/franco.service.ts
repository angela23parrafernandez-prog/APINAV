import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entity/usuarios.entity';
import { Franco } from './entity/franco.entity';
import { RazonFranco } from 'src/razon-franco/entity/razon-franco.entity';
import { CreateFrancoDto, UpdateFrancoDto } from './dto/franco.dto';

@Injectable()
export class FrancoService {
  constructor(
    @InjectRepository(Franco)
    private readonly francosRepository: Repository<Franco>,
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    @InjectRepository(RazonFranco)
    private readonly razonesRepository: Repository<RazonFranco>,
  ) {}

  /** Obtener todos los francos */
  async findAll() {
    const francos = await this.francosRepository.find({
      relations: ['usuario', 'razon'],
    });

    // 🔒 Eliminamos la contraseña antes de devolver los datos
    return francos.map((f) => {
      if (f.usuario) {
        const { contrasena, ...safeUsuario } = f.usuario;
        return { ...f, usuario: safeUsuario };
      }
      return f;
    });
  }

  /**  Obtener francos activos o pendientes */
  async findActivos() {
    const francos = await this.francosRepository.find({
     
      relations: ['usuario', 'razon'],
    });

    //  Removemos contraseña de usuario
    return francos.map((f) => {
      if (f.usuario) {
        const { contrasena, ...safeUsuario } = f.usuario;
        return { ...f, usuario: safeUsuario };
      }
      return f;
    });
  }
  /** Obtener un franco por ID */
  async findOne(id: number) {
    const franco = await this.francosRepository.findOne({
      where: { id_franco: id },
      relations: ['usuario', 'razon'],
    });

    if (!franco)
      throw new NotFoundException(`No se encontró el franco con ID ${id}`);

    // 🔒 Eliminamos la contraseña si existe
    if (franco.usuario) {
      const { contrasena, ...safeUsuario } = franco.usuario;
      franco.usuario = safeUsuario as any;
    }

    return franco;
  }

  async create(data: CreateFrancoDto) {
    try {
      const usuario = await this.usuariosRepository.findOne({
        where: { cedula: data.cedula_usuario },
      });
      if (!usuario)
        throw new NotFoundException(
          `No existe el usuario con cédula ${data.cedula_usuario}`,
        );

      const razon = await this.razonesRepository.findOne({
        where: { id_razon: data.id_razon },
      });
      if (!razon)
        throw new NotFoundException(
          `No existe la razón con ID ${data.id_razon}`,
        );

      const nuevo = this.francosRepository.create({
        usuario: { cedula: usuario.cedula },
        razon: { id_razon: razon.id_razon },
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin,
        observacion: data.observacion,
        estado:
          (data.estado as 'ACTIVO' | 'FINALIZADO' | 'CANCELADO') ?? 'ACTIVO',
      });

      return await this.francosRepository.save(nuevo);
    } catch (error) {
      console.error('Error al crear franco:', error);
      throw new InternalServerErrorException('Error al crear el franco');
    }
  }

  async update(id: number, data: UpdateFrancoDto) {
    const franco = await this.findOne(id);
    Object.assign(franco, data);
    return await this.francosRepository.save(franco);
  }

  async remove(id: number) {
    const franco = await this.findOne(id);
    return await this.francosRepository.remove(franco);
  }
}
