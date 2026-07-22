"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    // Wire this up to your email provider / CRM route handler in production.
    await new Promise((r) => setTimeout(r, 700));
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          <p className="font-medium">Thanks — we'll get back to you shortly.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              required
              rows={5}
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button type="submit" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
