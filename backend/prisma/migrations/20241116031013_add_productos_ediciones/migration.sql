-- AlterTable
ALTER TABLE `ediciones` ADD COLUMN `productoId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Ediciones` ADD CONSTRAINT `Ediciones_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
