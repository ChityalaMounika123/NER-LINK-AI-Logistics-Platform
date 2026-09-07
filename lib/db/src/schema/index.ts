import {
  boolean,
  real,
  text,
  timestamp,
  pgTable,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const vehiclesTable = pgTable("ner_link_vehicles", {
  id: text("id").primaryKey(),
  registration: text("registration").notNull(),
  driver: text("driver").notNull(),
  cargo: text("cargo").notNull(),
  cargoPriority: text("cargo_priority").notNull(),
  route: text("route").notNull(),
  status: text("status").notNull(),
  eta: text("eta").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  riskScore: real("risk_score").notNull(),
  lastSeen: timestamp("last_seen", { withTimezone: true }).notNull(),
  sourceKind: text("source_kind").notNull(),
  sourceLabel: text("source_label").notNull(),
});

export const incidentsTable = pgTable("ner_link_incidents", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  severity: text("severity").notNull(),
  location: text("location").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  reportedBy: text("reported_by").notNull(),
  reportedAt: timestamp("reported_at", { withTimezone: true }).notNull(),
  status: text("status").notNull(),
  description: text("description").notNull(),
  sourceKind: text("source_kind").notNull(),
  sourceLabel: text("source_label").notNull(),
  acknowledged: boolean("acknowledged").notNull().default(false),
});

export const insertVehicleSchema = createInsertSchema(vehiclesTable);
export const insertIncidentSchema = createInsertSchema(incidentsTable);

export type VehicleRecord = z.infer<typeof insertVehicleSchema>;
export type IncidentRecord = z.infer<typeof insertIncidentSchema>;