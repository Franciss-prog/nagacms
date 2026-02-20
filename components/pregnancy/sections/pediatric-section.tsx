"use client";

import { type Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PregnancyProfilingFormData } from "@/lib/schemas/pregnancy-profiling";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props {
  control: Control<PregnancyProfilingFormData, any, any>;
}

const BLOOD_TYPES = ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"] as const;

export function PediatricSection({ control }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground italic">
        For pediatric clients or when applicable to maternal assessment.
      </p>

      {/* 0–24 months measurements */}
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Anthropometric (0–24 months)
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {(
          [
            { name: "length", label: "Length", unit: "cm" },
            {
              name: "waist_circumference",
              label: "Waist Circumference",
              unit: "cm",
            },
            {
              name: "middle_upper_arm_circumference",
              label: "MUAC",
              unit: "cm",
            },
            {
              name: "head_circumference",
              label: "Head Circumference",
              unit: "cm",
            },
            { name: "hip", label: "Hip", unit: "cm" },
            {
              name: "skinfold_thickness",
              label: "Skinfold Thickness",
              unit: "mm",
            },
          ] as const
        ).map((f) => (
          <FormField
            key={f.name}
            control={control}
            name={f.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">
                  {f.label}{" "}
                  <span className="text-muted-foreground font-normal">
                    ({f.unit})
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="—"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? null
                          : parseFloat(e.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>

      {/* Limbs description */}
      <FormField
        control={control}
        name="limbs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Limbs / Extremities Findings</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. No deformities noted"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 0–60 months */}
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mt-2">
        Additional (0–60 months)
      </h4>
      <div className="grid grid-cols-2 gap-4">
        {/* Blood Type */}
        <FormField
          control={control}
          name="blood_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BLOOD_TYPES.map((bt) => (
                    <SelectItem key={bt} value={bt}>
                      {bt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Z-score */}
        <FormField
          control={control}
          name="z_score_cm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Z-score{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (length/height-for-age)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. -1.5"
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
      </div>
    </div>
  );
}
