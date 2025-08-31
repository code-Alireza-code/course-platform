import { UserRole } from "@/drizzle/schema";

export function canAccessAdminPages(role: UserRole | undefined) {
  return role === "admin";
}
