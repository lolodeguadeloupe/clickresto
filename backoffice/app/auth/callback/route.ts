import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Auth callback handler for:
 * - Email confirmation (signup)
 * - Magic link login (OTP)
 * - Password reset recovery
 *
 * This route handles the redirect from Supabase auth emails.
 * It verifies the OTP token and redirects to the appropriate page.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  // Get parameters from URL
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  // Handle PKCE flow (code exchange)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Code exchange error:", error.message);
      return NextResponse.redirect(
        `${origin}/auth/error?error=${encodeURIComponent("Lien invalide ou expire. Veuillez reessayer.")}`
      );
    }
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Handle token hash flow (magic link, password reset)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      console.error("OTP verification error:", error.message);

      // More specific error messages in French
      let errorMessage = "Lien invalide ou expire. Veuillez reessayer.";
      if (error.message.includes("expired")) {
        errorMessage = "Ce lien a expire. Veuillez en demander un nouveau.";
      } else if (error.message.includes("already")) {
        errorMessage = "Ce lien a deja ete utilise. Veuillez en demander un nouveau.";
      }

      return NextResponse.redirect(
        `${origin}/auth/error?error=${encodeURIComponent(errorMessage)}`
      );
    }

    // For password recovery, redirect to update-password page
    if (type === "recovery") {
      return NextResponse.redirect(`${origin}/auth/update-password`);
    }

    // For email confirmation or magic link, redirect to the specified next URL
    return NextResponse.redirect(`${origin}${next}`);
  }

  // No valid auth parameters provided
  return NextResponse.redirect(
    `${origin}/auth/error?error=${encodeURIComponent("Parametres d'authentification manquants.")}`
  );
}
