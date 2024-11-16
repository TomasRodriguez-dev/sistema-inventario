import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    @Type(() => Number)
    id: number;
    @IsString()
    rol: string;
}
