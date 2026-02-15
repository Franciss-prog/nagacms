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
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  seniorAssistanceRecordSchema,
  type SeniorAssistanceRecordInput,
} from "@/lib/schemas/health-workers.schema";

interface SeniorAssistanceFormProps {
  residentId: string;
  residentName: string;
  onSuccess?: () => void;
}

export function SeniorAssistanceForm({
  residentId,
  residentName,
  onSuccess,
}: SeniorAssistanceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<SeniorAssistanceRecordInput>({
    resolver: zodResolver(seniorAssistanceRecordSchema),
    defaultValues: {
      resident_id: residentId,
      assistance_type: "medical_support",
      visit_date: new Date().toISOString().split("T")[0],
      vital_status: "stable",
      status: "completed",
    },
  });

  async function onSubmit(data: SeniorAssistanceRecordInput) {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch(
        "/api/health-workers/senior-assistance-records",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create record");
      }

      setSubmitStatus("success");
      form.reset({
        resident_id: residentId,
        assistance_type: "medical_support",
        visit_date: new Date().toISOString().split("T")[0],
        vital_status: "stable",
        status: "completed",
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
        <CardTitle>Senior Citizen Assistance</CardTitle>
        <CardDescription className="text-base">{residentName}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="assistance_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assistance Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="medical_support">
                          Medical Support
                        </SelectItem>
                        <SelectItem value="medication_delivery">
                          Medication Delivery
                        </SelectItem>
                        <SelectItem value="home_care">Home Care</SelectItem>
                        <SelectItem value="mobility_support">
                          Mobility Support
                        </SelectItem>
                        <SelectItem value="mental_health">
                          Mental Health
                        </SelectItem>
                        <SelectItem value="social_services">
                          Social Services
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visit_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visit Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="blood_pressure_systolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Systolic BP (mmHg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="120"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          )
                        }
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
                    <FormLabel>Diastolic BP (mmHg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="80"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="blood_glucose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Glucose (mg/dL)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="100"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medications_given"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medications Given</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List medications provided (name, dosage, frequency)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vital_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vital Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="stable">Stable</SelectItem>
                        <SelectItem value="improved">Improved</SelectItem>
                        <SelectItem value="declining">Declining</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visit Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="follow_up_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Follow-up Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any observations or recommendations"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {submitStatus === "success" && (
              <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                Senior assistance record saved successfully
              </div>
            )}

            {submitStatus === "error" && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4" />
                {errorMessage}
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Saving..." : "Save Assistance Record"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
