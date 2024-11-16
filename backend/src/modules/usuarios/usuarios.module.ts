import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/configuration';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from '../auth/auth.service';
import { JwtPassport } from '../auth/jwt/jwt.passport';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, AuthService, JwtPassport],
  imports: [
    JwtModule.register({
      secret: envs.jwtSeed,
      signOptions: { expiresIn: '24h' }
    }),
    PrismaModule
  ]
})
export class UsuariosModule {}
