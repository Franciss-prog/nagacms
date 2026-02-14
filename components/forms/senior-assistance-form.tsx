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
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { addToQueue, isOffline } from "@/lib/utils/offline-queue";
import { createSeniorAssistanceRecord } from "@/lib/queries/health-workers";
import type { SeniorAssistanceRecord } from "@/lib/types";

interface SeniorAssistanceFormProps {
  residentId: string;
  residentName: string;
  barangay: string;
  recordedBy: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SeniorAssistanceForm({
  residentId,
  residentName,
  barangay,
  recordedBy,
  onSuccess,
  onCancel,
}: SeniorAssistanceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [offline, setOffline] = useState(isOffline());
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    visit_date: new Date().toISOString().split("T")[0],
    blood_pressure_systolic: "",
    blood_pressure_diastolic: "",
    heart_rate: "",
    blood_glucose: "",
    weight: "",
    health_concerns: "",
    medications: "",
    mobility_status: "independent",
    cognitive_status: "sharp",
    assistance_type: "",
    referral_needed: "no",
    referral_to: "",
    notes: "",
    next_visit_date: "",
  });

  const assistanceTypes = [
    "Financial Assistance",
    "Medical Support",
    "Home Care",
    "Counseling",
    "Social Support",
    "Food Assistance",
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
        SeniorAssistanceRecord,
        "id" | "created_at" | "updated_at"
      > = {
        resident_id: residentId,
        visit_date: formData.visit_date,
        blood_pressure_systolic: formData.blood_pressure_systolic
          ? parseInt(formData.blood_pressure_systolic)
          : undefined,
        blood_pressure_diastolic: formData.blood_pressure_diastolic
          ? parseInt(formData.blood_pressure_diastolic)
          : undefined,
        heart_rate: formData.heart_rate
          ? parseInt(formData.heart_rate)
          : undefined,
        blood_glucose: formData.blood_glucose
          ? parseFloat(formData.blood_glucose)
          : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        health_concerns: formData.health_concerns || undefined,
        medications: formData.medications || undefined,
        mobility_status: formData.mobility_status as any,
        cognitive_status: formData.cognitive_status as any,
        assistance_type: formData.assistance_type || undefined,
        referral_needed: formData.referral_needed === "yes",
        referral_to: formData.referral_to || undefined,
        notes: formData.notes,
        next_visit_date: formData.next_visit_date || undefined,
        recorded_by: recordedBy,
        photo_url: photoFile ? URL.createObjectURL(photoFile) : undefined,
        synced: false,
      };

      if (offline) {
        addToQueue("senior_assistance", record);
        setSuccess(
          "Senior assistance record saved offline. It will sync when you're online.",
        );
      } else {
        await createSeniorAssistanceRecord(record);
        setSuccess("Senior assistance record saved successfully!");
      }

      setFormData({
        visit_date: new Date().toISOString().split("T")[0],
        blood_pressure_systolic: "",
        blood_pressure_diastolic: "",
        heart_rate: "",
        blood_glucose: "",
        weight: "",
        health_concerns: "",
        medications: "",
        mobility_status: "independent",
        cognitive_status: "sharp",
        assistance_type: "",
        referral_needed: "no",
        referral_to: "",
        notes: "",
        next_visit_date: "",
      });
      setPhotoFile(null);

      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Error saving senior assistance record";
      setError(message);
      addToQueue("senior_assistance", formData);
      setSuccess("Record saved offline due to error. It will sync later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Senior Citizen Check-up</CardTitle>
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
          {/* Visit Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Visit Date *
            </label>
            <Input
              type="date"
              name="visit_date"
              value={formData.visit_date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Vital Signs Section */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-3">Vital Signs</h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">
                  BP Systolic
                </label>
                <Input
                  type="number"
                  name="blood_pressure_systolic"
                  placeholder="mmHg"
                  value={formData.blood_pressure_systolic}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  BP Diastolic
                </label>
                <Input
                  type="number"
                  name="blood_pressure_diastolic"
                  placeholder="mmHg"
                  value={formData.blood_pressure_diastolic}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Heart Rate (bpm)
                </label>
                <Input
                  type="number"
                  name="heart_rate"
                  value={formData.heart_rate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Blood Glucose (mg/dL)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  name="blood_glucose"
                  value={formData.blood_glucose}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1">
                  Weight (kg)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Health Assessment Section */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-3">Health Assessment</h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Mobility Status
                </label>
                <Select
                  value={formData.mobility_status}
                  onValueChange={(value) =>
                    handleSelectChange("mobility_status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="independent">Independent</SelectItem>
                    <SelectItem value="assisted">Needs Assistance</SelectItem>
                    <SelectItem value="dependent">Fully Dependent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Cognitive Status
                </label>
                <Select
                  value={formData.cognitive_status}
                  onValueChange={(value) =>
                    handleSelectChange("cognitive_status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sharp">Sharp Mind</SelectItem>
                    <SelectItem value="mild_impairment">
                      Mild Impairment
                    </SelectItem>
                    <SelectItem value="moderate_impairment">
                      Moderate Impairment
                    </SelectItem>
                    <SelectItem value="severe_impairment">
                      Severe Impairment
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">
                Health Concerns
              </label>
              <textarea
                name="health_concerns"
                placeholder="List any health concerns..."
                value={formData.health_concerns}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={2}
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">
                Current Medications
              </label>
              <textarea
                name="medications"
                placeholder="List current medications..."
                value={formData.medications}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={2}
              />
            </div>
          </div>

          {/* Assistance Type */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-3">Assistance Needed</h4>

            <div>
              <label className="block text-sm font-medium mb-1">
                Type of Assistance
              </label>
              <Select
                value={formData.assistance_type}
                onValueChange={(value) =>
                  handleSelectChange("assistance_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assistance type" />
                </SelectTrigger>
                <SelectContent>
                  {assistanceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">
                Referral Needed
              </label>
              <Select
                value={formData.referral_needed}
                onValueChange={(value) =>
                  handleSelectChange("referral_needed", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.referral_needed === "yes" && (
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1">
                  Referral To
                </label>
                <Input
                  type="text"
                  name="referral_to"
                  placeholder="Facility or organization name"
                  value={formData.referral_to}
                  onChange={handleChange}
                />
              </div>
            )}
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

          {/* Next Visit Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Next Visit Date
            </label>
            <Input
              type="date"
              name="next_visit_date"
              value={formData.next_visit_date}
              onChange={handleChange}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Additional Notes
            </label>
            <textarea
              name="notes"
              placeholder="Any additional notes..."
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
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
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : "Save Senior Assistance Record"}
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
