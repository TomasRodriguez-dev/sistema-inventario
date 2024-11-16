import { Controller, Post, Body, Res, HttpStatus } from "@nestjs/common";
import { Public } from "src/common/decorators/public.decorator";
import { LoginDto } from "./dto/login.dto";
import { CreateUsuarioDto } from "../usuarios/dto/create-usuario.dto";
import { Response } from 'express';
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @Public()
    async login(
        @Body() credenciales: LoginDto,
        @Res() response: Response
    ) {
        const result = await this.authService.login(credenciales);
        response.status(HttpStatus.OK).json({ success: true, usuario: result.usuario, token: result.token, message: 'Inicio de sesión exitoso' });
    }

    @Post('register')
    @Public()
    async register(
        @Body() createUsuarioDto: CreateUsuarioDto,
        @Res() response: Response
    ) {
        const result = await this.authService.register(createUsuarioDto);
        response.status(HttpStatus.CREATED).json({ success: true, result, message: 'Usuario registrado correctamente' });
    }
}