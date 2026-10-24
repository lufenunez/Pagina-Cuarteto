// Trae los conciertos Candlelight desde Fever a la base de datos configurada en .env.local.
//   npm run fever:sync
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  // Import dinámico: el cliente de la base debe crearse después de cargar .env.local.
  const { syncFever } = await import("../src/lib/fever");
  const { added, updated, errors } = await syncFever();
  for (const a of added) console.log(`+ ${a}`);
  for (const u of updated) console.log(`~ ${u}`);
  for (const e of errors) console.error(`! ${e}`);
  console.log(`Nuevos: ${added.length} · Actualizados: ${updated.length} · Errores: ${errors.length}`);
}

main().then(() => process.exit(0));
