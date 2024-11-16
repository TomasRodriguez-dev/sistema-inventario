import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { PaginatorDto } from 'src/common/paginator.dto';
import { CreateEdicionesDto } from 'src/ediciones/dto/create-ediciones.dto';
import { Rol } from '@prisma/client';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const { nombre, correo, contrasenia, rol, disponible } = createUsuarioDto;
    const hashPassword = await this.authService.hashContrasenia(contrasenia);
    const newUsuario = await this.prisma.usuario.create({
      data: { 
        nombre, 
        correo, 
        contrasenia: hashPassword, 
        rol: rol as Rol || 'USER',
        disponible: disponible !== undefined ? disponible : true
      }
    });
    delete newUsuario['contrasenia'];
    return newUsuario;
  }

  async findAll(paginator: PaginatorDto) {
    const { page, perPage } = paginator || {};
    let metadata = {};
    const totalPages = await this.prisma.usuario.count();
    const lastPages = Math.ceil(totalPages / (perPage || 10));
    if (page && perPage) 
      metadata = {
        page,
        totalPages, 
        lastPages 
      };
    const data = await this.prisma.usuario.findMany({
      skip: page ? (page - 1) * perPage : undefined,
      take: perPage ? perPage : undefined,
    });
    data.forEach(usuario => delete usuario['contrasenia']);
    return { 
      data, 
      metadata: metadata ? metadata : { totalRecords: totalPages } 
    };
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findFirst({ 
      where: { id, disponible: true } 
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    delete usuario['contrasenia'];
    return usuario;
  }

  async update(
    id: number, 
    updateUsuarioDto: UpdateUsuarioDto,
    usuario: UpdateUsuarioDto
  ) {
    const { id: __, rol, ...data} = updateUsuarioDto;
    const edicion: CreateEdicionesDto = {
      descripcion: 'Editado',
      usuarioEditorId: usuario.id
    };
    const result = await this.prisma.usuario.update({
      where: { id },
      data: {
        ...data,
        rol: rol as Rol,
        ediciones: {
          create: edicion
        },
      },
    });
    delete result['contrasenia'];
    return result;
  }

  async remove(
    id: number,
    usuario: UpdateUsuarioDto
  ) {
    const edicion: CreateEdicionesDto = {
      descripcion: 'Eliminado',
      usuarioEditorId: usuario.id
    };
    const result = await this.prisma.usuario.update({
      where: { id },
      data: {
        disponible: false,
        ediciones: {
          create: edicion
        }
      }
    });
    delete result['contrasenia'];
    return result;
  }
}
