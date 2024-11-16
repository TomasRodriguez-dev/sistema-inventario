import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PaginatorDto } from 'src/common/paginator.dto';
import { Usuario } from 'src/common/decorators/usuarios.decorator';
import { Response } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Rol } from '@prisma/client';

@Controller('inv_usuario')
@UseGuards(JwtGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Roles(Rol.SUPERADMIN)
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Res() response: Response
  ) {
    const result = await this.usuariosService.create(createUsuarioDto);
    response.status(HttpStatus.OK).json({ success: true, usuario: result, message: 'Usuario creado correctamente' });
  }

  @Get()
  @Roles(Rol.SUPERADMIN)
  async findAll(
    @Query() paginator: PaginatorDto,
    @Res() response: Response
  ) {
    const result = await this.usuariosService.findAll(paginator);
    response.status(HttpStatus.OK).json({ success: true, usuarios: result.data, metadata: result.metadata, message: 'Usuarios encontrados correctamente' });
  }

  @Get(':id')
  @Roles(Rol.SUPERADMIN)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response
  ) {
    const result = await this.usuariosService.findOne(+id);
    response.status(HttpStatus.OK).json({ success: true, usuario: result, message: 'Usuario encontrado correctamente' });
  }

  @Patch(':id')
  @Roles(Rol.SUPERADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Usuario() usuario: UpdateUsuarioDto,
    @Res() response: Response
  ) {
    const result = await this.usuariosService.update(+id, updateUsuarioDto, usuario);
    response.status(HttpStatus.OK).json({ success: true, usuario: result, message: 'Usuario actualizado correctamente' });
  }

  @Delete(':id')
  @Roles(Rol.SUPERADMIN)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Usuario() usuario: UpdateUsuarioDto,
    @Res() response: Response
  ) {
    const result = await this.usuariosService.remove(+id, usuario);
    response.status(HttpStatus.OK).json({ success: true, usuario: result, message: 'Usuario eliminado correctamente' });
  }
}
