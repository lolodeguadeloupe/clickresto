"use client";

import { useState, useActionState } from "react";
import { signIn, signInWithOtp, type AuthState } from "@/app/actions/auth";
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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [passwordState, passwordAction, isPasswordPending] = useActionState(
    signIn,
    initialState
  );
  const [magicLinkState, magicLinkAction, isMagicLinkPending] = useActionState(
    signInWithOtp,
    initialState
  );

  const state = useMagicLink ? magicLinkState : passwordState;
  const isPending = useMagicLink ? isMagicLinkPending : isPasswordPending;
  const formAction = useMagicLink ? magicLinkAction : passwordAction;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#1D3557]">Connexion</CardTitle>
          <CardDescription>
            {useMagicLink
              ? "Recevez un lien de connexion par email"
              : "Entrez vos identifiants pour acceder a votre compte"}
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
              {!useMagicLink && (
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-[#E63946]"
                    >
                      Mot de passe oublie ?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    disabled={isPending}
                  />
                </div>
              )}
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
                {isPending
                  ? "Connexion en cours..."
                  : useMagicLink
                    ? "Envoyer le lien"
                    : "Se connecter"}
              </Button>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <button
                type="button"
                onClick={() => setUseMagicLink(!useMagicLink)}
                className="text-sm text-center text-[#457B9D] underline-offset-4 hover:underline"
              >
                {useMagicLink
                  ? "Utiliser email et mot de passe"
                  : "Se connecter avec un lien magique"}
              </button>
              <div className="text-center text-sm">
                Pas encore de compte ?{" "}
                <Link
                  href="/auth/sign-up"
                  className="underline underline-offset-4 text-[#E63946] hover:text-[#c41e2d]"
                >
                  Creer un compte
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
