import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type UserRole = "admin" | "affiliate";

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Get the current authenticated user from Supabase.
 * Returns null if not authenticated.
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Fetch user role from user_roles table
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email || "",
    role: (roleData?.role as UserRole) || "affiliate",
  };
}

/**
 * Get the current user's role.
 * Returns null if not authenticated.
 */
export async function getUserRole(): Promise<UserRole | null> {
  const user = await getUser();
  return user?.role || null;
}

/**
 * Require authentication. Redirects to login if not authenticated.
 * Returns the authenticated user.
 */
export async function requireAuth(): Promise<User> {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return user;
}

/**
 * Require admin role. Redirects to dashboard if not admin.
 * Returns the authenticated admin user.
 */
export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return user;
}

/**
 * Require affiliate role. Redirects to dashboard if not affiliate.
 * Returns the authenticated affiliate user.
 */
export async function requireAffiliate(): Promise<User> {
  const user = await requireAuth();

  if (user.role !== "affiliate") {
    redirect("/dashboard");
  }

  return user;
}
