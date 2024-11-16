/*
  Warnings:

  - You are about to drop the column `creadoPorId` on the `producto` table. All the data in the column will be lost.
  - You are about to drop the column `editadoPorId` on the `producto` table. All the data in the column will be lost.
  - You are about to drop the column `eliminadoPorId` on the `producto` table. All the data in the column will be lost.
  - You are about to drop the column `fechaCreacion` on the `producto` table. All the data in the column will be lost.
  - You are about to drop the column `fechaEdicion` on the `producto` table. All the data in the column will be lost.
  - You are about to drop the column `fechaEliminacion` on the `producto` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `producto` DROP FOREIGN KEY `Producto_creadoPorId_fkey`;

-- DropForeignKey
ALTER TABLE `producto` DROP FOREIGN KEY `Producto_editadoPorId_fkey`;

-- DropForeignKey
ALTER TABLE `producto` DROP FOREIGN KEY `Producto_eliminadoPorId_fkey`;

-- AlterTable
ALTER TABLE `producto` DROP COLUMN `creadoPorId`,
    DROP COLUMN `editadoPorId`,
    DROP COLUMN `eliminadoPorId`,
    DROP COLUMN `fechaCreacion`,
    DROP COLUMN `fechaEdicion`,
    DROP COLUMN `fechaEliminacion`;
