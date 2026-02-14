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
import { createMaternalHealthRecord } from "@/lib/queries/health-workers";
import type { MaternalHealthRecord } from "@/lib/types";

interface MaternalHealthFormProps {
  residentId: string;
  residentName: string;
  barangay: string;
  recordedBy: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MaternalHealthForm({
  residentId,
  residentName,
  barangay,
  recordedBy,
  onSuccess,
  onCancel,
}: MaternalHealthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [offline, setOffline] = useState(isOffline());
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    visit_date: new Date().toISOString().split("T")[0],
    trimester: "1",
    blood_pressure_systolic: "",
    blood_pressure_diastolic: "",
    weight: "",
    height: "",
    hemoglobin: "",
    tetanus_toxoid: "yes",
    iron_supplement: "yes",
    prenatal_vitamins: "yes",
    health_complications: "",
    notes: "",
    next_visit_date: "",
  });

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
        MaternalHealthRecord,
        "id" | "created_at" | "updated_at"
      > = {
        resident_id: residentId,
        visit_date: formData.visit_date,
        trimester: formData.trimester as any,
        blood_pressure_systolic: formData.blood_pressure_systolic
          ? parseInt(formData.blood_pressure_systolic)
          : undefined,
        blood_pressure_diastolic: formData.blood_pressure_diastolic
          ? parseInt(formData.blood_pressure_diastolic)
          : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        hemoglobin: formData.hemoglobin
          ? parseFloat(formData.hemoglobin)
          : undefined,
        tetanus_toxoid: formData.tetanus_toxoid === "yes",
        iron_supplement: formData.iron_supplement === "yes",
        prenatal_vitamins: formData.prenatal_vitamins === "yes",
        health_complications: formData.health_complications || undefined,
        notes: formData.notes,
        next_visit_date: formData.next_visit_date || undefined,
        recorded_by: recordedBy,
        photo_url: photoFile ? URL.createObjectURL(photoFile) : undefined,
        synced: false,
      };

      if (offline) {
        addToQueue("maternal_health", record);
        setSuccess(
          "Maternal health record saved offline. It will sync when you're online.",
        );
      } else {
        await createMaternalHealthRecord(record);
        setSuccess("Maternal health record saved successfully!");
      }

      setFormData({
        visit_date: new Date().toISOString().split("T")[0],
        trimester: "1",
        blood_pressure_systolic: "",
        blood_pressure_diastolic: "",
        weight: "",
        height: "",
        hemoglobin: "",
        tetanus_toxoid: "yes",
        iron_supplement: "yes",
        prenatal_vitamins: "yes",
        health_complications: "",
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
          : "Error saving maternal health record";
      setError(message);
      addToQueue("maternal_health", formData);
      setSuccess("Record saved offline due to error. It will sync later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Maternal Health Visit</CardTitle>
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

          {/* Trimester */}
          <div>
            <label className="block text-sm font-medium mb-1">Trimester</label>
            <Select
              value={formData.trimester}
              onValueChange={(value) => handleSelectChange("trimester", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">First Trimester</SelectItem>
                <SelectItem value="2">Second Trimester</SelectItem>
                <SelectItem value="3">Third Trimester</SelectItem>
                <SelectItem value="postpartum">Postpartum</SelectItem>
              </SelectContent>
            </Select>
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
              <div>
                <label className="block text-xs font-medium mb-1">
                  Height (cm)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Hemoglobin */}
            <div className="mt-3">
              <label className="block text-xs font-medium mb-1">
                Hemoglobin (g/dL)
              </label>
              <Input
                type="number"
                step="0.1"
                name="hemoglobin"
                value={formData.hemoglobin}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Interventions Section */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-3">Interventions</h4>

            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Tetanus Toxoid
                </label>
                <Select
                  value={formData.tetanus_toxoid}
                  onValueChange={(value) =>
                    handleSelectChange("tetanus_toxoid", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Given</SelectItem>
                    <SelectItem value="no">Not Given</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Iron Supplement
                </label>
                <Select
                  value={formData.iron_supplement}
                  onValueChange={(value) =>
                    handleSelectChange("iron_supplement", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Given</SelectItem>
                    <SelectItem value="no">Not Given</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Prenatal Vitamins
                </label>
                <Select
                  value={formData.prenatal_vitamins}
                  onValueChange={(value) =>
                    handleSelectChange("prenatal_vitamins", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Given</SelectItem>
                    <SelectItem value="no">Not Given</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Health Complications */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Health Complications
            </label>
            <textarea
              name="health_complications"
              placeholder="Note any complications..."
              value={formData.health_complications}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
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
            <label className="block text-sm font-medium mb-1">Notes</label>
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
              {isLoading ? "Saving..." : "Save Maternal Health Record"}
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
