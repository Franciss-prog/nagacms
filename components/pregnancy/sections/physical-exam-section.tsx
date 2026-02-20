"use client";

import { useEffect } from "react";
import { type Control, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { PregnancyProfilingFormData } from "@/lib/schemas/pregnancy-profiling";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props {
  control: Control<PregnancyProfilingFormData, any, any>;
  setValue: (name: "bmi", value: number | null) => void;
}

// BP alert: systolic >140 or diastolic >90
function getBpAlert(bp: string | null | undefined): boolean {
  if (!bp) return false;
  const parts = bp.split("/");
  if (parts.length !== 2) return false;
  const systolic = parseInt(parts[0]);
  const diastolic = parseInt(parts[1]);
  return systolic > 140 || diastolic > 90;
}

// BMI classification
function getBmiCategory(bmi: number | null | undefined) {
  if (!bmi) return null;
  if (bmi < 18.5)
    return { label: "Underweight", color: "bg-blue-100 text-blue-800" };
  if (bmi < 25)
    return { label: "Normal", color: "bg-green-100 text-green-800" };
  if (bmi < 30)
    return { label: "Overweight", color: "bg-yellow-100 text-yellow-800" };
  return { label: "Obese", color: "bg-red-100 text-red-800" };
}

export function PhysicalExamSection({ control, setValue }: Props) {
  const height = useWatch({ control, name: "height" });
  const weight = useWatch({ control, name: "weight" });
  const bp = useWatch({ control, name: "blood_pressure" });
  const bmi = useWatch({ control, name: "bmi" });

  // Auto-calculate BMI whenever height or weight changes
  useEffect(() => {
    if (height && weight && height > 0) {
      const heightM = height / 100;
      const calculatedBmi = parseFloat(
        (weight / (heightM * heightM)).toFixed(2),
      );
      setValue("bmi", calculatedBmi);
    } else {
      setValue("bmi", null);
    }
  }, [height, weight, setValue]);

  const bpAlert = getBpAlert(bp);
  const bmiCategory = getBmiCategory(bmi);

  return (
    <div className="space-y-5">
      {/* Vitals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Blood Pressure */}
        <FormField
          control={control}
          name="blood_pressure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Blood Pressure{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (mmHg)
                </span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="e.g. 120/80"
                    {...field}
                    value={field.value ?? ""}
                    className={bpAlert ? "border-red-500 pr-24" : ""}
                  />
                  {bpAlert && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Badge variant="destructive" className="text-xs">
                        High BP
                      </Badge>
                    </span>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Temperature */}
        <FormField
          control={control}
          name="temperature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Temperature{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (°C)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="36.5"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseFloat(e.target.value),
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Heart Rate */}
        <FormField
          control={control}
          name="heart_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Heart Rate{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (bpm)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="72"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseInt(e.target.value),
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Respiratory Rate */}
        <FormField
          control={control}
          name="respiratory_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Respiratory Rate{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (breaths/min)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="18"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseInt(e.target.value),
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Anthropometrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Height */}
        <FormField
          control={control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Height{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (cm)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="160.00"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseFloat(e.target.value),
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Weight */}
        <FormField
          control={control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Weight{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (kg)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="65.00"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseFloat(e.target.value),
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* BMI (auto-calculated, read-only) */}
        <FormField
          control={control}
          name="bmi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                BMI{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (auto-calculated)
                </span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    readOnly
                    tabIndex={-1}
                    value={field.value != null ? field.value.toFixed(2) : ""}
                    placeholder="—"
                    className="bg-muted cursor-not-allowed"
                  />
                  {bmiCategory && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${bmiCategory.color}`}
                      >
                        {bmiCategory.label}
                      </span>
                    </span>
                  )}
                </div>
              </FormControl>
              {(bmi ?? 0) > 30 && (
                <p className="text-xs text-red-500 mt-1">
                  ⚠ BMI &gt;30 — high-risk flag. Refer to physician.
                </p>
              )}
            </FormItem>
          )}
        />
      </div>

      {/* Visual Acuity */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="visual_acuity_left"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visual Acuity — Left</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 20/20"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="visual_acuity_right"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visual Acuity — Right</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 20/20"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
