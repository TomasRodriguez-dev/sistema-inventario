import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './modules/auth/guards/jwt.guard';
import { EdicionesModule } from './ediciones/ediciones.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductosModule } from './modules/productos/productos.module';

@Module({
  imports: [PrismaModule, UsuariosModule, EdicionesModule, AuthModule, ProductosModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    },
  ],
})
export class AppModule {}
