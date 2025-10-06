import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entity/usuarios.entity';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto/usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  /** Obtener todos los usuarios (sin contraseñas) */
  async findAll() {
    try {
      const usuarios = await this.usuariosRepository.find({
        relations: ['rol', 'grado', 'especialidad', 'seccion'],
      });
      // ❌ No retornamos contraseñas
      return usuarios.map(({ contrasena, ...rest }) => rest);
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los usuarios');
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
    // ❌ No retornamos contraseña
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

      // 🔒 Encriptar contraseña
      const hashedPassword = await bcrypt.hash(data.contrasena, 10);
      const nuevo = this.usuariosRepository.create({
        ...data,
        contrasena: hashedPassword,
      });

      const saved = await this.usuariosRepository.save(nuevo);
      const { contrasena, ...safeUsuario } = saved;
      return safeUsuario;
    } catch (error) {
      // ✅ Captura los errores específicos de MySQL
      if (error.code === 'ER_DUP_ENTRY') {
        // Ejemplo del mensaje: "Duplicate entry 'erick@marina.mil.ec' for key 'usuarios.correo'"
        const message: string = error.sqlMessage || '';
        let campo = 'dato duplicado';

        if (message.includes('cedula')) campo = 'cédula';
        else if (message.includes('correo')) campo = 'correo';

        throw new BadRequestException(`Ya existe un usuario con esa ${campo}`);
      }

      // ✅ Captura errores de validación manual
      if (error instanceof BadRequestException) {
        throw error;
      }

      // ✅ Cualquier otro error inesperado
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
      // 🔒 Encriptar contraseña si viene en la actualización
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
}
