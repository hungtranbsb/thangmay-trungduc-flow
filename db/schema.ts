import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const quotes = sqliteTable("quotes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  customer: text("customer").notNull(),
  contact: text("contact").notNull().default(""),
  phone: text("phone").notNull().default(""),
  project: text("project").notNull(),
  address: text("address").notNull().default(""),
  liftType: text("lift_type").notNull(),
  brand: text("brand").notNull().default(""),
  capacity: integer("capacity").notNull(),
  stops: integer("stops").notNull(),
  speed: real("speed").notNull().default(1),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: integer("unit_price").notNull(),
  discount: real("discount").notNull().default(0),
  vat: real("vat").notNull().default(8),
  value: integer("value").notNull(),
  validityDays: integer("validity_days").notNull().default(15),
  status: text("status").notNull().default("Bản nháp"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contracts = sqliteTable("contracts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  quoteId: integer("quote_id").references(() => quotes.id),
  customer: text("customer").notNull(),
  project: text("project").notNull(),
  installationAddress: text("installation_address").notNull().default(""),
  value: integer("value").notNull(),
  signedDate: text("signed_date").notNull(),
  deliveryDays: integer("delivery_days").notNull().default(50),
  installationDays: integer("installation_days").notNull().default(20),
  handoverDays: integer("handover_days").notNull().default(10),
  warrantyMonths: integer("warranty_months").notNull().default(18),
  maintenanceMonths: integer("maintenance_months").notNull().default(18),
  stage: text("stage").notNull().default("Chuẩn bị"),
  status: text("status").notNull().default("Đang thực hiện"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const paymentSchedules = sqliteTable("payment_schedules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contractId: integer("contract_id").notNull().references(() => contracts.id),
  installment: integer("installment").notNull(),
  milestone: text("milestone").notNull(),
  dueDate: text("due_date").notNull(),
  amount: integer("amount").notNull(),
  paidAmount: integer("paid_amount").notNull().default(0),
  status: text("status").notNull().default("Chưa thu"),
});

export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contractId: integer("contract_id").notNull().references(() => contracts.id),
  scheduleId: integer("schedule_id").references(() => paymentSchedules.id),
  amount: integer("amount").notNull(),
  paidAt: text("paid_at").notNull(),
  method: text("method").notNull().default("Chuyển khoản"),
  reference: text("reference").notNull().default(""),
  confirmedBy: text("confirmed_by").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
