import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";

export const importSources = ["manual", "csv_import", "table_import"] as const;
export type ImportSource = (typeof importSources)[number];

export const resolutionStatuses = ["unresolved", "linked"] as const;
export type ResolutionStatus = (typeof resolutionStatuses)[number];

export const stayStatuses = ["planned", "completed", "cancelled"] as const;
export type StayStatus = (typeof stayStatuses)[number];

export const timelineEntryTypes = ["staff_note"] as const;
export type TimelineEntryType = (typeof timelineEntryTypes)[number];

export const guests = sqliteTable("guests", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const reservations = sqliteTable(
  "reservations",
  {
    id: text("id").primaryKey(),
    externalReservationId: text("external_reservation_id").notNull(),
    bookerName: text("booker_name").notNull(),
    checkInDate: text("check_in_date").notNull(),
    checkOutDate: text("check_out_date").notNull(),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    guestNameKana: text("guest_name_kana"),
    guestCount: integer("guest_count"),
    roomLabel: text("room_label"),
    source: text("source"),
    bookedAt: text("booked_at"),
    notes: text("notes"),
    importSource: text("import_source").notNull().$type<ImportSource>(),
    importedAt: text("imported_at").notNull(),
    importBatchId: text("import_batch_id"),
    guestResolutionStatus: text("guest_resolution_status")
      .notNull()
      .$type<ResolutionStatus>(),
    guestId: text("guest_id").references(() => guests.id),
  },
  (t) => [
    uniqueIndex("reservations_external_id_unique").on(t.externalReservationId),
    index("reservations_guest_id_idx").on(t.guestId),
  ],
);

export const stays = sqliteTable(
  "stays",
  {
    id: text("id").primaryKey(),
    guestId: text("guest_id")
      .notNull()
      .references(() => guests.id),
    reservationId: text("reservation_id")
      .notNull()
      .references(() => reservations.id),
    checkInDate: text("check_in_date").notNull(),
    checkOutDate: text("check_out_date").notNull(),
    status: text("status").notNull().$type<StayStatus>(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [
    index("stays_guest_id_idx").on(t.guestId),
    index("stays_reservation_id_idx").on(t.reservationId),
  ],
);

export const timelineEntries = sqliteTable(
  "timeline_entries",
  {
    id: text("id").primaryKey(),
    guestId: text("guest_id")
      .notNull()
      .references(() => guests.id),
    occurredAt: text("occurred_at").notNull(),
    recordedAt: text("recorded_at").notNull(),
    entryType: text("entry_type").notNull().$type<TimelineEntryType>(),
    body: text("body").notNull(),
    createdBy: text("created_by"),
    relatedReservationId: text("related_reservation_id").references(
      () => reservations.id,
    ),
  },
  (t) => [index("timeline_guest_id_idx").on(t.guestId)],
);
