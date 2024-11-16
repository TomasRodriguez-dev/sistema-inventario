import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { envs } from "src/configuration";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsuariosService } from "../usuarios/usuarios.service";

@Module({
    controllers: [AuthController],
    providers: [AuthService, UsuariosService],
    imports: [
        JwtModule.register({
            secret: envs.jwtSeed,
            signOptions: { expiresIn: '24h' }
        }),
        PrismaModule
    ]
})
export class AuthModule {}