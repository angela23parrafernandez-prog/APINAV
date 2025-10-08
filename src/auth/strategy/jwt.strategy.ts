import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'clave-super-secreta',
    });
  }

  async validate(payload: any) {
    // Este objeto se adjunta a req.user
    return {
      cedula: payload.sub,
      correo: payload.correo,
      rol: payload.rol,
    };
  }
}
