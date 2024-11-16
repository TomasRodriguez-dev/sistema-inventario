import { IsEmail, IsIn, IsString, IsBoolean, IsOptional } from "class-validator";


export class CreateUsuarioDto {
    @IsString()
    nombre: string;
    @IsEmail()
    correo: string;
    @IsString()
    contrasenia: string;
    @IsString()
    @IsIn(['USER', 'ADMIN'], {message: 'Los roles permitidos son USER o ADMIN'})
    @IsOptional()
    rol?: string;
    @IsBoolean()
    @IsOptional()
    disponible?: boolean;
}
