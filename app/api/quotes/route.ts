import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { quotes } from "../../../db/schema";

function formatDate(value: string) {
  const date = new Date(value.endsWith("Z") ? value : `${value}Z`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }).format(date);
}

function output(row: typeof quotes.$inferSelect) {
  return { ...row, updatedAt: formatDate(row.updatedAt) };
}

export async function GET() {
  try {
    const db = getDb();
    const rows = await db.select().from(quotes).orderBy(desc(quotes.id)).limit(50);
    return Response.json({ quotes: rows.map(output) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể tải báo giá";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const customer = String(body.customer || "").trim();
    const project = String(body.project || "").trim();
    const capacity = Number(body.capacity), stops = Number(body.stops), value = Number(body.value);
    if (!customer || !project || capacity < 200 || stops < 2 || value <= 0) {
      return Response.json({ error: "Vui lòng nhập đủ khách hàng, công trình và cấu hình thang." }, { status: 400 });
    }
    const suffix = `${Date.now()}`.slice(-6);
    const code = `BG-${new Date().getUTCFullYear().toString().slice(-2)}${String(new Date().getUTCMonth() + 1).padStart(2, "0")}-${suffix}`;
    const db = getDb();
    const [row] = await db.insert(quotes).values({
      code, customer, project, capacity, stops, value,
      contact: String(body.contact || "").trim(), phone: String(body.phone || "").trim(), address: String(body.address || "").trim(),
      liftType: String(body.liftType || "Thang gia đình"), brand: String(body.brand || "").trim(), speed: Number(body.speed) || 1,
      quantity: Math.max(1, Number(body.quantity) || 1), unitPrice: Number(body.unitPrice) || value,
      discount: Number(body.discount) || 0, vat: Number(body.vat) || 0, validityDays: Math.max(1, Number(body.validityDays) || 15),
    }).returning();
    return Response.json({ quote: output(row) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể lưu báo giá";
    return Response.json({ error: message }, { status: 500 });
  }
}
