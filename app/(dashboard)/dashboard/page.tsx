import { Suspense } from "react";
import { requireAuth, type User } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, UserPlus, ArrowRight, Loader2 } from "lucide-react";

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

async function DashboardContent() {
  const user = await requireAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bienvenue{user.role === "admin" ? " sur le backoffice" : ""}
        </h1>
        <p className="text-muted-foreground mt-1">
          {user.role === "admin"
            ? "Gerez vos leads et suivez les performances de Clickresto."
            : "Suivez vos parrainages et vos commissions."}
        </p>
      </div>

      {/* Quick Actions based on role */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {user.role === "admin" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#E63946]" />
                Leads
              </CardTitle>
              <CardDescription>
                Consultez et gerez les demandes de demo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/leads">
                <Button className="w-full bg-[#E63946] hover:bg-[#E63946]/90">
                  Voir les leads
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {user.role === "affiliate" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-[#1D3557]" />
                  Mes parrainages
                </CardTitle>
                <CardDescription>
                  Suivez vos restaurants parraines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/affiliate/referrals">
                  <Button className="w-full bg-[#1D3557] hover:bg-[#1D3557]/90">
                    Voir mes parrainages
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-muted-foreground">
                  Bientot disponible
                </CardTitle>
                <CardDescription>
                  Plus de fonctionnalites pour les affilies arrivent bientot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Suivi des commissions, lien de parrainage personnalise, et plus encore.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Info Banner for Affiliates */}
      {user.role === "affiliate" && (
        <Card className="bg-[#F1FAEE] border-[#1D3557]/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-[#1D3557]/10">
                <UserPlus className="h-6 w-6 text-[#1D3557]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1D3557]">
                  Programme de parrainage
                </h3>
                <p className="text-sm text-[#1D3557]/80 mt-1">
                  Gagnez des commissions en parrainant des restaurants.
                  Partagez votre lien unique et suivez vos conversions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <DashboardContent />
    </Suspense>
  );
}
