import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { EspecialidadesModule } from './especialidades/especialidades.module';
import { GradosModule } from './grados/grados.module';
import { SeccionesModule } from './secciones/secciones.module';
import { AuthModule } from './auth/auth.module';
import { FrancoModule } from './franco/franco.module';
import { RazonFrancoModule } from './razon-franco/razon-franco.module';
import { GuardiaModule } from './guardia/guardia.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // solo desarrollo
      }),
    }),
    UsuariosModule,
    RolesModule,
    EspecialidadesModule,
    GradosModule,
    SeccionesModule,
    AuthModule,
    FrancoModule,
    RazonFrancoModule,
    GuardiaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
