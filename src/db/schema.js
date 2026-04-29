// src/db/schema.js

import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

// ENUM: match_status
export const matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "live",
  "finished",
]);

// TABLE: matches
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),

  sport: text("sport").notNull(),

  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),

  status: matchStatusEnum("status").notNull(),

  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),

  homeScore: integer("home_score").default(0),
  awayScore: integer("away_score").default(0),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// TABLE: commentary
export const commentary = pgTable("commentary", {
  id: serial("id").primaryKey(),

  matchId: integer("match_id")
    .notNull()
    .references(() => matches.id, { onDelete: "cascade" }),

  minute: integer("minute"),
  sequence: integer("sequence"),

  period: text("period"), // ex: "1H", "2H", "ET"
  eventType: text("event_type"), // ex: "goal", "foul"

  actor: text("actor"), // jogador
  team: text("team"),

  message: text("message"),

  metadata: jsonb("metadata"), // dados extras (ex: posição, VAR, etc)

  tags: text("tags").array(), // ex: ["goal", "penalty"]

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
