import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PayloadInterface } from 'src/common/payload.interface';
import { UpdateUsuarioDto } from '../usuarios/dto/update-usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Rol } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) {}
    //! Hash de Contraseñas
    hashContrasenia(contrasenia: string): Promise<string> {
        const saltOrRounds = 12;
        return bcrypt.hash(contrasenia, saltOrRounds);
    }

    compararContrasenia(
        contrasenia: string,
        hashContrasenia: string
    ): Promise<boolean> {
        return bcrypt.compare(contrasenia, hashContrasenia);
    }

    //! Hash de Contraseñas
    //! Funciones para los JWT
    crearJwt(usuario: UpdateUsuarioDto): string {
        const { id: sub, correo, rol } = usuario || {};
        const payload: PayloadInterface = {
            sub,
            correo,
            rol
        };
        return this.jwtService.sign(payload);
    }

    comprobarJwt(token: string): PayloadInterface {
        return this.jwtService.verify(token);
    }
    //! Funciones para los JWT
    //! Servicios de Autenticación
    async register(createUsuarioDto: CreateUsuarioDto) {
        const { contrasenia, correo } = createUsuarioDto || {};
        const usuario = await this.prisma.usuario.findFirst({ where: { correo } });
        if (usuario) throw new BadRequestException('El correo ya está registrado');
        if (!contrasenia) throw new BadRequestException('La contraseña es requerida');
        const hashPassword = await this.hashContrasenia(contrasenia);
        const newUsuario = await this.prisma.usuario.create({
        data: { 
            ...createUsuarioDto, 
            contrasenia: hashPassword,
            rol: 'USER'
        }
        });
        delete newUsuario['contrasenia'];
        return newUsuario;  
    }
    async login(credenciales: LoginDto) {
        const { correo, contrasenia } = credenciales;
        const usuario = await this.prisma.usuario.findFirst({ where: { correo } });
        //! Si no existe, no autorizado 
        if (!usuario) throw new UnauthorizedException('Usuario no encontrado');
        const isPassword = await this.compararContrasenia(
        contrasenia,
        usuario.contrasenia
        );
        //! Si no es igual, no autorizado
        if (!isPassword) throw new UnauthorizedException('Credenciales inválidas');
        const token = this.crearJwt(usuario);
        delete usuario['contrasenia'];
        return { usuario, token };
    }
    //! Servicios de Autenticación
}
