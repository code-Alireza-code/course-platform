import { UserRole } from "@/drizzle/schema";

export function canCreateProduct({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canDeleteProduct({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canUpdateProduct({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}
