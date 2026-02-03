"use client";

import { LogoutButton } from "@/components/logout-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/lib/auth";

interface HeaderProps {
  email: string;
  role: UserRole;
}

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  affiliate: "Affilie",
};

const roleColors: Record<UserRole, string> = {
  admin: "bg-[#E63946]/10 text-[#E63946] border-[#E63946]/20",
  affiliate: "bg-[#1D3557]/10 text-[#1D3557] border-[#1D3557]/20",
};

export function Header({ email, role }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground">
          Backoffice
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />

        <div className="flex items-center gap-3">
          <Badge className={roleColors[role]}>
            {roleLabels[role]}
          </Badge>
          <span className="text-sm text-muted-foreground">{email}</span>
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}
