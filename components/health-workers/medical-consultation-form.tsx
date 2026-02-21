"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import {
  medicalConsultationRecordSchema,
  type MedicalConsultationRecordInput,
  type ConsultationType,
} from "@/lib/schemas/health-workers.schema";

interface MedicalConsultationFormProps {
  barangay: string;
  residentId?: string;
  residentName?: string;
  residentData?: {
    full_name: string;
    birth_date?: string;
    sex?: string;
    philhealth_no?: string;
    purok?: string;
  };
  onSuccess?: () => void;
}

const CONSULTATION_TYPES: { value: ConsultationType; label: string }[] = [
  { value: "general", label: "General" },
  { value: "family_planning", label: "Family Planning" },
  { value: "prenatal", label: "Prenatal" },
  { value: "postpartum", label: "Postpartum" },
  { value: "tuberculosis", label: "Tuberculosis" },
  { value: "dental_care", label: "Dental Care" },
  { value: "child_care", label: "Child Care" },
  { value: "immunization", label: "Immunization" },
  { value: "child_nutrition", label: "Child Nutrition" },
  { value: "sick_children", label: "Sick Children" },
  { value: "injury", label: "Injury" },
  { value: "firecracker_injury", label: "Firecracker Injury" },
  { value: "adult_immunization", label: "Adult Immunization" },
];

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function MedicalConsultationForm({
  barangay,
  residentId,
  residentName,
  residentData,
  onSuccess,
}: MedicalConsultationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Parse resident name into parts if provided
  const parseResidentName = () => {
    if (!residentData?.full_name) return { first: "", last: "", middle: "" };
    const parts = residentData.full_name.split(" ");
    if (parts.length === 1) return { first: parts[0], last: "", middle: "" };
    if (parts.length === 2)
      return { first: parts[0], last: parts[1], middle: "" };
    return {
      first: parts[0],
      middle: parts.slice(1, -1).join(" "),
      last: parts[parts.length - 1],
    };
  };

  const nameParts = parseResidentName();

  const form = useForm<MedicalConsultationRecordInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(medicalConsultationRecordSchema) as any,
    defaultValues: {
      resident_id: residentId,
      last_name: nameParts.last,
      first_name: nameParts.first,
      middle_name: nameParts.middle,
      suffix: "",
      age: residentData?.birth_date ? calculateAge(residentData.birth_date) : 0,
      sex: (residentData?.sex === "Male"
        ? "M"
        : residentData?.sex === "Female"
          ? "F"
          : undefined) as "M" | "F" | undefined,
      address: residentData?.purok
        ? `${residentData.purok}, ${barangay}`
        : barangay,
      philhealth_id: residentData?.philhealth_no || "",
      barangay: barangay,
      mode_of_transaction: "walk_in",
      consultation_date: new Date().toISOString().split("T")[0],
      consultation_time: "",
      attending_provider: "",
      nature_of_visit: "new_consultation",
      consultation_types: ["general"],
      healthcare_provider_name: "",
    },
  });

  async function onSubmit(data: MedicalConsultationRecordInput) {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch(
        "/api/health-workers/medical-consultation-records",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            // Convert empty strings to undefined for optional fields
            consultation_time: data.consultation_time || undefined,
            temperature: data.temperature || undefined,
            blood_pressure_systolic: data.blood_pressure_systolic || undefined,
            blood_pressure_diastolic:
              data.blood_pressure_diastolic || undefined,
            weight_kg: data.weight_kg || undefined,
            height_cm: data.height_cm || undefined,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create record");
      }

      setSubmitStatus("success");
      form.reset({
        resident_id: residentId,
        last_name: nameParts.last,
        first_name: nameParts.first,
        middle_name: nameParts.middle,
        suffix: "",
        age: residentData?.birth_date
          ? calculateAge(residentData.birth_date)
          : 0,
        sex: (residentData?.sex === "Male"
          ? "M"
          : residentData?.sex === "Female"
            ? "F"
            : undefined) as "M" | "F" | undefined,
        address: residentData?.purok
          ? `${residentData.purok}, ${barangay}`
          : barangay,
        philhealth_id: residentData?.philhealth_no || "",
        barangay: barangay,
        mode_of_transaction: "walk_in",
        consultation_date: new Date().toISOString().split("T")[0],
        consultation_time: "",
        attending_provider: "",
        nature_of_visit: "new_consultation",
        consultation_types: ["general"],
        healthcare_provider_name: "",
      });
      onSuccess?.();

      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred",
      );
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Medical Consultation Form
        </CardTitle>
        <CardDescription className="text-base">
          CHU/RHU Consultation Record {residentName && `- ${residentName}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Section I: Patient Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                I. Patient Information (Impormasyon ng Pasyente)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name (Apelyido) *</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name (Pangalan) *</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="middle_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name (Gitnang Pangalan)</FormLabel>
                      <FormControl>
                        <Input placeholder="Middle name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="suffix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suffix</FormLabel>
                      <FormControl>
                        <Input placeholder="Jr., Sr., II, III" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age (Edad) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="150"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sex (Kasarian) *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">Male (M)</SelectItem>
                          <SelectItem value="F">Female (F)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="philhealth_id"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>PhilHealth ID No.</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="PhilHealth ID (if applicable)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Tirahan) *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Complete residential address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section II: CHU/RHU Personnel Only */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                II. For CHU/RHU Personnel Only
              </h3>

              {/* Mode of Transaction */}
              <FormField
                control={form.control}
                name="mode_of_transaction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode of Transaction *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="walk_in" id="walk_in" />
                          <Label htmlFor="walk_in">Walk-in</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="visited" id="visited" />
                          <Label htmlFor="visited">Visited</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="referral" id="referral" />
                          <Label htmlFor="referral">Referral</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Referral Fields */}
              {form.watch("mode_of_transaction") === "referral" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <FormField
                    control={form.control}
                    name="referred_from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referred From</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Referring facility/provider"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="referred_to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referred To</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Receiving facility/provider"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="referral_reason"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Reason(s) for Referral</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Reason for referral..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="referred_by"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referred By</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Name of referring provider"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Consultation Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="consultation_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Consultation *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consultation_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consultation Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Vital Signs */}
              <div className="space-y-2">
                <h4 className="font-medium">Vital Signs</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperature (°C)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="37.0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="blood_pressure_systolic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>BP Systolic</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="120"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="blood_pressure_diastolic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>BP Diastolic</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="80"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight_kg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="60.0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height_cm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="165.0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Provider Info */}
              <FormField
                control={form.control}
                name="attending_provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of Attending Provider *</FormLabel>
                    <FormControl>
                      <Input placeholder="Attending provider name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nature of Visit */}
              <FormField
                control={form.control}
                name="nature_of_visit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nature of Visit *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="new_consultation"
                            id="new_consultation"
                          />
                          <Label htmlFor="new_consultation">
                            New Consultation/Case
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="new_admission"
                            id="new_admission"
                          />
                          <Label htmlFor="new_admission">New Admission</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="follow_up" id="follow_up" />
                          <Label htmlFor="follow_up">Follow-up Visit</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type of Consultation */}
              <FormField
                control={form.control}
                name="consultation_types"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Type of Consultation / Purpose of Visit *
                    </FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {CONSULTATION_TYPES.map((type) => (
                          <div
                            key={type.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={type.value}
                              checked={field.value?.includes(type.value)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                if (checked) {
                                  field.onChange([...current, type.value]);
                                } else {
                                  field.onChange(
                                    current.filter((v) => v !== type.value),
                                  );
                                }
                              }}
                            />
                            <Label htmlFor={type.value} className="text-sm">
                              {type.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Clinical Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Clinical Information
              </h3>

              <FormField
                control={form.control}
                name="chief_complaints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chief Complaints</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Patient's main complaints..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnosis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Clinical diagnosis..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consultation_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultation Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="History, examination findings, notes..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medication_treatment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medication / Treatment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Prescribed medications and treatments..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="laboratory_findings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Laboratory Findings / Impression</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Lab results and impressions..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="performed_laboratory_test"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Performed Laboratory Test</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tests performed..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="healthcare_provider_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name of Health Care Provider (Signature) *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Healthcare provider who signed the form"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[150px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Consultation"
                )}
              </Button>

              {submitStatus === "success" && (
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Record saved successfully!
                </div>
              )}

              {submitStatus === "error" && (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  {errorMessage}
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
