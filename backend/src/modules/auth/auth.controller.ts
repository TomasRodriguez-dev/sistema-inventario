import { Controller, Post, Body, Res, HttpStatus } from "@nestjs/common";
import { Public } from "src/common/decorators/public.decorator";
import { LoginDto } from "./dto/login.dto";
import { CreateUsuarioDto } from "../usuarios/dto/create-usuario.dto";
import { Response } from 'express';
import { AuthService } from "./auth.service";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('inv_auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @Public()
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.' })
    @ApiResponse({ status: 400, description: 'Faltan campos para iniciar sesión.' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
    @ApiBody({
        description: 'Credenciales para iniciar sesión',
        schema: {
            example: {
                correo: 'usuario@example.com',
                contrasenia: 'contraseña'
            }
        }
    })
    async login(
        @Body() credenciales: LoginDto,
        @Res() response: Response
    ) {
        const result = await this.authService.login(credenciales);
        response.status(HttpStatus.OK).json({ success: true, usuario: result.usuario, token: result.token, message: 'Inicio de sesión exitoso' });
    }

    @Post('register')
    @Public()
    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    @ApiResponse({ status: 200, description: 'Usuario registrado correctamente.' })
    @ApiResponse({ status: 400, description: 'Faltan campos para registrar un usuario.' })
    @ApiResponse({ status: 400, description: 'El correo ya está registrado.' })
    @ApiBody({
        description: 'Datos para registrar un nuevo usuario',
        schema: {
            example: {
                nombre: 'Usuario',
                correo: 'usuario@example.com',
                contrasenia: 'contraseña'
            }
        }
    })
    async register(
        @Body() createUsuarioDto: CreateUsuarioDto,
        @Res() response: Response
    ) {
        const result = await this.authService.register(createUsuarioDto);
        response.status(HttpStatus.OK).json({ success: true, result, message: 'Usuario registrado correctamente' });
    }
}