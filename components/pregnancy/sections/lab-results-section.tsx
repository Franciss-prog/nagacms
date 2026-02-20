"use client";

import { type Control, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import type { PregnancyProfilingFormData } from "@/lib/schemas/pregnancy-profiling";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props {
  control: Control<PregnancyProfilingFormData, any, any>;
}

type LabTest = {
  key:
    | "raised_blood_glucose"
    | "raised_blood_lipids"
    | "urine_ketones_positive"
    | "urine_protein_positive";
  dateKey:
    | "raised_blood_glucose_date"
    | "raised_blood_lipids_date"
    | "urine_ketones_date"
    | "urine_protein_date";
  resultKey:
    | "raised_blood_glucose_result"
    | "raised_blood_lipids_result"
    | "urine_ketones_result"
    | "urine_protein_result";
  label: string;
  raisedLabel: string;
  unit: string;
};

const LAB_TESTS: LabTest[] = [
  {
    key: "raised_blood_glucose",
    dateKey: "raised_blood_glucose_date",
    resultKey: "raised_blood_glucose_result",
    label: "Blood Glucose",
    raisedLabel:
      "Raised blood glucose (fasting >5.6 mmol/L or random >11.1 mmol/L)?",
    unit: "mmol/L or mg/dL",
  },
  {
    key: "raised_blood_lipids",
    dateKey: "raised_blood_lipids_date",
    resultKey: "raised_blood_lipids_result",
    label: "Blood Lipids / Cholesterol",
    raisedLabel: "Raised blood lipids (TC >5.2 mmol/L or LDL >3.4 mmol/L)?",
    unit: "mmol/L or mg/dL",
  },
  {
    key: "urine_ketones_positive",
    dateKey: "urine_ketones_date",
    resultKey: "urine_ketones_result",
    label: "Urine Ketones",
    raisedLabel: "Urine ketones positive?",
    unit: "trace / + / ++ / +++",
  },
  {
    key: "urine_protein_positive",
    dateKey: "urine_protein_date",
    resultKey: "urine_protein_result",
    label: "Urine Protein",
    raisedLabel: "Urine protein positive?",
    unit: "trace / + / ++ / +++",
  },
];

function LabTestRow({
  control,
  test,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<PregnancyProfilingFormData, any, any>;
  test: LabTest;
}) {
  const raised = useWatch({ control, name: test.key });

  return (
    <div className="rounded-lg border p-4 space-y-3 bg-card">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">{test.label}</h4>
        {raised === "yes" && (
          <Badge variant="destructive" className="text-xs">
            Raised / Positive
          </Badge>
        )}
      </div>

      {/* Yes / No */}
      <FormField
        control={control}
        name={test.key}
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-xs text-muted-foreground">
              {test.raisedLabel}
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={(field.value as string) ?? ""}
                className="flex flex-row gap-4"
              >
                {[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={opt.value}
                      id={`${test.key}-${opt.value}`}
                    />
                    <label
                      htmlFor={`${test.key}-${opt.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {opt.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Date and result (shown when answered) */}
      {raised && (
        <div className="grid grid-cols-2 gap-3 pt-1">
          <FormField
            control={control}
            name={test.dateKey}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Date of Test</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={test.resultKey}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">
                  Result{" "}
                  <span className="text-muted-foreground font-normal">
                    ({test.unit})
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter result value"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}

export function LabResultsSection({ control }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Record laboratory results. &quot;Raised / Positive&quot; will be flagged
        as a high-risk indicator.
      </p>

      {LAB_TESTS.map((test) => (
        <LabTestRow key={test.key} control={control} test={test} />
      ))}
    </div>
  );
}
