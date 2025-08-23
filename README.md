# Dactilografía - Frontend

Aplicación web para práctica de dactilografía desarrollada con Next.js 15, TypeScript y Tailwind CSS.

## Características

- 🎯 Práctica de dactilografía con textos reales
- 📊 Seguimiento de progreso y estadísticas
- 🏆 Sistema de logros y recompensas
- 👤 Autenticación con NextAuth.js
- 📱 Diseño responsive y moderno
- ⚡ Optimizado con Turbopack

## Tecnologías

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Autenticación**: NextAuth.js
- **Base de datos**: PostgreSQL con Prisma
- **Deployment**: Vercel

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   ```bash
   cp .env.example .env.local
   ```
4. Ejecuta las migraciones de Prisma:
   ```bash
   npx prisma migrate dev
   ```
5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo con Turbopack
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
│   ├── api/            # API routes
│   ├── components/     # Componentes reutilizables
│   └── ...
├── components/         # Componentes adicionales
└── ...
```

## Variables de Entorno

### Desarrollo local (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Producción (Vercel):
```
NEXT_PUBLIC_API_URL=https://dactilo-backend.vercel.app
```

### NextAuth (opcional):
- `NEXTAUTH_SECRET` - Secreto para NextAuth.js
- `NEXTAUTH_URL` - URL de la aplicación

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request
