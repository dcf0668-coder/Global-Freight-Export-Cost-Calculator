"use client";

import * as React from "react";
import { Loader2, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ports } from "@/lib/data/ports";
import { RoroCalculatorInput, RoroCalculatorResult, VehicleType } from "@/types";
import { formatCurrency } from "@/lib/utils";

const CHINA_PORTS = ports.filter((p) => p.countryId === "cn" && p.roroAvailable);
const DEST_RORO_PORTS = ports.filter((p) => p.countryId !== "cn" && p.roroAvailable);

const VEHICLE_TYPES: VehicleType[] = ["SEDAN", "SUV", "PICKUP", "TRUCK", "BUS", "EV", "HYBRID"];

export function RoroCalculatorForm() {
  const [vehicleType, setVehicleType] = React.useState<VehicleType>("SEDAN");
  const [lengthM, setLengthM] = React.useState(4.7);
  const [widthM, setWidthM] = React.useState(1.8);
  const [heightM, setHeightM] = React.useState(1.45);
  const [weightKg, setWeightKg] = React.useState(1500);
  const [originPortId, setOriginPortId] = React.useState(CHINA_PORTS[0]?.id ?? "");
  const [destinationPortId, setDestinationPortId] = React.useState(DEST_RORO_PORTS[0]?.id ?? "");
  const [insurance, setInsurance] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<RoroCalculatorResult | null>(null);

  async function handleCalculate() {
    setLoading(true);
    const input: RoroCalculatorInput = { vehicleType, lengthM, widthM, heightM, weightKg, originPortId, destinationPortId, insurance };
    try {
      const res = await fetch("/api/calculate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "roro", ...input }) });
      const data = await res.json();
      await new Promise((r) => setTimeout(r, 300));
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader><CardTitle>Vehicle Details</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Vehicle Type</Label>
            <Select value={vehicleType} onValueChange={(v) => setVehicleType(v as VehicleType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {VEHICLE_TYPES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-2"><Label>Length (m)</Label><Input type="number" step={0.1} value={lengthM} onChange={(e) => setLengthM(Number(e.target.value))} /></div>
            <div className="space-y-2"><Label>Width (m)</Label><Input type="number" step={0.1} value={widthM} onChange={(e) => setWidthM(Number(e.target.value))} /></div>
            <div className="space-y-2"><Label>Height (m)</Label><Input type="number" step={0.1} value={heightM} onChange={(e) => setHeightM(Number(e.target.value))} /></div>
            <div className="space-y-2"><Label>Weight (kg)</Label><Input type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} /></div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Origin Port (China)</Label>
              <Select value={originPortId} onValueChange={setOriginPortId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CHINA_PORTS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Destination Port</Label>
              <Select value={destinationPortId} onValueChange={setDestinationPortId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DEST_RORO_PORTS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <Label className="font-normal">Insurance</Label>
            <Switch checked={insurance} onCheckedChange={setInsurance} />
          </div>

          <Button size="lg" className="w-full" onClick={handleCalculate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calculate RoRo Cost"}
          </Button>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        {result ? (
          <Card className="sticky top-24 border-primary/30">
            <CardHeader><CardTitle className="flex items-center gap-2"><Car className="h-5 w-5" /> RoRo Estimate</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Estimate</p>
                <p className="text-4xl font-bold">{formatCurrency(result.totalEstimate, result.currency)}</p>
              </div>
              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="text-muted-foreground">Transit Time</p>
                <p className="font-semibold">{result.transitTimeDays.min}–{result.transitTimeDays.max} days</p>
              </div>
              <div className="space-y-1.5 border-t border-border pt-4 text-sm">
                <Row label="Ocean Freight" value={result.oceanFreight} currency={result.currency} />
                <Row label="Port Charges" value={result.portCharges} currency={result.currency} />
                <Row label="Documentation Fee" value={result.documentationFee} currency={result.currency} />
                <Row label="Inspection Fee" value={result.inspectionFee} currency={result.currency} />
                {result.insurance > 0 && <Row label="Insurance" value={result.insurance} currency={result.currency} />}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex h-full min-h-[300px] items-center justify-center border-dashed">
            <CardContent className="pt-6 text-center text-muted-foreground">
              <Car className="mx-auto mb-3 h-8 w-8" />
              <p>Enter vehicle details to see your RoRo shipping estimate.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, currency }: { label: string; value: number; currency: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{formatCurrency(value, currency)}</span>
    </div>
  );
}
