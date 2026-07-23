"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ship, Plane, Train, Package, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ports, getPortsByCountry } from "@/lib/data/ports";
import { countries } from "@/lib/data/countries";
import { CalculatorInput, CalculatorResult, CargoType, ContainerSize } from "@/types";
import { formatCurrency } from "@/lib/utils";

const CHINA_PORTS = ports.filter((p) => p.countryId === "cn");

const CARGO_OPTIONS: { value: CargoType; label: string; icon: React.ElementType }[] = [
  { value: "FCL", label: "Container (FCL)", icon: Package },
  { value: "LCL", label: "LCL (Shared Container)", icon: Package },
  { value: "RORO", label: "RoRo", icon: Ship },
  { value: "VEHICLE", label: "Vehicle", icon: Ship },
  { value: "AIR", label: "Air Freight", icon: Plane },
  { value: "RAIL", label: "Rail Freight", icon: Train },
];

export function FreightCalculatorForm({ initialDestination }: { initialDestination?: string }) {
  const [originPortId, setOriginPortId] = React.useState(CHINA_PORTS[0]?.id ?? "");
  const [destinationCountryId, setDestinationCountryId] = React.useState(initialDestination || countries[0]?.id || "");
  const [destinationPortId, setDestinationPortId] = React.useState("");
  const [cargoType, setCargoType] = React.useState<CargoType>("FCL");
  const [containerSize, setContainerSize] = React.useState<ContainerSize>("20GP");
  const [weightKg, setWeightKg] = React.useState<number>(1000);
  const [volumeCbm, setVolumeCbm] = React.useState<number>(10);
  const [dangerousGoods, setDangerousGoods] = React.useState(false);
  const [insurance, setInsurance] = React.useState(true);
  const [customsClearance, setCustomsClearance] = React.useState(true);
  const [destinationDelivery, setDestinationDelivery] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<CalculatorResult | null>(null);

  const destinationPorts = React.useMemo(() => getPortsByCountry(destinationCountryId), [destinationCountryId]);

  React.useEffect(() => {
    setDestinationPortId(destinationPorts[0]?.id ?? "");
  }, [destinationPorts]);

  async function handleCalculate() {
    setLoading(true);
    const input: CalculatorInput = {
      originCountryId: "cn",
      originPortId,
      destinationCountryId,
      destinationPortId,
      cargoType,
      containerSize: cargoType === "FCL" ? containerSize : undefined,
      weightKg,
      volumeCbm,
      dangerousGoods,
      insurance,
      customsClearance,
      destinationDelivery,
    };

    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      // small delay so the loading skeleton is perceptible for a snappy-feeling UI
      await new Promise((r) => setTimeout(r, 300));
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Shipment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Origin Port (China)</Label>
              <Select value={originPortId} onValueChange={setOriginPortId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CHINA_PORTS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Destination Country</Label>
              <Select value={destinationCountryId} onValueChange={setDestinationCountryId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Destination Port</Label>
              <Select value={destinationPortId} onValueChange={setDestinationPortId}>
                <SelectTrigger><SelectValue placeholder="Select a port" /></SelectTrigger>
                <SelectContent>
                  {destinationPorts.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cargo Type</Label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {CARGO_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCargoType(opt.value)}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-xs transition-colors ${
                    cargoType === opt.value ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent"
                  }`}
                >
                  <opt.icon className="h-4 w-4" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {cargoType === "FCL" && (
            <div className="space-y-2">
              <Label>Container Size</Label>
              <Select value={containerSize} onValueChange={(v) => setContainerSize(v as ContainerSize)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["20GP", "40GP", "40HQ", "45HQ"] as ContainerSize[]).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input type="number" min={0} value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Volume (CBM)</Label>
              <Input type="number" min={0} value={volumeCbm} onChange={(e) => setVolumeCbm(Number(e.target.value))} />
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-border p-4">
            <ToggleRow label="Dangerous Goods" checked={dangerousGoods} onChange={setDangerousGoods} />
            <ToggleRow label="Cargo Insurance" checked={insurance} onChange={setInsurance} />
            <ToggleRow label="Customs Clearance" checked={customsClearance} onChange={setCustomsClearance} />
            <ToggleRow label="Destination Delivery" checked={destinationDelivery} onChange={setDestinationDelivery} />
          </div>

          <Button size="lg" className="w-full" onClick={handleCalculate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calculate Shipping Cost"}
          </Button>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Card className="sticky top-24 border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Estimate
                    <div className="flex gap-1.5">
                      <Badge variant={result.rateSource === "live" ? "success" : "secondary"}>
                        {result.rateSource === "live" ? "Live Rate" : "Estimated"}
                      </Badge>
                      <Badge variant="outline">{result.recommendedMethod}</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Estimated Cost</p>
                    <p className="text-4xl font-bold">{formatCurrency(result.totalEstimate, result.currency)}</p>
                    {result.convertedEstimate && (
                      <p className="text-sm text-muted-foreground">
                        ≈ {formatCurrency(result.convertedEstimate.amount, result.convertedEstimate.currency)}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-muted-foreground">Transit Time</p>
                      <p className="font-semibold">{result.transitTimeDays.min}–{result.transitTimeDays.max} days</p>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-muted-foreground">CO₂ Estimate</p>
                      <p className="font-semibold">{result.co2EstimateKg} kg</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 border-t border-border pt-4">
                    {result.breakdown.map((row) => (
                      <div key={row.label} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className="font-medium">{formatCurrency(row.amount, result.currency)}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is an indicative estimate, not a binding freight quote. Actual rates vary by carrier, season, and fuel surcharges.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="flex h-full min-h-[300px] items-center justify-center border-dashed">
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Package className="mx-auto mb-3 h-8 w-8" />
                <p>Fill in your shipment details to see a cost estimate.</p>
              </CardContent>
            </Card>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <Label className="font-normal">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
