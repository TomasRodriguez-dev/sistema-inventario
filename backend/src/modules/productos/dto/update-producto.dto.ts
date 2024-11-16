import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';
import { Type } from 'class-transformer';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
    @Type(() => Number)
    id: number;
}
