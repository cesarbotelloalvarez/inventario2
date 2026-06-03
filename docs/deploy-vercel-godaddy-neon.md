# Deploy con Vercel, Neon y GoDaddy

Objetivo:

```text
https://inventario2.garagenuevetres.com.mx
```

Esta app es independiente. No comparte base de datos ni código con otros sistemas.

## 1. Crear base PostgreSQL

GoDaddy se usará para el dominio. Para la base de datos, crea una base PostgreSQL nueva en Neon.

1. Entra a Neon.
2. Crea un proyecto nuevo, por ejemplo `inventario2`.
3. Copia el connection string con SSL:

```text
postgresql://USER:PASSWORD@HOST/DB?sslmode=require
```

Ese valor será `DATABASE_URL`.

## 2. Configurar `.env` local

En este proyecto crea un archivo `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
```

No subas `.env` a GitHub.

## 3. Crear tablas

Con `DATABASE_URL` apuntando a Neon:

```bash
npm run db:deploy
```

Esto aplica la migración inicial de Prisma.

## 4. Probar local con base real

```bash
npm run dev
```

Abre:

```text
http://localhost:3000
```

Verifica:

- Dashboard carga sin modo revisión.
- Puedes crear un artículo.
- Puedes crear un trabajador.
- Puedes asignar o prestar un artículo.
- Puedes registrar una devolución.
- El historial queda guardado.

## 5. Subir a GitHub

1. Crea un repositorio nuevo para `inventario2`.
2. Sube el proyecto.
3. No subas:
   - `.env`
   - `node_modules`
   - `.next`

## 6. Importar en Vercel

1. Entra a Vercel.
2. Importa el repositorio desde GitHub.
3. Framework: Next.js.
4. Build command:

```bash
npm run build
```

## 7. Variables en Vercel

En Project Settings -> Environment Variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
```

Agrégala para Production, Preview y Development si quieres previews.

## 8. Dominio en Vercel

En Vercel -> Settings -> Domains agrega:

```text
inventario2.garagenuevetres.com.mx
```

Vercel indicará el registro DNS necesario.

## 9. DNS en GoDaddy

En GoDaddy:

1. Abre el dominio `garagenuevetres.com.mx`.
2. Entra a DNS o Administrar DNS.
3. Agrega el registro que indique Vercel. Normalmente:

```text
Tipo: CNAME
Nombre: inventario2
Valor: cname.vercel-dns.com
TTL: Default
```

No cambies `garagenuevetres.com.mx`, `www` ni el subdominio `inventario` si ya se usan.

## 10. Validar

Cuando Vercel marque el dominio como válido, abre:

```text
https://inventario2.garagenuevetres.com.mx
```

Prueba desde computadora y celular:

- Dashboard.
- Alta de artículo.
- Alta de trabajador.
- Asignación.
- Préstamo.
- Devolución.
- Historial.
- Auditoría.
