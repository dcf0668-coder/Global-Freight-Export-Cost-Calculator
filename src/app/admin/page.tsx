import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, FileText, Globe2, Ship, Users, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

// NOTE: This is a scaffold for the admin panel's information architecture.
// Wiring it to real CRUD requires: (1) a Supabase-authenticated session check
// here (redirect to a /admin/login page if no session or role !== "ADMIN"),
// and (2) server actions / API routes that read & write via Prisma to the
// Country, Port, ShippingLine, FreightRate, BlogPost, and User models defined
// in prisma/schema.prisma. Each card below maps 1:1 to a model.
const SECTIONS = [
  { icon: Globe2, title: "Manage Countries", desc: "Add or edit countries, duty/VAT rates, and required documents." },
  { icon: Ship, title: "Manage Ports", desc: "Add or edit ports, UNLOCODEs, coordinates, and service availability." },
  { icon: Database, title: "Manage Rates", desc: "Update freight rates by lane, cargo type, and shipping line." },
  { icon: FileText, title: "Manage Blog", desc: "Create, edit, and publish blog articles." },
  { icon: Users, title: "Manage Users", desc: "View and manage registered users and roles." },
  { icon: BarChart3, title: "Statistics", desc: "Calculator usage, top trade lanes, and traffic overview." },
];

export default function AdminDashboardPage() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage the platform's data. Connect Supabase auth and Prisma queries to make this fully functional — see the
          README for setup steps.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <s.icon className="h-5 w-5 text-primary" /> {s.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
