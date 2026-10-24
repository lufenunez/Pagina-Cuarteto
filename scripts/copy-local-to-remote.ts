// Copia canciones y conciertos desde local.db a la base remota (Turso), manteniendo los mismos ids.
// Solo funciona si la base remota está vacía, para no pisar datos reales por accidente.
//   npm run db:copy-to-remote      (lee la base remota desde .env.turso)
import { createClient } from "@libsql/client";
import { config } from "dotenv";

config({ path: ".env.turso" });

const TABLES = ["songs", "concerts"];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url?.startsWith("libsql://")) throw new Error("Falta DATABASE_URL de Turso en .env.turso");

  const local = createClient({ url: "file:local.db" });
  const remote = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });

  for (const table of TABLES) {
    const { rows: count } = await remote.execute(`select count(*) as n from ${table}`);
    if (Number(count[0].n) > 0) throw new Error(`La tabla "${table}" remota ya tiene datos; no se copió nada.`);
  }

  for (const table of TABLES) {
    const { rows, columns } = await local.execute(`select * from ${table}`);
    const placeholders = columns.map(() => "?").join(", ");
    await remote.batch(
      rows.map((row) => ({
        sql: `insert into ${table} (${columns.map((c) => `"${c}"`).join(", ")}) values (${placeholders})`,
        args: columns.map((c) => row[c]),
      })),
      "write",
    );
    console.log(`${table}: ${rows.length} filas copiadas`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
