import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  jsonb,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { UserTable } from "./user";
import { ProductTable } from "./product";

export const PurchaseTable = pgTable("purchases", {
  id,
  pricePaidInCents: integer().notNull(),
  productDetails: jsonb().notNull().$type<{
    name: string;
    description: string;
    imageUrl: string;
  }>(),
  userId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "restrict" }),
  productId: uuid()
    .notNull()
    .references(() => ProductTable.id, { onDelete: "restrict" }),
  stripeSessionId: text().notNull().unique(),
  refundedAt: timestamp({ withTimezone: true }),
  createdAt,
  updatedAt,
});

export const PurchaseTableRelationships = relations(
  PurchaseTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [PurchaseTable.userId],
      references: [UserTable.id],
    }),
    product: one(ProductTable, {
      fields: [PurchaseTable.productId],
      references: [ProductTable.id],
    }),
  })
);
