import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginatorDto } from 'src/common/paginator.dto';
import { CreateEdicionesDto } from 'src/ediciones/dto/create-ediciones.dto';
import { UpdateUsuarioDto } from '../usuarios/dto/update-usuario.dto';
import { Rol } from '@prisma/client';

@Injectable()
export class ProductosService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  /**
   * Crea un nuevo producto
   * @param createProductoDto 
   * @returns 
   */
  async create(createProductoDto: CreateProductoDto) {
    const { nombre, descripcion, precio, cantidad } = createProductoDto;
    const newProducto = await this.prisma.producto.create({
      data: { 
        nombre, 
        descripcion, 
        precio, 
        cantidad 
      }
    });
    return newProducto;
  }

  /**
   * Obtiene todos los productos
   * @param paginator 
   * @param rol 
   * @returns 
   */
  async findAll(paginator: PaginatorDto, rol: Rol) {
    const { page, perPage } = paginator || {};
    let metadata = {};
    const totalPages = await this.prisma.producto.count({
      where: rol === Rol.USER ? { activo: true } : undefined
    });
    const lastPages = Math.ceil(totalPages / (perPage || 10));
    if (page && perPage) 
      metadata = {
        page,
        totalPages, 
        lastPages 
      };
    const data = await this.prisma.producto.findMany({
      where: rol === Rol.USER ? { activo: true } : undefined,
      skip: page ? (page - 1) * perPage : undefined,
      take: perPage ? perPage : undefined,
    });
    return { 
      data, 
      metadata: metadata ? metadata : { totalRecords: totalPages } 
    };
  }

  /**
   * Obtiene un producto por su ID
   * @param id 
   * @returns 
   */
  async findOne(id: number) {
    const producto = await this.prisma.producto.findFirst({ 
      where: { id, activo: true } 
    });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  /**
   * Actualiza un producto
   * @param id 
   * @param updateProductoDto 
   * @param usuario 
   * @returns 
   */
  async update(
    id: number, 
    updateProductoDto: UpdateProductoDto, 
    usuario: UpdateUsuarioDto
  ) {
    const { id: __, ...data } = updateProductoDto;
    const edicion: CreateEdicionesDto = {
      descripcion: 'Editado',
      usuarioEditorId: usuario.id
    };
    const result = await this.prisma.producto.update({
      where: { id },
      data: {
        ...data,
        ediciones: {
          create: edicion
        }
      }
    });
    return result;
  }

  /**
   * Elimina un producto
   * @param id 
   * @param usuario 
   * @returns 
   */
  async remove(
    id: number, 
    usuario: { id: number }
  ) {
    const edicion: CreateEdicionesDto = {
      descripcion: 'Eliminado',
      usuarioEditorId: usuario.id
    };
    const result = await this.prisma.producto.update({
      where: { id },
      data: {
        activo: false,
        ediciones: {
          create: edicion
        }
      }
    });
    return result;
  }
}
