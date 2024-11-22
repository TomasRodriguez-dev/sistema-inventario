import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('12345678', 10);

    await prisma.usuario.upsert({
        where: { correo: 'superadmin@gmail.com' },
        update: {},
        create: {
            nombre: 'SuperUsuario',
            correo: 'superadmin@gmail.com',
            contrasenia: hashedPassword,
            rol: 'SUPERADMIN',
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
