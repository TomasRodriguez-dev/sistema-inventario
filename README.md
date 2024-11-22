# Guía de Instalación del Proyecto

Instrucciones para instalar las dependencias y arrancar tanto el backend como el frontend de este proyecto.

## Instalación

### Backend

1. Navega al directorio del backend:

   ```bash
   cd backend
   ```

2. Instala las dependencias necesarias:

   ```bash
   npm install
   ```

3. Ejecuta las migraciones de Prisma para configurar la base de datos:

   ```bash
   npx prisma migrate dev --name init
   ```

4. Crea el usuario SuperUsuario con Prisma:

   ```bash
   npx prisma db seed
   ```

   Asegúrate de que tu archivo de seed de Prisma (`prisma/seed.js` o `prisma/seed.ts`) contenga el código para crear el usuario SuperUsuario con los siguientes detalles:
   - Nombre: SuperUsuario
   - Correo: superadmin@gmail.com
   - Contraseña: 12345678
   - Rol: SUPERADMIN

5. Arranca el servidor del backend:

   ```bash
   npm start
   ```

   Esto iniciará el servidor en el puerto especificado en tu configuración (por defecto, suele ser el puerto 3000).

### Frontend

1. Navega al directorio del frontend:

   ```bash
   cd frontend
   ```

2. Instala las dependencias necesarias:

   ```bash
   npm install
   ```

3. Arranca la aplicación del frontend:

   ```bash
   npm start
   ```

   Esto abrirá la aplicación en tu navegador predeterminado, generalmente en `http://localhost:3000`. Pero al tener el servidor en el 3000 buscará un puerto alternativo.

## Notas Adicionales

- Asegúrate de que el backend esté corriendo antes de iniciar el frontend para evitar problemas de conexión.
- **SuperUsuario**: El usuario con el nombre de SuperUsuario (correo: superadmin@gmail.com, contraseña: 12345678) es el encargado de poder crear usuarios y asignar el rol de usuario común o admin.
- **Roles y Permisos**:
  - **SUPERADMIN**: Puede crear y gestionar usuarios, y tiene acceso completo al CRUD de productos.
  - **ADMIN**: Puede gestionar el CRUD de productos.
  - **Usuario Común**: Solo puede ver el listado de productos.
