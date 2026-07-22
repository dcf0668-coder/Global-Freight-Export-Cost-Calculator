"use client";

import * as React from "react";
import { Loader2, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExportCostInput, ExportCostResult } from "@/types";
import { formatCurrency } from "@/lib/utils";

const defaultInput: ExportCostInput = {
  vehiclePriceExw: 12000,
  fobUplift: 300,
  oceanFreight: 900,
  insuranceRate: 0.3,
  inspectionFee: 60,
  exportDeclarationFee: 40,
  originPortCharges: 150,
  destinationCustomsFee: 200,
  importDutyRate: 10,
  vatRate: 15,
  localDeliveryFee: 120,
  desiredProfitMarginPercent: 15,
};

const FIELDS: { key: keyof ExportCostInput; label: string; suffix?: string }[] = [
  { key: "vehiclePriceExw", label: "Vehicle Price (EXW)" },
  { key: "fobUplift", label: "Export Handling / Inland (to FOB)" },
  { key: "oceanFreight", label: "Ocean Freight" },
  { key: "insuranceRate", label: "Insurance Rate", suffix: "%" },
  { key: "inspectionFee", label: "Inspection Fee" },
  { key: "exportDeclarationFee", label: "Export Declaration Fee" },
  { key: "originPortCharges", label: "Origin Port Charges" },
  { key: "destinationCustomsFee", label: "Destination Customs Fee" },
  { key: "importDutyRate", label: "Import Duty Rate", suffix: "%" },
  { key: "vatRate", label: "VAT Rate", suffix: "%" },
  { key: "localDeliveryFee", label: "Local Delivery Fee" },
  { key: "desiredProfitMarginPercent", label: "Desired Profit Margin", suffix: "%" },
];

export function ExportCostCalculatorForm() {
  const [input, setInput] = React.useState<ExportCostInput>(defaultInput);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<ExportCostResult | null>(null);

  function update(key: keyof ExportCostInput, value: number) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCalculate() {
    setLoading(true);
    try {
      const res = await fetch("/api/calculate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "export-cost", ...input }) });
      const data = await res.json();
      await new Promise((r) => setTimeout(r, 250));
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader><CardTitle>Cost Inputs</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.key} className="space-y-2">
                <Label>{f.label}{f.suffix ? ` (${f.suffix})` : " (USD)"}</Label>
                <Input type="number" step={0.1} value={input[f.key]} onChange={(e) => update(f.key, Number(e.target.value))} />
              </div>
            ))}
          </div>
          <Button size="lg" className="w-full" onClick={handleCalculate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calculate Landed Cost"}
          </Button>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        {result ? (
          <Card className="sticky top-24 border-primary/30">
            <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" /> Landed Cost Breakdown</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Landed Cost</p>
                <p className="text-3xl font-bold">{formatCurrency(result.totalLandedCost)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suggested Selling Price</p>
                <p className="text-2xl font-semibold text-primary">{formatCurrency(result.suggestedSellingPrice)}</p>
              </div>
              <div className="space-y-1.5 border-t border-border pt-4 text-sm max-h-80 overflow-y-auto pr-1">
                {result.breakdown.map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium">{formatCurrency(row.amount)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex h-full min-h-[300px] items-center justify-center border-dashed">
            <CardContent className="pt-6 text-center text-muted-foreground">
              <Calculator className="mx-auto mb-3 h-8 w-8" />
              <p>Enter your cost inputs to calculate total landed cost and selling price.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
