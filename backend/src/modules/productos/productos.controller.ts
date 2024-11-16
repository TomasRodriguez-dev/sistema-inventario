import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Res, Query, HttpStatus, NotFoundException } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Rol } from '@prisma/client';
import { PaginatorDto } from 'src/common/paginator.dto';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('inv_producto')
@ApiBearerAuth()
@Controller('inv_producto')
@UseGuards(JwtGuard, RolesGuard)
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 200, description: 'Producto creado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No estás autenticado.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para realizar esta acción.' })
  @ApiBody({
    description: 'Datos para crear un nuevo producto',
    schema: {
      example: {
        nombre: 'Producto 1',
        descripcion: 'Descripción del producto 1',
        precio: 100,
        cantidad: 10
      }
    }
  })
  async create(
    @Body() createProductoDto: CreateProductoDto,
    @Res() response: Response
  ) {
    const result = await this.productosService.create(createProductoDto);
    response.status(HttpStatus.OK).json({ success: true, producto: result, message: 'Producto creado exitosamente' });
  }

  @Get()
  @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Productos obtenidos exitosamente.' })
  @ApiResponse({ status: 401, description: 'No estás autenticado.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para realizar esta acción.' })
  async findAll(
    @Query() paginator: PaginatorDto,
    @Request() req,
    @Res() response: Response
  ) {
    const result = await this.productosService.findAll(paginator, req.user.rol);
    response.status(HttpStatus.OK).json({ success: true, productos: result.data, metadata: result.metadata, message: 'Productos obtenidos exitosamente' });
  }

  @Get(':id')
  @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No estás autenticado.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para realizar esta acción.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  async findOne(
    @Param('id') id: string,
    @Res() response: Response
  ) {
    const result = await this.productosService.findOne(+id);
    if (!result) {
      throw new NotFoundException('Producto no encontrado.');
    }
    response.status(HttpStatus.OK).json({ success: true, producto: result, message: 'Producto encontrado exitosamente' });
  }

  @Patch(':id')
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @ApiOperation({ summary: 'Actualizar un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No estás autenticado.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para realizar esta acción.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  async update(
    @Param('id') id: string, 
    @Body() updateProductoDto: UpdateProductoDto, 
    @Request() req,
    @Res() response: Response
  ) {
    const result = await this.productosService.update(+id, updateProductoDto, req.user);
    response.status(HttpStatus.OK).json({ success: true, producto: result, message: 'Producto actualizado exitosamente' });
  }

  @Delete(':id')
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @ApiOperation({ summary: 'Eliminar un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No estás autenticado.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para realizar esta acción.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  async remove(
    @Param('id') id: string, 
    @Request() req,
    @Res() response: Response
  ) {
    const result = await this.productosService.remove(+id, { id: req.user.id });
    response.status(HttpStatus.OK).json({ success: true, producto: result, message: 'Producto eliminado exitosamente' });
  }
}
