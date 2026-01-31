"use client";

import { useActionState } from "react";
import { resetPassword, type AuthState } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const initialState: AuthState = {};

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, isPending] = useActionState(
    resetPassword,
    initialState
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {state.success ? (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#1D3557]">
              Verifiez vos emails
            </CardTitle>
            <CardDescription>
              Instructions de reinitialisation envoyees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {state.success}
            </p>
            <Link
              href="/auth/login"
              className="block text-center text-sm underline underline-offset-4 text-[#E63946] hover:text-[#c41e2d]"
            >
              Retour a la connexion
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#1D3557]">
              Mot de passe oublie
            </CardTitle>
            <CardDescription>
              Entrez votre email pour recevoir un lien de reinitialisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre@email.fr"
                    required
                    disabled={isPending}
                  />
                </div>
                {state.error && (
                  <p className="text-sm text-[#E63946]">{state.error}</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#E63946] hover:bg-[#c41e2d] text-white"
                  disabled={isPending}
                >
                  {isPending ? "Envoi en cours..." : "Envoyer le lien"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4 text-[#E63946] hover:text-[#c41e2d]"
                >
                  Retour a la connexion
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
