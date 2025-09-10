import { ProductTable, UserRole } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export function canCreateProduct({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canDeleteProduct({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canUpdateProduct({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export const WherePublicProducts = eq(ProductTable.status, "public");
