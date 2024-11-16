import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class PaginatorDto {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    page: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    perPage: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    limit: number;
}
