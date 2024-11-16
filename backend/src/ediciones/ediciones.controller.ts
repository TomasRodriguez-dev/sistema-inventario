import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EdicionesService } from './ediciones.service';
import { CreateEdicionesDto } from './dto/create-ediciones.dto';
import { UpdateEdicioneDto } from './dto/update-ediciones.dto';

@Controller('ediciones')
export class EdicionesController {
  constructor(private readonly edicionesService: EdicionesService) {}

}
