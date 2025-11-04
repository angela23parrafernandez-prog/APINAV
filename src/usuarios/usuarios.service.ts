import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Usuario } from './entity/usuarios.entity';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto/usuario.dto';
import * as bcrypt from 'bcrypt';
import { Franco } from 'src/franco/entity/franco.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    @InjectRepository(Franco)
    private readonly francosRepository: Repository<Franco>,
  ) {}

  /** Obtener todos los usuarios (sin contraseñas) */
  async findAll() {
    try {
      const usuarios = await this.usuariosRepository.find({
        relations: ['rol', 'grado', 'especialidad', 'seccion'],
      });
      //  No retornamos contraseñas
      return usuarios.map(({ contrasena, ...rest }) => rest);
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los usuarios');
    }
  }
  async findByRol(idRol: number) {
    try {
      const usuarios = await this.usuariosRepository.find({
        where: { rol: { id_rol: idRol } },
        relations: ['rol', 'grado', 'especialidad', 'seccion'],
      });

      // Si no hay usuarios con ese rol
      if (!usuarios.length) {
        throw new NotFoundException(
          `No se encontraron usuarios con rol ${idRol}`,
        );
      }

      // Quita la contraseña de la respuesta
      return usuarios.map(({ contrasena, ...rest }) => rest);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error('Error al obtener usuarios por rol:', error);
      throw new InternalServerErrorException(
        'Error al obtener los usuarios por rol',
      );
    }
  }

  /** Obtener un usuario por cédula */
  async findOne(cedula: string) {
    const usuario = await this.usuariosRepository.findOne({
      where: { cedula },
      relations: ['rol', 'grado', 'especialidad', 'seccion'],
    });
    if (!usuario) {
      throw new NotFoundException(
        `No se encontró el usuario con cédula ${cedula}`,
      );
    }
    //  No retornamos contraseña
    const { contrasena, ...safeUsuario } = usuario;
    return safeUsuario;
  }

  /** Crear un nuevo usuario */
  async create(data: CreateUsuarioDto) {
    try {
      // Verificar si ya existe un correo o cédula duplicado
      const existe = await this.usuariosRepository.findOne({
        where: [{ cedula: data.cedula }, { correo: data.correo }],
      });

      if (existe) {
        const campoDuplicado =
          existe.cedula === data.cedula ? 'cédula' : 'correo';
        throw new BadRequestException(
          `Ya existe un usuario con esa ${campoDuplicado}`,
        );
      }

      //  Encriptar contraseña
      const hashedPassword = await bcrypt.hash(data.contrasena, 10);
      const nuevo = this.usuariosRepository.create({
        ...data,
        contrasena: hashedPassword,
      });

      const saved = await this.usuariosRepository.save(nuevo);
      const { contrasena, ...safeUsuario } = saved;
      return safeUsuario;
    } catch (error) {
      //  Captura los errores específicos de MySQL
      if (error.code === 'ER_DUP_ENTRY') {
        // Ejemplo del mensaje: "Duplicate entry 'erick@marina.mil.ec' for key 'usuarios.correo'"
        const message: string = error.sqlMessage || '';
        let campo = 'dato duplicado';

        if (message.includes('cedula')) campo = 'cédula';
        else if (message.includes('correo')) campo = 'correo';

        throw new BadRequestException(`Ya existe un usuario con esa ${campo}`);
      }

      //  Captura errores de validación manual
      if (error instanceof BadRequestException) {
        throw error;
      }

      //  Cualquier otro error inesperado
      console.error('Error al crear usuario:', error);
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  /** Actualizar un usuario existente */
  async update(cedula: string, data: UpdateUsuarioDto) {
    const usuario = await this.usuariosRepository.findOne({
      where: { cedula },
    });
    if (!usuario) {
      throw new NotFoundException(
        `No se encontró el usuario con cédula ${cedula}`,
      );
    }

    try {
      //  Encriptar contraseña si viene en la actualización
      if (data.contrasena) {
        data.contrasena = await bcrypt.hash(data.contrasena, 10);
      }

      Object.assign(usuario, data);
      const updated = await this.usuariosRepository.save(usuario);

      const { contrasena, ...safeUsuario } = updated;
      return safeUsuario;
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  /** Eliminar un usuario */
  async remove(cedula: string) {
    const usuario = await this.usuariosRepository.findOne({
      where: { cedula },
    });
    if (!usuario) {
      throw new NotFoundException(
        `No se encontró el usuario con cédula ${cedula}`,
      );
    }

    try {
      await this.usuariosRepository.remove(usuario);
      return {
        message: `Usuario con cédula ${cedula} eliminado correctamente`,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el usuario');
    }
  }
  async findByCedula(cedula: string) {
    return this.usuariosRepository.findOne({
      where: { cedula },
      relations: ['rol'],
    });
  }

  async findUsuariosEnFranco() {
    try {
      const hoy = new Date();

      const francosActivos = await this.francosRepository.find({
        where: {
          estado: 'ACTIVO',
        },
        relations: ['usuario', 'razon'],
      });

      // Filtramos solo los usuarios normales (rol 2)
      const usuariosFranco = francosActivos
        .filter(
          (f) =>
            f.usuario.rol?.id_rol === 2 &&
            hoy >= new Date(f.fecha_inicio) &&
            hoy <= new Date(f.fecha_fin),
        )
        .map((f) => ({
          cedula: f.usuario.cedula,
          nombre: f.usuario.nombre,
          apellido: f.usuario.apellido,
          razon: f.razon.descripcion,
          fecha_inicio: f.fecha_inicio,
          fecha_fin: f.fecha_fin,
          observacion: f.observacion,
        }));

      return usuariosFranco;
    } catch (error) {
      console.error('Error al obtener usuarios en franco:', error);
      throw new InternalServerErrorException(
        'Error al obtener usuarios en franco',
      );
    }
  }

  //  Usuarios actualmente en reparto (rol 2 + no franco activo)
  async findUsuariosEnReparto() {
    try {
      const hoy = new Date();

      // Usuarios normales
      const usuariosNormales = await this.usuariosRepository.find({
        where: { rol: { id_rol: 2 } },
        relations: ['rol', 'grado', 'especialidad', 'seccion'],
      });

      // Francos activos
      const francosActivos = await this.francosRepository.find({
        where: { estado: 'ACTIVO' },
        relations: ['usuario'],
      });

      const cedulasFranco = francosActivos
        .filter(
          (f) =>
            hoy >= new Date(f.fecha_inicio) && hoy <= new Date(f.fecha_fin),
        )
        .map((f) => f.usuario.cedula);

      // Filtramos los que NO están franco
      const usuariosEnReparto = usuariosNormales.filter(
        (u) => !cedulasFranco.includes(u.cedula),
      );

      return usuariosEnReparto.map(({ contrasena, ...rest }) => rest);
    } catch (error) {
      console.error('Error al obtener usuarios en reparto:', error);
      throw new InternalServerErrorException(
        'Error al obtener usuarios en reparto',
      );
    }
  }

   /**  Obtener solo usuarios con credenciales (correo y contraseña no vacíos) */
/**  Obtener solo usuarios con credenciales (correo y contraseña no vacíos) */
async findUsuariosConCredenciales() {
  try {
    const usuarios = await this.usuariosRepository.find({
      select: ['cedula', 'nombre', 'apellido', 'telefono', 'correo', 'id_rol'], // ✅ solo estos campos
      where: [
        { correo: Not(''), contrasena: Not('') },
      ],
    });

    const filtrados = usuarios.filter(
      (u) =>
        u.cedula &&
        u.nombre &&
        u.correo &&
        u.telefono !== undefined &&
        u.correo.trim() !== '',
    );

    return filtrados;
  } catch (error) {
    console.error('Error al obtener usuarios con credenciales:', error);
    throw new InternalServerErrorException(
      'Error al obtener usuarios con credenciales',
    );
  }
}


}
