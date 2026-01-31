import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Erreur | Clickresto",
  description: "Une erreur s'est produite",
};

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      {params?.error ? (
        <p className="text-sm text-muted-foreground">{params.error}</p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Une erreur inattendue s'est produite.
        </p>
      )}
    </>
  );
}

export default function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#1D3557]">
                Oups ! Une erreur s'est produite
              </CardTitle>
              <CardDescription>
                Nous n'avons pas pu completer votre demande
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Suspense>
                <ErrorContent searchParams={searchParams} />
              </Suspense>
              <Link
                href="/auth/login"
                className="mt-4 inline-block text-sm underline underline-offset-4 text-[#E63946] hover:text-[#c41e2d]"
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
