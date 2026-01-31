import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { LeadsTable, type Lead } from "@/components/dashboard/LeadsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, TrendingUp, Clock } from "lucide-react";

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

export default async function AdminLeadsPage() {
  // Verify admin role - redirects to /dashboard if not admin
  await requireAdmin();

  const leads = await getLeads();
  const stats = calculateStats(leads);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leads</h1>
        <p className="text-muted-foreground mt-1">
          Gerez les demandes de demo et suivez les conversions
        </p>
      </div>

      {/* Stats Cards */}
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

      {/* Leads Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Tous les leads</h2>
        <LeadsTable leads={leads} />
      </div>
    </div>
  );
}
