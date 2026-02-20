"use client";

import { format } from "date-fns";
import { AlertTriangle, Calendar, CheckCircle2, FileText } from "lucide-react";
import type { PregnancyProfilingRecord } from "@/lib/schemas/pregnancy-profiling";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  record: PregnancyProfilingRecord | null;
}

function RiskBadge({ value }: { value: string | null }) {
  if (!value) return null;
  const map: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    lt_10: { label: "<10%", variant: "secondary" },
    "10_to_lt_20": { label: "10–20%", variant: "default" },
    "20_to_lt_30": { label: "20–30%", variant: "destructive" },
    "30_to_lt_40": { label: "30–40%", variant: "destructive" },
    gte_40: { label: "≥40%", variant: "destructive" },
  };
  const entry = map[value];
  if (!entry) return null;
  return <Badge variant={entry.variant}>{entry.label} CVD risk</Badge>;
}

function SurveySummary({
  survey,
}: {
  survey: Record<string, { findings: string[]; others: string }>;
}) {
  const sections = Object.entries(survey).filter(
    ([, v]) => (v?.findings?.length ?? 0) > 0 || v?.others,
  );
  if (sections.length === 0)
    return (
      <span className="text-muted-foreground italic text-xs">
        No findings recorded
      </span>
    );
  return (
    <ul className="space-y-1">
      {sections.map(([key, val]) => (
        <li key={key}>
          <span className="text-xs font-medium capitalize">
            {key.replace("_", " ")}:
          </span>{" "}
          <span className="text-xs text-muted-foreground">
            {[...val.findings, val.others ? `Others: ${val.others}` : ""]
              .filter(Boolean)
              .join(", ")}
          </span>
        </li>
      ))}
    </ul>
  );
}

function LabSummary({ record }: { record: PregnancyProfilingRecord }) {
  const tests = [
    {
      label: "Blood Glucose",
      raised: record.raised_blood_glucose,
      result: record.raised_blood_glucose_result,
      date: record.raised_blood_glucose_date,
    },
    {
      label: "Blood Lipids",
      raised: record.raised_blood_lipids,
      result: record.raised_blood_lipids_result,
      date: record.raised_blood_lipids_date,
    },
    {
      label: "Urine Ketones",
      raised: record.urine_ketones_positive,
      result: record.urine_ketones_result,
      date: record.urine_ketones_date,
    },
    {
      label: "Urine Protein",
      raised: record.urine_protein_positive,
      result: record.urine_protein_result,
      date: record.urine_protein_date,
    },
  ].filter((t) => t.raised !== null);

  if (tests.length === 0)
    return (
      <span className="text-muted-foreground italic text-xs">
        No lab results recorded
      </span>
    );

  return (
    <ul className="space-y-1">
      {tests.map((t) => (
        <li key={t.label} className="flex items-center gap-2 text-xs">
          {t.raised === "yes" ? (
            <AlertTriangle className="size-3 text-red-500 shrink-0" />
          ) : (
            <CheckCircle2 className="size-3 text-green-500 shrink-0" />
          )}
          <span className="font-medium">{t.label}:</span>
          <span className="text-muted-foreground">
            {t.raised === "yes" ? "Raised/Positive" : "Normal"}
            {t.result ? ` — ${t.result}` : ""}
            {t.date ? ` (${format(new Date(t.date), "MM/dd/yyyy")})` : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function PregnancyRecordSummary({ record }: Props) {
  if (!record) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-6 text-center">
          <FileText className="size-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No pregnancy profile recorded yet.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Complete the form to create a profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  const gptpal = [
    record.gravida != null ? `G${record.gravida}` : null,
    record.para != null ? `P${record.para}` : null,
    record.term != null ? `T${record.term}` : null,
    record.pre_term != null ? `P${record.pre_term}` : null,
    record.abortion != null ? `A${record.abortion}` : null,
    record.living != null ? `L${record.living}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-4">
      {/* Overview card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="size-4" />
              Last Visit: {format(new Date(record.visit_date), "MMMM d, yyyy")}
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              {record.is_inquirer && (
                <Badge variant="outline" className="text-xs">
                  Walk-in Inquirer
                </Badge>
              )}
              <RiskBadge value={record.risk_level} />
            </div>
          </div>
          <CardDescription className="text-xs">
            Updated: {format(new Date(record.updated_at), "MMM d, yyyy h:mm a")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* OB Score */}
          {gptpal && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                Obstetric Score
              </p>
              <p className="text-sm font-mono font-semibold">{gptpal}</p>
              {record.type_of_delivery && (
                <p className="text-xs text-muted-foreground">
                  Delivery type: {record.type_of_delivery}
                </p>
              )}
            </div>
          )}

          {/* Vitals grid */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
              Vitals
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: "BP",
                  value: record.blood_pressure,
                  isAlert: (() => {
                    if (!record.blood_pressure) return false;
                    const [s, d] = record.blood_pressure.split("/").map(Number);
                    return s > 140 || d > 90;
                  })(),
                },
                {
                  label: "HR",
                  value: record.heart_rate ? `${record.heart_rate} bpm` : null,
                  isAlert: false,
                },
                {
                  label: "RR",
                  value: record.respiratory_rate
                    ? `${record.respiratory_rate} /min`
                    : null,
                  isAlert: false,
                },
                {
                  label: "Temp",
                  value: record.temperature ? `${record.temperature}°C` : null,
                  isAlert: false,
                },
                {
                  label: "Height",
                  value: record.height ? `${record.height} cm` : null,
                  isAlert: false,
                },
                {
                  label: "Weight",
                  value: record.weight ? `${record.weight} kg` : null,
                  isAlert: false,
                },
                {
                  label: "BMI",
                  value: record.bmi ? `${record.bmi}` : null,
                  isAlert: (record.bmi ?? 0) > 30,
                },
              ]
                .filter((v) => v.value)
                .map((v) => (
                  <div
                    key={v.label}
                    className={`rounded-md px-3 py-2 text-center border ${
                      v.isAlert
                        ? "bg-red-50 border-red-200"
                        : "bg-muted/40 border-transparent"
                    }`}
                  >
                    <p className="text-xs text-muted-foreground">{v.label}</p>
                    <p
                      className={`text-sm font-semibold ${v.isAlert ? "text-red-700" : ""}`}
                    >
                      {v.value}
                      {v.isAlert && " ⚠"}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* General survey */}
          {record.general_survey &&
            Object.keys(record.general_survey).length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                  General Survey
                </p>
                <SurveySummary survey={record.general_survey} />
              </div>
            )}

          {/* Lab results */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
              Laboratory Results
            </p>
            <LabSummary record={record} />
          </div>

          {/* Notes */}
          {record.notes && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                Notes
              </p>
              <p className="text-sm bg-muted/40 rounded-md px-3 py-2 whitespace-pre-wrap">
                {record.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
