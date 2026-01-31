"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

// Schemas with French error messages
const emailSchema = z.string().email("Adresse email invalide");
const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caracteres");

const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const magicLinkSchema = z.object({
  email: emailSchema,
});

const resetPasswordSchema = z.object({
  email: emailSchema,
});

const updatePasswordSchema = z.object({
  password: passwordSchema,
});

// Get the site URL for redirects
function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000"
  );
}

export type AuthState = {
  error?: string;
  success?: string;
};

/**
 * Sign up with email and password
 */
export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = signUpSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const supabase = await createClient();
  const siteUrl = getSiteUrl();

  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    // Map Supabase error messages to French
    if (error.message.includes("already registered")) {
      return { error: "Cette adresse email est deja utilisee" };
    }
    if (error.message.includes("Invalid email")) {
      return { error: "Adresse email invalide" };
    }
    if (error.message.includes("Password")) {
      return { error: "Le mot de passe ne respecte pas les criteres de securite" };
    }
    return { error: "Erreur lors de l'inscription. Veuillez reessayer." };
  }

  return {
    success:
      "Inscription reussie ! Verifiez votre email pour confirmer votre compte.",
  };
}

/**
 * Sign in with email and password
 */
export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = signInSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Email ou mot de passe incorrect" };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Veuillez confirmer votre email avant de vous connecter" };
    }
    return { error: "Erreur lors de la connexion. Veuillez reessayer." };
  }

  redirect("/dashboard");
}

/**
 * Sign in with magic link (OTP via email)
 */
export async function signInWithOtp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    email: formData.get("email") as string,
  };

  const result = magicLinkSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const supabase = await createClient();
  const siteUrl = getSiteUrl();

  const { error } = await supabase.auth.signInWithOtp({
    email: result.data.email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    if (error.message.includes("rate limit")) {
      return {
        error: "Trop de tentatives. Veuillez patienter quelques minutes.",
      };
    }
    return { error: "Erreur lors de l'envoi du lien. Veuillez reessayer." };
  }

  return {
    success: "Un lien de connexion a ete envoye a votre adresse email.",
  };
}

/**
 * Request password reset email
 */
export async function resetPassword(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    email: formData.get("email") as string,
  };

  const result = resetPasswordSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const supabase = await createClient();
  const siteUrl = getSiteUrl();

  const { error } = await supabase.auth.resetPasswordForEmail(result.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/update-password`,
  });

  if (error) {
    if (error.message.includes("rate limit")) {
      return {
        error: "Trop de tentatives. Veuillez patienter quelques minutes.",
      };
    }
    return { error: "Erreur lors de l'envoi. Veuillez reessayer." };
  }

  return {
    success:
      "Si un compte existe avec cette adresse, vous recevrez un email de reinitialisation.",
  };
}

/**
 * Update password (after reset)
 */
export async function updatePassword(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    password: formData.get("password") as string,
  };

  const result = updatePasswordSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: result.data.password,
  });

  if (error) {
    if (error.message.includes("same")) {
      return {
        error: "Le nouveau mot de passe doit etre different de l'ancien",
      };
    }
    return { error: "Erreur lors de la mise a jour. Veuillez reessayer." };
  }

  redirect("/dashboard");
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
