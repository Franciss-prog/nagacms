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
  maternalHealthRecordSchema,
  type MaternalHealthRecordInput,
} from "@/lib/schemas/health-workers.schema";

interface MaternalHealthFormProps {
  residentId: string;
  residentName: string;
  onSuccess?: () => void;
}

export function MaternalHealthForm({
  residentId,
  residentName,
  onSuccess,
}: MaternalHealthFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<MaternalHealthRecordInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(maternalHealthRecordSchema) as any,
    defaultValues: {
      resident_id: residentId,
      record_type: "antenatal",
      visit_date: new Date().toISOString().split("T")[0],
      status: "normal",
    },
  });

  async function onSubmit(data: MaternalHealthRecordInput) {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch(
        "/api/health-workers/maternal-health-records",
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
        record_type: "antenatal",
        visit_date: new Date().toISOString().split("T")[0],
        status: "normal",
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
        <CardTitle>Maternal Health Visit</CardTitle>
        <CardDescription className="text-base">{residentName}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="record_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visit Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="antenatal">Antenatal</SelectItem>
                        <SelectItem value="postnatal">Postnatal</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
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

            <FormField
              control={form.control}
              name="trimester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trimester (if applicable)</FormLabel>
                  <Select
                    value={field.value?.toString() || ""}
                    onValueChange={(val) =>
                      field.onChange(val ? parseInt(val) : undefined)
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trimester" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">First (1-12 weeks)</SelectItem>
                      <SelectItem value="2">Second (13-26 weeks)</SelectItem>
                      <SelectItem value="3">Third (27-40 weeks)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="65.5"
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
                name="fetal_heart_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fetal Heart Rate (bpm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="140"
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
              name="complications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complications</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List any complications or concerns"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Textarea placeholder="Any other observations" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {submitStatus === "success" && (
              <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                Maternal health record saved successfully
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
              {isSubmitting ? "Saving..." : "Save Maternal Health Record"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
