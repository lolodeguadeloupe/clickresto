import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { LeadsTable, type Lead } from "@/components/dashboard/LeadsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, TrendingUp, Clock, Loader2 } from "lucide-react";

async function getLeads(): Promise<Lead[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
    return [];
  }

  return data || [];
}

function calculateStats(leads: Lead[]) {
  const total = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const converted = leads.filter((l) => l.status === "converted").length;
  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

  // Leads from last 7 days
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const recentLeads = leads.filter(
    (l) => new Date(l.created_at) > weekAgo
  ).length;

  return { total, newLeads, conversionRate, recentLeads };
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <span className="ml-2 text-muted-foreground">Chargement...</span>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-12 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface StatsCardsProps {
  stats: ReturnType<typeof calculateStats>;
}

function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total leads
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Nouveaux leads
          </CardTitle>
          <UserPlus className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.newLeads}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Taux de conversion
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.conversionRate}%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Cette semaine
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.recentLeads}</div>
        </CardContent>
      </Card>
    </div>
  );
}

async function LeadsContent() {
  // Verify admin role - redirects to /dashboard if not admin
  await requireAdmin();

  const leads = await getLeads();
  const stats = calculateStats(leads);

  return (
    <>
      <StatsCards stats={stats} />

      {/* Leads Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Tous les leads</h2>
        <LeadsTable leads={leads} />
      </div>
    </>
  );
}

export default function AdminLeadsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leads</h1>
        <p className="text-muted-foreground mt-1">
          Gerez les demandes de demo et suivez les conversions
        </p>
      </div>

      <Suspense fallback={
        <>
          <StatsSkeleton />
          <LoadingState />
        </>
      }>
        <LeadsContent />
      </Suspense>
    </div>
  );
}
