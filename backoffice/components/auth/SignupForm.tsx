"use client";

import { useActionState } from "react";
import { signUp, type AuthState } from "@/app/actions/auth";
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

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#1D3557]">
            Creer un compte
          </CardTitle>
          <CardDescription>
            Inscrivez-vous pour acceder au back-office Clickresto
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
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 caracteres"
                  required
                  minLength={8}
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Retapez votre mot de passe"
                  required
                  minLength={8}
                  disabled={isPending}
                />
              </div>
              {state.error && (
                <p className="text-sm text-[#E63946]">{state.error}</p>
              )}
              {state.success && (
                <p className="text-sm text-green-600">{state.success}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-[#E63946] hover:bg-[#c41e2d] text-white"
                disabled={isPending}
              >
                {isPending ? "Inscription en cours..." : "S'inscrire"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Deja un compte ?{" "}
              <Link
                href="/auth/login"
                className="underline underline-offset-4 text-[#E63946] hover:text-[#c41e2d]"
              >
                Se connecter
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
