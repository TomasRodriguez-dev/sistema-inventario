import { PartialType } from '@nestjs/mapped-types';
import { CreateEdicionesDto } from './create-ediciones.dto';

export class UpdateEdicioneDto extends PartialType(CreateEdicionesDto) {}
