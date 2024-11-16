import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Res, HttpStatus, UseGuards, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('inv_usuario')
@ApiBearerAuth()
@Controller('inv_usuario')
@UseGuards(JwtGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Roles(Rol.SUPERADMIN)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 200, description: 'Usuario creado correctamente.' })
  @ApiResponse({ status: 401, description: 'No estás autenticado.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para realizar esta acción.' })
  @ApiBody({
    description: 'Datos para crear un nuevo usuario',
    schema: {
      example: {
        nombre: 'Tomas Javier',
        email: 'tomasjavier@example.com',
        password: 'password123',
        rol: 'ADMIN'
      }
    }
  })
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Res() response: Response
  ) {
    try {
      const result = await this.usuariosService.create(createUsuarioDto);
      response.status(HttpStatus.OK).json({ success: true, usuario: result, message: 'Usuario creado correctamente' });
    } catch (error) {
      throw new BadRequestException('Datos inválidos al registrar el usuario.');
    }
  }

  @Get()
  @Roles(Rol.SUPERADMIN)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Usuarios encontrados correctamente.' })
  @ApiResponse({ status: 401, description: 'No estás autenticado.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para realizar esta acción.' })
  async findAll(
    @Query() paginator: PaginatorDto,
    @Res() response: Response
  ) {
    const result = await this.usuariosService.findAll(paginator);
    response.status(HttpStatus.OK).json({ success: true, usuarios: result.data, metadata: result.metadata, message: 'Usuarios encontrados correctamente' });
  }

  @Get(':id')
  @Roles(Rol.SUPERADMIN)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado correctamente.' })
  @ApiResponse({ status: 401, description: 'No estás autenticado.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para realizar esta acción.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response
  ) {
    const result = await this.usuariosService.findOne(+id);
    if (!result) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    response.status(HttpStatus.OK).json({ success: true, usuario: result, message: 'Usuario encontrado correctamente' });
  }

  @Patch(':id')
  @Roles(Rol.SUPERADMIN)
  @ApiOperation({ summary: 'Actualizar un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente.' })
  @ApiResponse({ status: 401, description: 'No estás autenticado.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para realizar esta acción.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Usuario() usuario: UpdateUsuarioDto,
    @Res() response: Response
  ) {
    try {
      const result = await this.usuariosService.update(+id, updateUsuarioDto, usuario);
      if (!result) {
        throw new NotFoundException('Usuario no encontrado.');
      }
      response.status(HttpStatus.OK).json({ success: true, usuario: result, message: 'Usuario actualizado correctamente' });
    } catch (error) {
      throw new BadRequestException('Datos inválidos al actualizar el usuario.');
    }
  }

  @Delete(':id')
  @Roles(Rol.SUPERADMIN)
  @ApiOperation({ summary: 'Eliminar un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente.' })
  @ApiResponse({ status: 401, description: 'No estás autenticado.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para realizar esta acción.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Usuario() usuario: UpdateUsuarioDto,
    @Res() response: Response
  ) {
    const result = await this.usuariosService.remove(+id, usuario);
    if (!result) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    response.status(HttpStatus.OK).json({ success: true, usuario: result, message: 'Usuario eliminado correctamente' });
  }
}
