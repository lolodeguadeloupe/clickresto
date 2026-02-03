import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Inscription reussie | Clickresto",
  description: "Verifiez votre email pour confirmer votre compte",
};

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#1D3557]">
                Merci pour votre inscription !
              </CardTitle>
              <CardDescription>
                Verifiez votre email pour confirmer
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Votre inscription a ete enregistree avec succes. Veuillez
                consulter votre boite email pour confirmer votre compte avant de
                vous connecter.
              </p>
              <Link
                href="/auth/login"
                className="text-sm underline underline-offset-4 text-[#E63946] hover:text-[#c41e2d]"
              >
                Retour a la connexion
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
