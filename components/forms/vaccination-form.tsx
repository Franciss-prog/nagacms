"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState as useStateHook } from "react";
import { AlertCircle, CheckCircle2, Upload, X } from "lucide-react";
import { addToQueue, isOffline } from "@/lib/utils/offline-queue";
import { createVaccinationRecord } from "@/lib/queries/health-workers";
import type { VaccinationRecord } from "@/lib/types";

interface VaccinationFormProps {
  residentId: string;
  residentName: string;
  barangay: string;
  recordedBy: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function VaccinationForm({
  residentId,
  residentName,
  barangay,
  recordedBy,
  onSuccess,
  onCancel,
}: VaccinationFormProps) {
  const [isLoading, setIsLoading] = useStateHook(false);
  const [offline, setOffline] = useStateHook(isOffline());
  const [photoFile, setPhotoFile] = useStateHook<File | null>(null);
  const [error, setError] = useStateHook<string | null>(null);
  const [success, setSuccess] = useStateHook<string | null>(null);

  const [formData, setFormData] = useStateHook({
    vaccine_name: "",
    dose_number: 1,
    vaccine_date: new Date().toISOString().split("T")[0],
    vaccination_site: "",
    batch_number: "",
    next_dose_date: "",
    notes: "",
  });

  const vaccines = [
    "COVID-19",
    "Measles",
    "Polio",
    "DPT",
    "BCG",
    "HPV",
    "Influenza",
    "Typhoid",
    "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const record: Omit<
        VaccinationRecord,
        "id" | "created_at" | "updated_at"
      > = {
        resident_id: residentId,
        vaccine_name: formData.vaccine_name,
        dose_number: parseInt(formData.dose_number as any),
        vaccine_date: formData.vaccine_date,
        vaccination_site: formData.vaccination_site,
        batch_number: formData.batch_number,
        next_dose_date: formData.next_dose_date || undefined,
        status: "completed",
        notes: formData.notes,
        administered_by: recordedBy,
        photo_url: photoFile ? URL.createObjectURL(photoFile) : undefined,
        synced: false,
      };

      if (offline) {
        // Add to offline queue
        addToQueue("vaccination", record);
        setSuccess(
          "Vaccination record saved offline. It will sync when you're online.",
        );
      } else {
        // Try to save to Supabase
        await createVaccinationRecord(record);
        setSuccess("Vaccination record saved successfully!");
      }

      // Reset form
      setFormData({
        vaccine_name: "",
        dose_number: 1,
        vaccine_date: new Date().toISOString().split("T")[0],
        vaccination_site: "",
        batch_number: "",
        next_dose_date: "",
        notes: "",
      });
      setPhotoFile(null);

      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error saving vaccination record";
      setError(message);

      // Fall back to offline queue on error
      addToQueue("vaccination", formData);
      setSuccess("Record saved offline due to error. It will sync later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Vaccination</CardTitle>
        <CardDescription>
          {residentName} - {barangay}
        </CardDescription>
        {offline && (
          <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200 flex items-center gap-2 text-sm text-yellow-700">
            <AlertCircle className="w-4 h-4" />
            Working offline - data will sync when connection restored
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vaccine Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Vaccine Type *
            </label>
            <Select
              value={formData.vaccine_name}
              onValueChange={(value) =>
                handleSelectChange("vaccine_name", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vaccine" />
              </SelectTrigger>
              <SelectContent>
                {vaccines.map((vaccine) => (
                  <SelectItem key={vaccine} value={vaccine}>
                    {vaccine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dose Number */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Dose Number *
            </label>
            <Input
              type="number"
              name="dose_number"
              value={formData.dose_number}
              onChange={handleChange}
              min="1"
              max="5"
              required
            />
          </div>

          {/* Vaccine Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Vaccination Date *
            </label>
            <Input
              type="date"
              name="vaccine_date"
              value={formData.vaccine_date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Vaccination Site */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Vaccination Site
            </label>
            <Input
              type="text"
              name="vaccination_site"
              placeholder="e.g., Left Arm, Right Arm"
              value={formData.vaccination_site}
              onChange={handleChange}
            />
          </div>

          {/* Batch Number */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Batch Number
            </label>
            <Input
              type="text"
              name="batch_number"
              value={formData.batch_number}
              onChange={handleChange}
            />
          </div>

          {/* Next Dose Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Next Dose Date
            </label>
            <Input
              type="date"
              name="next_dose_date"
              value={formData.next_dose_date}
              onChange={handleChange}
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Photo (Optional)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                capture="environment"
                className="hidden"
                id="photo-input"
              />
              <label
                htmlFor="photo-input"
                className="flex items-center gap-2 px-4 py-2 rounded border border-gray-300 cursor-pointer hover:bg-gray-50"
              >
                <Upload className="w-4 h-4" />
                Choose Photo
              </label>
              {photoFile && (
                <span className="text-sm text-gray-600">{photoFile.name}</span>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              placeholder="Any additional notes..."
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !formData.vaccine_name}
              className="flex-1"
            >
              {isLoading ? "Saving..." : "Save Vaccination"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
