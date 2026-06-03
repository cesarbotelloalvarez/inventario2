# Inventario Taller

Sistema web independiente para controlar inventario de materiales y herramientas del taller.

## Acceso de revisión

Mientras no exista `DATABASE_URL`, la app entra en modo revisión con datos de ejemplo.

```bash
npm install
npm run dev
```

Abre:

```text
http://localhost:3000
```

## Publicación en línea

El camino recomendado es:

- App: Vercel
- Base de datos: Neon PostgreSQL
- Dominio: GoDaddy, usando `inventario2.garagenuevetres.com.mx`

GoDaddy administra el dominio, pero la base de datos debe ser PostgreSQL externa para funcionar con Prisma.

Guía completa:

```text
docs/deploy-vercel-godaddy-neon.md
```

## Variables

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
```

## Comandos

```bash
npm run build
npm run db:deploy
npm run dev
```

## Estructura

- `prisma/schema.prisma` - modelos de artículos, trabajadores, movimientos y auditorías.
- `src/app/` - pantallas.
- `src/app/api/` - API transaccional.
- `src/lib/demo-data.ts` - datos de ejemplo para revisar sin base.
