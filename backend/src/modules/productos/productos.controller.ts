import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Res, Query, HttpStatus } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Rol } from '@prisma/client';
import { PaginatorDto } from 'src/common/paginator.dto';
import { Response } from 'express';

@Controller('inv_producto')
@UseGuards(JwtGuard, RolesGuard)
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  async create(
    @Body() createProductoDto: CreateProductoDto,
    @Res() response: Response
  ) {
    const result = await this.productosService.create(createProductoDto);
    response.status(HttpStatus.OK).json({ success: true, producto: result, message: 'Producto creado exitosamente' });
  }

  @Get()
  @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
  async findAll(
    @Query() paginator: PaginatorDto,
    @Res() response: Response
  ) {
    const result = await this.productosService.findAll(paginator);
    response.status(HttpStatus.OK).json({ success: true, productos: result.data, metadata: result.metadata, message: 'Productos obtenidos exitosamente' });
  }

  @Get(':id')
  @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
  async findOne(
    @Param('id') id: string,
    @Res() response: Response
  ) {
    const result = await this.productosService.findOne(+id);
    response.status(HttpStatus.OK).json({ success: true, producto: result, message: 'Producto encontrado exitosamente' });
  }

  @Patch(':id')
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
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
  async remove(
    @Param('id') id: string, 
    @Request() req,
    @Res() response: Response
  ) {
    const result = await this.productosService.remove(+id, { id: req.user.id });
    response.status(HttpStatus.OK).json({ success: true, producto: result, message: 'Producto eliminado exitosamente' });
  }
}
