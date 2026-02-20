"use client";

import { type Control } from "react-hook-form";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
import { Checkbox } from "@/components/ui/checkbox";
import type { PregnancyProfilingFormData } from "@/lib/schemas/pregnancy-profiling";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props {
  control: Control<PregnancyProfilingFormData, any, any>;
}

const DELIVERY_OPTIONS = [
  "Normal Spontaneous Delivery (NSD)",
  "Cesarean Section (CS)",
  "Forceps-assisted",
  "Vacuum-assisted",
  "Breech delivery",
  "Others",
];

export function PregnancyHistorySection({ control }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        GPTPAL — Gravida, Para, Term, Preterm, Abortion, Living
      </p>

      {/* GPTPAL grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {(
          [
            { name: "gravida", label: "Gravida (G)" },
            { name: "para", label: "Para (P)" },
            { name: "term", label: "Term (T)" },
            { name: "pre_term", label: "Preterm (P)" },
            { name: "abortion", label: "Abortion (A)" },
            { name: "living", label: "Living (L)" },
          ] as const
        ).map((field) => (
          <FormField
            key={field.name}
            control={control}
            name={field.name}
            render={({ field: f }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold">
                  {field.label}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    {...f}
                    value={f.value ?? ""}
                    onChange={(e) =>
                      f.onChange(
                        e.target.value === "" ? null : Number(e.target.value),
                      )
                    }
                    className="text-center"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>

      {/* Type of Delivery */}
      <FormField
        control={control}
        name="type_of_delivery"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type of Previous Delivery</FormLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {DELIVERY_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Is Inquirer */}
      <FormField
        control={control}
        name="is_inquirer"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-muted/30">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Walk-in Inquirer</FormLabel>
              <p className="text-xs text-muted-foreground">
                Check if patient is inquiring only (not an active OB patient)
              </p>
            </div>
          </FormItem>
        )}
      />

      {/* Inquiry details (conditional) */}
      <FormField
        control={control}
        name="inquiry_details"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Inquiry Details</FormLabel>
            <FormControl>
              <Input
                placeholder="Describe the inquiry (optional)"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
