import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: {
    label: "Nouveau",
    className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  },
  contacted: {
    label: "Contacte",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
  },
  qualified: {
    label: "Qualifie",
    className: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  },
  converted: {
    label: "Converti",
    className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  },
  lost: {
    label: "Perdu",
    className: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800",
  },
};

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.new;

  return (
    <Badge className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
