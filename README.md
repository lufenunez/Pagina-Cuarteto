# Antiguas Vanguardias

Página del cuarteto de cuerdas: próximas fechas con link a entradas, repertorio (con PDF siempre actualizado)
y un área interna para que el cuarteto administre conciertos y canciones.

## Correr en tu computador

```bash
npm install
cp .env.example .env.local   # y completa ADMIN_PASSWORD y SESSION_SECRET
npm run db:push              # crea las tablas en local.db
npm run db:seed              # carga el repertorio inicial (agrega -- --demo para conciertos de ejemplo)
npm run dev
```

- Sitio: http://localhost:3000
- Área interna: http://localhost:3000/admin (contraseña = `ADMIN_PASSWORD`). En producción se entra por la ruta secreta `ADMIN_PATH`; `/admin` responde "no encontrado" y no hay ningún link público.
- Ver/editar la base de datos directamente: `npm run db:studio`
- Traer los Candlelight desde Fever: `npm run fever:sync` (o el botón "Traer fechas de Fever" en /admin)

## Fechas de Candlelight automáticas

Todos los Candlelight de Concepción, Chillán y Puerto Montt los toca el cuarteto, así que se importan solos desde Fever
(`src/lib/fever.ts`). En Vercel corre una vez al día (`vercel.json`). Solo actualiza fecha, hora, lugar y link:
si cambian el título o lo marcan como privado en /admin, eso se respeta.

## Publicar (gratis)

1. **Base de datos:** crea una cuenta en [turso.tech](https://turso.tech), crea una base y copia la URL (`libsql://...`) y un token.
2. Con esos valores en `.env.local`, corre `npm run db:push` y `npm run db:seed` para preparar la base de producción.
3. **Hosting:** importa este repo en [vercel.com](https://vercel.com) y agrega las variables
   `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `CRON_SECRET` y `ADMIN_PATH`.
4. Cada `git push` a `main` publica la nueva versión automáticamente.

## Pendiente

- Correo del cuarteto en `src/lib/site.ts`.
- Bios cortas de cada integrante.
- Dominio propio.
