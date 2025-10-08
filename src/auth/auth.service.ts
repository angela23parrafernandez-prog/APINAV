import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    // Buscar el usuario por cédula
    const usuario = await this.usuariosService.findByCedula(dto.cedula);

    if (!usuario) {
      throw new NotFoundException('No se encontró un usuario con esa cédula');
    }

    // Validar contraseña
    const passwordValida = await bcrypt.compare(
      dto.contrasena,
      usuario.contrasena,
    );

    if (!passwordValida) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // 🔒 Quitamos la contraseña antes de devolver los datos
    const { contrasena, ...safeUsuario } = usuario;

    // 🔑 Creamos el payload del token
    const payload = {
      sub: usuario.cedula,
      nombre: usuario.nombre,
      rol: usuario.rol?.descripcion || 'usuario',
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Inicio de sesión exitoso',
      usuario: safeUsuario,
      token,
    };
  }
}
