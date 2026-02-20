"use client";

import { type Control, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { PregnancyProfilingFormData } from "@/lib/schemas/pregnancy-profiling";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props {
  control: Control<PregnancyProfilingFormData, any, any>;
  /** Pass the patient's calculated age to conditionally show this section */
  patientAge: number;
}

const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const YES_NO_DK_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "do_not_know", label: "Do not know" },
];

const RISK_LEVEL_OPTIONS = [
  { value: "lt_10", label: "<10%" },
  { value: "10_to_lt_20", label: "10% to <20%" },
  { value: "20_to_lt_30", label: "20% to <30%" },
  { value: "30_to_lt_40", label: "30% to <40%" },
  { value: "gte_40", label: "≥40%" },
];

const DIABETES_SYMPTOMS = [
  { value: "polydipsia", label: "Polydipsia (excessive thirst)" },
  { value: "polyuria", label: "Polyuria (frequent urination)" },
  { value: "polyphagia", label: "Polyphagia (excessive hunger)" },
  { value: "blurred_vision", label: "Blurred vision" },
  { value: "slow_wound_healing", label: "Slow wound healing" },
  { value: "fatigue", label: "Fatigue / weakness" },
];

function YesNoRadio({
  control,
  name,
  label,
  options = YES_NO_OPTIONS,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<PregnancyProfilingFormData, any, any>;
  name: keyof PregnancyProfilingFormData;
  label: string;
  options?: { value: string; label: string }[];
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm">{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={(field.value as string) ?? ""}
              className="flex flex-row gap-4"
            >
              {options.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={opt.value}
                    id={`${name}-${opt.value}`}
                  />
                  <label
                    htmlFor={`${name}-${opt.value}`}
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
  );
}

export function NcdAssessmentSection({ control, patientAge }: Props) {
  const diagnosedDiabetes = useWatch({ control, name: "diagnosed_diabetes" });
  const chestPain = useWatch({ control, name: "chest_pain_pressure" });
  const riskLevel = useWatch({ control, name: "risk_level" });

  const isHighRisk =
    riskLevel &&
    ["20_to_lt_30", "30_to_lt_40", "gte_40"].includes(riskLevel as string);

  if (patientAge < 25) {
    return (
      <div className="py-6 text-center text-muted-foreground text-sm">
        NCD High Risk Assessment is conducted for clients aged 25 and above.
        <br />
        <span className="text-xs">Patient age: {patientAge} years</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dietary & Lifestyle */}
      <div className="rounded-lg border p-4 space-y-4 bg-card">
        <h4 className="text-sm font-semibold text-blue-700">
          A. Dietary &amp; Lifestyle Assessment
        </h4>
        <YesNoRadio
          control={control}
          name="eats_processed_fast_foods"
          label="Does the patient regularly eat processed / fast foods?"
        />
        <YesNoRadio
          control={control}
          name="vegetables_3_servings_daily"
          label="Eats at least 3 servings of vegetables daily?"
        />
        <YesNoRadio
          control={control}
          name="fruits_2_3_servings_daily"
          label="Eats 2–3 servings of fruits daily?"
        />
        <YesNoRadio
          control={control}
          name="moderate_activity_2_5hrs_weekly"
          label="Does at least 2.5 hrs of moderate physical activity per week?"
        />
      </div>

      {/* Diabetes Screening */}
      <div className="rounded-lg border p-4 space-y-4 bg-card">
        <h4 className="text-sm font-semibold text-amber-700">
          B. Diabetes Screening
        </h4>
        <YesNoRadio
          control={control}
          name="diagnosed_diabetes"
          label="Has the patient been diagnosed with diabetes mellitus?"
          options={YES_NO_DK_OPTIONS}
        />

        {/* Conditional: If yes to diabetes */}
        {diagnosedDiabetes === "yes" && (
          <div className="pl-4 border-l-2 border-amber-300 space-y-4">
            {/* Diabetes Management */}
            <FormField
              control={control}
              name="diabetes_management"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diabetes management type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select management" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="with_medication">
                        With medication
                      </SelectItem>
                      <SelectItem value="without_medication">
                        Diet-controlled (without medication)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Diabetes Symptoms */}
            <div className="space-y-2">
              <FormLabel className="text-sm">
                Current diabetes symptoms
              </FormLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DIABETES_SYMPTOMS.map((symptom) => (
                  <FormField
                    key={symptom.value}
                    control={control}
                    name="diabetes_symptoms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={
                              Array.isArray(field.value) &&
                              field.value.includes(symptom.value)
                            }
                            onCheckedChange={(checked) => {
                              const current = Array.isArray(field.value)
                                ? field.value
                                : [];
                              if (checked) {
                                field.onChange([...current, symptom.value]);
                              } else {
                                field.onChange(
                                  current.filter(
                                    (v: string) => v !== symptom.value,
                                  ),
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-sm cursor-pointer">
                          {symptom.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cardiovascular Screening */}
      <div className="rounded-lg border p-4 space-y-4 bg-card">
        <h4 className="text-sm font-semibold text-red-700">
          C. Cardiovascular / Stroke Risk Screening
        </h4>

        <YesNoRadio
          control={control}
          name="angina_or_heart_attack"
          label="Has the patient been told they have angina or had a heart attack?"
        />

        <YesNoRadio
          control={control}
          name="chest_pain_pressure"
          label="Does the patient experience chest pain or pressure?"
        />

        {/* Conditional: chest pain sub-questions */}
        {chestPain === "yes" && (
          <div className="pl-4 border-l-2 border-red-300 space-y-3">
            <p className="text-xs text-muted-foreground italic">
              Rose questionnaire for angina (WHO)
            </p>
            <YesNoRadio
              control={control}
              name="chest_left_arm_pain"
              label="Does the pain radiate to the left arm?"
            />
            <YesNoRadio
              control={control}
              name="chest_pain_with_walking_uphill_hurry"
              label="Does pain occur when walking uphill or hurrying?"
            />
            <YesNoRadio
              control={control}
              name="chest_pain_slows_down_walking"
              label="Does pain cause patient to slow down or stop walking?"
            />
            <YesNoRadio
              control={control}
              name="chest_pain_relieved_by_rest_or_tablet"
              label="Is pain relieved by rest or nitrate tablet?"
            />
            <YesNoRadio
              control={control}
              name="chest_pain_gone_under_10mins"
              label="Does the pain resolve in under 10 minutes?"
            />
            <YesNoRadio
              control={control}
              name="chest_pain_severe_30mins_or_more"
              label="Was there a severe episode lasting 30 minutes or more?"
            />
          </div>
        )}

        <YesNoRadio
          control={control}
          name="stroke_or_tia"
          label="Has the patient had a stroke or TIA (transient ischemic attack)?"
        />
        <YesNoRadio
          control={control}
          name="difficulty_talking_or_one_side_weakness"
          label="Sudden difficulty talking, or weakness on one side of the body?"
        />
      </div>

      {/* Risk Level */}
      <div className="rounded-lg border p-4 space-y-3 bg-card">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          D. Cardiovascular Risk Level
          {isHighRisk && (
            <Badge variant="destructive" className="text-xs">
              High Risk
            </Badge>
          )}
        </h4>
        <p className="text-xs text-muted-foreground">
          Based on the WHO CVD risk chart — to be filled by the health worker.
        </p>
        <FormField
          control={control}
          name="risk_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>10-year cardiovascular risk level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {RISK_LEVEL_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
