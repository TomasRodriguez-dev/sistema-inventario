import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const superUsuario = await prisma.usuario.upsert({
        where: { correo: 'superadmin@gmail.com' },
        update: {},
        create: {
            nombre: 'SuperUsuario',
            correo: 'superadmin@gmail.com',
            contrasenia: '12345678',
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
