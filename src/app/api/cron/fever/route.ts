import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { syncFever } from "@/lib/fever";

export const dynamic = "force-dynamic";

// Vercel llama a esta ruta una vez al día (ver vercel.json) con el header "Authorization: Bearer <CRON_SECRET>".
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const result = await syncFever();
  revalidatePath("/", "layout");
  return NextResponse.json(result);
}
