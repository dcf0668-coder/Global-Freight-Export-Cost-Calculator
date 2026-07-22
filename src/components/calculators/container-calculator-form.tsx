"use client";

import * as React from "react";
import { Loader2, Boxes } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContainerCalculatorInput, ContainerCalculatorResult } from "@/types";
import { formatNumber } from "@/lib/utils";

export function ContainerCalculatorForm() {
  const [cartonLengthCm, setCartonLengthCm] = React.useState(50);
  const [cartonWidthCm, setCartonWidthCm] = React.useState(40);
  const [cartonHeightCm, setCartonHeightCm] = React.useState(35);
  const [cartonWeightKg, setCartonWeightKg] = React.useState(15);
  const [numberOfCartons, setNumberOfCartons] = React.useState(500);
  const [usePallets, setUsePallets] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<ContainerCalculatorResult | null>(null);

  async function handleCalculate() {
    setLoading(true);
    const input: ContainerCalculatorInput = { cartonLengthCm, cartonWidthCm, cartonHeightCm, cartonWeightKg, numberOfCartons, usePallets };
    try {
      const res = await fetch("/api/calculate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "container", ...input }) });
      const data = await res.json();
      await new Promise((r) => setTimeout(r, 250));
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Carton Details</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2"><Label>Length (cm)</Label><Input type="number" value={cartonLengthCm} onChange={(e) => setCartonLengthCm(Number(e.target.value))} /></div>
            <div className="space-y-2"><Label>Width (cm)</Label><Input type="number" value={cartonWidthCm} onChange={(e) => setCartonWidthCm(Number(e.target.value))} /></div>
            <div className="space-y-2"><Label>Height (cm)</Label><Input type="number" value={cartonHeightCm} onChange={(e) => setCartonHeightCm(Number(e.target.value))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Carton Weight (kg)</Label><Input type="number" value={cartonWeightKg} onChange={(e) => setCartonWeightKg(Number(e.target.value))} /></div>
            <div className="space-y-2"><Label>Number of Cartons</Label><Input type="number" value={numberOfCartons} onChange={(e) => setNumberOfCartons(Number(e.target.value))} /></div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <Label className="font-normal">Loaded on Pallets</Label>
            <Switch checked={usePallets} onCheckedChange={setUsePallets} />
          </div>
          <Button size="lg" className="w-full" onClick={handleCalculate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calculate Container Load"}
          </Button>
        </CardContent>
      </Card>

      <div className="lg:col-span-3">
        {result ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Total CBM" value={`${formatNumber(result.totalCbm, 2)} m³`} />
              <StatCard label="Total Weight" value={`${formatNumber(result.totalWeightKg)} kg`} />
              <StatCard label="Loading Efficiency" value={`${result.loadingEfficiencyPercent}%`} />
            </div>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Boxes className="h-5 w-5" /> Container Suggestions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {result.suggestions.map((s) => (
                  <div key={s.size} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-semibold">{s.size}</p>
                      <p className="text-sm text-muted-foreground">{s.cartonsPerContainer} cartons/container</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={s.utilizationPercent > 85 ? "success" : "secondary"}>{s.utilizationPercent}% utilized</Badge>
                      <p className="mt-1 text-sm font-medium">{s.containersNeeded} container{s.containersNeeded > 1 ? "s" : ""} needed</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="flex h-full min-h-[300px] items-center justify-center border-dashed">
            <CardContent className="pt-6 text-center text-muted-foreground">
              <Boxes className="mx-auto mb-3 h-8 w-8" />
              <p>Enter carton dimensions to see container loading suggestions.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
