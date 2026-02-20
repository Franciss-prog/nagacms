"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Baby,
  Clipboard,
  FlaskConical,
  HeartPulse,
  Save,
  Shield,
  Stethoscope,
} from "lucide-react";

import {
  pregnancyProfilingSchema,
  type PregnancyProfilingFormData,
  type PregnancyProfilingRecord,
} from "@/lib/schemas/pregnancy-profiling";
import { upsertPregnancyProfileAction } from "@/lib/actions/pregnancy-profiling";
import type { ResidentForProfiling } from "@/lib/queries/pregnancy-profiling";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import { PregnancyHistorySection } from "./sections/pregnancy-history-section";
import { PhysicalExamSection } from "./sections/physical-exam-section";
import { PediatricSection } from "./sections/pediatric-section";
import { GeneralSurveySection } from "./sections/general-survey-section";
import { NcdAssessmentSection } from "./sections/ncd-assessment-section";
import { LabResultsSection } from "./sections/lab-results-section";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function calculateAge(birthDate: string | null | undefined): number {
  if (!birthDate) return 0;
  const today = new Date();
  const dob = new Date(birthDate);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

function buildDefaultValues(
  record: PregnancyProfilingRecord | null,
): PregnancyProfilingFormData {
  const today = format(new Date(), "yyyy-MM-dd");

  if (!record) {
    return pregnancyProfilingSchema.parse({
      visit_date: today,
      is_inquirer: false,
      diabetes_symptoms: [],
      general_survey: {
        heent: { findings: [], others: "" },
        chest_lungs: { findings: [], others: "" },
        heart: { findings: [], others: "" },
        abdomen: { findings: [], others: "" },
        extremities: { findings: [], others: "" },
        skin: { findings: [], others: "" },
        musculoskeletal: { findings: [], others: "" },
        genitourinary: { findings: [], others: "" },
      },
    });
  }

  // Flatten DB record → form fields
  return {
    visit_date: record.visit_date ?? today,
    is_inquirer: record.is_inquirer ?? false,
    inquiry_details: record.inquiry_details ?? "",
    gravida: record.gravida,
    para: record.para,
    term: record.term,
    pre_term: record.pre_term,
    abortion: record.abortion,
    living: record.living,
    type_of_delivery: record.type_of_delivery ?? "",
    blood_pressure: record.blood_pressure ?? "",
    heart_rate: record.heart_rate,
    respiratory_rate: record.respiratory_rate,
    height: record.height,
    weight: record.weight,
    bmi: record.bmi,
    temperature: record.temperature,
    visual_acuity_left: record.visual_acuity_left ?? "",
    visual_acuity_right: record.visual_acuity_right ?? "",
    length: record.length,
    waist_circumference: record.waist_circumference,
    middle_upper_arm_circumference: record.middle_upper_arm_circumference,
    head_circumference: record.head_circumference,
    hip: record.hip,
    skinfold_thickness: record.skinfold_thickness,
    limbs: record.limbs ?? "",
    blood_type:
      (record.blood_type as PregnancyProfilingFormData["blood_type"]) ?? null,
    z_score_cm: record.z_score_cm,
    general_survey: {
      heent: record.general_survey?.heent ?? { findings: [], others: "" },
      chest_lungs: record.general_survey?.chest_lungs ?? {
        findings: [],
        others: "",
      },
      heart: record.general_survey?.heart ?? { findings: [], others: "" },
      abdomen: record.general_survey?.abdomen ?? { findings: [], others: "" },
      extremities: record.general_survey?.extremities ?? {
        findings: [],
        others: "",
      },
      skin: record.general_survey?.skin ?? { findings: [], others: "" },
      musculoskeletal: record.general_survey?.musculoskeletal ?? {
        findings: [],
        others: "",
      },
      genitourinary: record.general_survey?.genitourinary ?? {
        findings: [],
        others: "",
      },
    },
    eats_processed_fast_foods: record.eats_processed_fast_foods,
    vegetables_3_servings_daily: record.vegetables_3_servings_daily,
    fruits_2_3_servings_daily: record.fruits_2_3_servings_daily,
    moderate_activity_2_5hrs_weekly: record.moderate_activity_2_5hrs_weekly,
    diagnosed_diabetes: record.diagnosed_diabetes,
    diabetes_management: record.diabetes_management,
    diabetes_symptoms: record.diabetes_symptoms ?? [],
    angina_or_heart_attack: record.angina_or_heart_attack,
    chest_pain_pressure: record.chest_pain_pressure,
    chest_left_arm_pain: record.chest_left_arm_pain,
    chest_pain_with_walking_uphill_hurry:
      record.chest_pain_with_walking_uphill_hurry,
    chest_pain_slows_down_walking: record.chest_pain_slows_down_walking,
    chest_pain_relieved_by_rest_or_tablet:
      record.chest_pain_relieved_by_rest_or_tablet,
    chest_pain_gone_under_10mins: record.chest_pain_gone_under_10mins,
    chest_pain_severe_30mins_or_more: record.chest_pain_severe_30mins_or_more,
    stroke_or_tia: record.stroke_or_tia,
    difficulty_talking_or_one_side_weakness:
      record.difficulty_talking_or_one_side_weakness,
    risk_level: record.risk_level,
    raised_blood_glucose: record.raised_blood_glucose,
    raised_blood_glucose_date: record.raised_blood_glucose_date ?? "",
    raised_blood_glucose_result: record.raised_blood_glucose_result ?? "",
    raised_blood_lipids: record.raised_blood_lipids,
    raised_blood_lipids_date: record.raised_blood_lipids_date ?? "",
    raised_blood_lipids_result: record.raised_blood_lipids_result ?? "",
    urine_ketones_positive: record.urine_ketones_positive,
    urine_ketones_date: record.urine_ketones_date ?? "",
    urine_ketones_result: record.urine_ketones_result ?? "",
    urine_protein_positive: record.urine_protein_positive,
    urine_protein_date: record.urine_protein_date ?? "",
    urine_protein_result: record.urine_protein_result ?? "",
    notes: record.notes ?? "",
  };
}

// ---------------------------------------------------------------------------
// High-risk badge helper
// ---------------------------------------------------------------------------
function getHighRiskAlerts(record: PregnancyProfilingRecord | null): string[] {
  if (!record) return [];
  const alerts: string[] = [];

  if (record.blood_pressure) {
    const [sys, dia] = record.blood_pressure.split("/").map(Number);
    if (sys > 140 || dia > 90) alerts.push("High Blood Pressure (>140/90)");
  }
  if (record.bmi && record.bmi > 30) alerts.push(`Obese BMI (${record.bmi})`);
  if (record.raised_blood_glucose === "yes")
    alerts.push("Raised Blood Glucose");
  if (record.raised_blood_lipids === "yes") alerts.push("Raised Blood Lipids");
  if (record.urine_protein_positive === "yes")
    alerts.push("Urine Protein Positive");
  if (
    record.risk_level &&
    ["20_to_lt_30", "30_to_lt_40", "gte_40"].includes(record.risk_level)
  ) {
    alerts.push("High Cardiovascular Risk");
  }

  return alerts;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface PregnancyProfileFormProps {
  resident: ResidentForProfiling;
  existingRecord: PregnancyProfilingRecord | null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function PregnancyProfileForm({
  resident,
  existingRecord,
}: PregnancyProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const age = calculateAge(resident.birth_date);
  const alerts = getHighRiskAlerts(existingRecord);

  const form = useForm<PregnancyProfilingFormData>({
    // Cast is necessary due to @hookform/resolvers v5 + zod v4 TTransformedValues mismatch
    resolver: zodResolver(
      pregnancyProfilingSchema,
    ) as Resolver<PregnancyProfilingFormData>,
    defaultValues: buildDefaultValues(existingRecord),
  });

  async function onSubmit(data: PregnancyProfilingFormData) {
    setIsSubmitting(true);
    setSubmitResult(null);

    const result = await upsertPregnancyProfileAction(resident.id, data);

    setIsSubmitting(false);
    if (result.success) {
      setSubmitResult({
        success: true,
        message:
          result.action === "created"
            ? "Pregnancy profile successfully created."
            : "Pregnancy profile successfully updated.",
      });
    } else {
      setSubmitResult({ success: false, message: result.error });
    }
  }

  return (
    <div className="space-y-4">
      {/* Patient summary card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg">{resident.full_name}</CardTitle>
              <CardDescription>
                {resident.barangay} — {resident.purok} &nbsp;|&nbsp; Age: {age}{" "}
                yrs &nbsp;|&nbsp;{" "}
                {resident.birth_date
                  ? format(new Date(resident.birth_date), "MMMM d, yyyy")
                  : "DOB unknown"}{" "}
                &nbsp;|&nbsp; {resident.sex ?? "—"}
              </CardDescription>
              {resident.philhealth_no && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  PhilHealth No: {resident.philhealth_no}
                </p>
              )}
            </div>

            {alerts.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {alerts.map((a) => (
                  <Badge key={a} variant="destructive" className="text-xs">
                    ⚠ {a}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {existingRecord && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated:{" "}
              {format(
                new Date(existingRecord.updated_at),
                "MMM d, yyyy h:mm a",
              )}
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Submit feedback banner */}
      {submitResult && (
        <div
          className={`rounded-md px-4 py-3 text-sm font-medium ${
            submitResult.success
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {submitResult.success ? "✓ " : "✗ "}
          {submitResult.message}
        </div>
      )}

      {/* Main form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Visit date (top-level, always visible) */}
          <Card>
            <CardContent className="pt-4">
              <FormField
                control={form.control}
                name="visit_date"
                render={({ field }) => (
                  <FormItem className="max-w-xs">
                    <FormLabel className="font-semibold">Visit Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Accordion sections */}
          <Card>
            <CardContent className="pt-2 pb-4">
              <Accordion
                type="multiple"
                defaultValue={["pregnancy-history", "physical-exam"]}
                className="w-full"
              >
                {/* 1. Pregnancy History */}
                <AccordionItem value="pregnancy-history">
                  <AccordionTrigger className="text-base font-semibold text-foreground px-1">
                    <span className="flex items-center gap-2">
                      <Baby className="size-4 text-pink-600" />
                      1. Pregnancy History (OB Score)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-1">
                    <PregnancyHistorySection control={form.control} />
                  </AccordionContent>
                </AccordionItem>

                {/* 2. Physical Exam */}
                <AccordionItem value="physical-exam">
                  <AccordionTrigger className="text-base font-semibold text-foreground px-1">
                    <span className="flex items-center gap-2">
                      <Stethoscope className="size-4 text-blue-600" />
                      2. Physical Examination Findings
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-1">
                    <PhysicalExamSection
                      control={form.control}
                      setValue={(name, value) => form.setValue(name, value)}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* 3. Pediatric */}
                <AccordionItem value="pediatric">
                  <AccordionTrigger className="text-base font-semibold text-foreground px-1">
                    <span className="flex items-center gap-2">
                      <HeartPulse className="size-4 text-purple-600" />
                      3. Pediatric Client Measurements
                      <Badge
                        variant="outline"
                        className="text-xs font-normal ml-1"
                      >
                        Optional
                      </Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-1">
                    <PediatricSection control={form.control} />
                  </AccordionContent>
                </AccordionItem>

                {/* 4. General Survey */}
                <AccordionItem value="general-survey">
                  <AccordionTrigger className="text-base font-semibold text-foreground px-1">
                    <span className="flex items-center gap-2">
                      <Clipboard className="size-4 text-teal-600" />
                      4. General Survey (Physical Findings)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-1">
                    <GeneralSurveySection control={form.control} />
                  </AccordionContent>
                </AccordionItem>

                {/* 5. NCD Assessment */}
                <AccordionItem value="ncd-assessment">
                  <AccordionTrigger className="text-base font-semibold text-foreground px-1">
                    <span className="flex items-center gap-2">
                      <Shield className="size-4 text-orange-600" />
                      5. NCD High Risk Assessment
                      {age < 25 && (
                        <Badge
                          variant="secondary"
                          className="text-xs font-normal ml-1"
                        >
                          Age &lt;25
                        </Badge>
                      )}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-1">
                    <NcdAssessmentSection
                      control={form.control}
                      patientAge={age}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* 6. Lab Results */}
                <AccordionItem value="lab-results">
                  <AccordionTrigger className="text-base font-semibold text-foreground px-1">
                    <span className="flex items-center gap-2">
                      <FlaskConical className="size-4 text-yellow-600" />
                      6. Laboratory Results
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-1">
                    <LabResultsSection control={form.control} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardContent className="pt-4 space-y-2">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Notes / Clinical Remarks
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional observations, referrals, follow-up plans..."
                        rows={4}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit button */}
          <div className="flex justify-end gap-3 pb-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[160px]"
              size="lg"
            >
              <Save className="size-4 mr-2" />
              {isSubmitting
                ? "Saving..."
                : existingRecord
                  ? "Update Profile"
                  : "Save Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
