export type UserRole = "admin" | "affiliate";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "lost";

export type RequestType = "demo" | "info" | "affiliation" | "autre";

export interface UserRoleRow {
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  restaurant: string;
  request_type: RequestType;
  message: string | null;
  status: LeadStatus;
  source: string | null;
  affiliate_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadInsert {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  restaurant: string;
  request_type?: RequestType;
  message?: string | null;
  source?: string | null;
  affiliate_id?: string | null;
}

export interface LeadUpdate {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string | null;
  restaurant?: string;
  request_type?: RequestType;
  message?: string | null;
  status?: LeadStatus;
  source?: string | null;
  affiliate_id?: string | null;
}

export interface Database {
  public: {
    Tables: {
      user_roles: {
        Row: UserRoleRow;
        Insert: Omit<UserRoleRow, "created_at">;
        Update: Partial<Omit<UserRoleRow, "user_id" | "created_at">>;
      };
      leads: {
        Row: Lead;
        Insert: LeadInsert;
        Update: LeadUpdate;
      };
    };
  };
}
