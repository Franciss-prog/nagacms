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
import { Checkbox } from "@/components/ui/checkbox";
import type { PregnancyProfilingFormData } from "@/lib/schemas/pregnancy-profiling";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props {
  control: Control<PregnancyProfilingFormData, any, any>;
}

type SurveyKey =
  | "heent"
  | "chest_lungs"
  | "heart"
  | "abdomen"
  | "genitourinary"
  | "digital_rectal_exam"
  | "skin_extremities"
  | "neurological_exam";

const SURVEY_SECTIONS: {
  key: SurveyKey;
  label: string;
  options: string[];
}[] = [
  {
    key: "heent",
    label: "HEENT (Head, Eyes, Ears, Nose, Throat)",
    options: [
      "Essentially normal",
      "Abnormal pupillary reaction",
      "Cervical lymphadenopathy",
      "Dry mucous membrane",
      "Icteric sclerae",
      "Pale conjunctiva",
      "Sunken eyeballs",
      "Sunken fontanelle",
    ],
  },
  {
    key: "chest_lungs",
    label: "Chest / Breast / Lungs",
    options: [
      "Essentially normal",
      "Asymmetric chest expansion",
      "Decreased breath sound",
      "Enlarged axillary lymph nodes",
      "Wheezes",
      "Lumps over breast(s)",
      "Crackles/Rales",
      "Retractions",
    ],
  },
  {
    key: "heart",
    label: "Heart",
    options: [
      "Essentially normal",
      "Displaced apex beat",
      "Heaves/Thrills",
      "Irregular rhythm",
      "Muffled heart sounds",
      "Murmurs",
      "Pericardial bulge",
    ],
  },
  {
    key: "abdomen",
    label: "Abdomen",
    options: [
      "Essentially normal",
      "Abdominal rigidity",
      "Abdominal tenderness",
      "Hyperactive bowel sounds",
      "Palpable mass(es)",
      "Tympanic/Dull abdomen",
      "Uterine contractions",
    ],
  },
  {
    key: "genitourinary",
    label: "Genitourinary",
    options: [
      "Essentially normal",
      "Blood stained in exam finger",
      "Cervical dilatation",
      "Presence of abnormal discharge",
    ],
  },
  {
    key: "digital_rectal_exam",
    label: "Digital Rectal Examination",
    options: [
      "Essentially normal",
      "Enlarged prostate",
      "Mass",
      "Hemorrhoids",
      "Pus",
      "Not applicable",
    ],
  },
  {
    key: "skin_extremities",
    label: "Skin / Extremities",
    options: [
      "Essentially normal",
      "Clubbing",
      "Cold clammy",
      "Cyanosis/mottled skin",
      "Edema/Swelling",
      "Decreased mobility",
      "Pale nailbeds",
      "Poor skin turgor",
      "Rashes/Petechiae",
      "Weak pulses",
    ],
  },
  {
    key: "neurological_exam",
    label: "Neurological Examination",
    options: [
      "Essentially normal",
      "Abnormal gait",
      "Abnormal position sense",
      "Abnormal sensations",
      "Abnormal reflex(es)",
      "Poor/altered memory",
      "Poor muscle tone/strength",
      "Poor coordination",
    ],
  },
];

export function GeneralSurveySection({ control }: Props) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Check all applicable findings per body system. Add free-text notes in
        the &quot;Others&quot; field.
      </p>

      {SURVEY_SECTIONS.map((section) => (
        <div
          key={section.key}
          className="rounded-lg border p-4 space-y-3 bg-card"
        >
          <h4 className="text-sm font-semibold">{section.label}</h4>

          {/* Checkbox options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {section.options.map((option) => (
              <FormField
                key={`${section.key}-${option}`}
                control={control}
                name={`general_survey.${section.key}.findings`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option) ?? false}
                        onCheckedChange={(checked) => {
                          const current = Array.isArray(field.value)
                            ? field.value
                            : [];
                          if (checked) {
                            field.onChange([...current, option]);
                          } else {
                            field.onChange(
                              current.filter((v: string) => v !== option),
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-sm cursor-pointer">
                      {option}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>

          {/* Others text field */}
          <FormField
            control={control}
            name={`general_survey.${section.key}.others`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">
                  Others / Remarks
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Specify other findings..."
                    {...field}
                    value={field.value ?? ""}
                    className="text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
}
