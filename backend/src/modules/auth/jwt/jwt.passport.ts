import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PayloadInterface } from "src/common/payload.interface";
import { envs } from "src/configuration";
import { UnauthorizedException } from "@nestjs/common";
import { UsuariosService } from "../../usuarios/usuarios.service";

@Injectable()
export class JwtPassport extends PassportStrategy(Strategy) {
    constructor(
        private readonly usuarioService: UsuariosService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: envs.jwtSeed
        });
    }

    async validate(payload: PayloadInterface) {
        try {
            return await this.usuarioService.findOne(+payload.sub);
        } catch (err) {
            throw new UnauthorizedException('Usuario no autorizado');
        }
    }
}