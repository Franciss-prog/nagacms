"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import type { Resident } from "@/lib/types";

interface YakakFormProps {
  residents: Resident[];
  isLoading?: boolean;
  onSubmit?: (formData: YakakFormData) => Promise<void>;
  onSuccess?: () => void;
}

export interface YakakFormData {
  resident_id: string;
  philhealth_no?: string;
  membership_type: "individual" | "family" | "senior" | "pwd";
}

export function YakakForm({
  residents,
  isLoading = false,
  onSubmit,
  onSuccess,
}: YakakFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null,
  );
  const [formData, setFormData] = useState<YakakFormData>({
    resident_id: "",
    philhealth_no: "",
    membership_type: "individual",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.resident_id) {
      const resident = residents.find((r) => r.id === formData.resident_id);
      setSelectedResident(resident || null);
    } else {
      setSelectedResident(null);
    }
  }, [formData.resident_id, residents]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.resident_id) {
      newErrors.resident_id = "Please select a resident";
    }
    if (!formData.membership_type) {
      newErrors.membership_type = "Please select membership type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setSuccess(true);
      setFormData({
        resident_id: "",
        philhealth_no: "",
        membership_type: "individual",
      });
      setSelectedResident(null);

      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New YAKAP Application</CardTitle>
        <CardDescription>
          Register a resident for YAKAP (Kalusugan Para sa Lahat) health
          insurance coverage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Resident Selection */}
          <div className="space-y-2">
            <Label htmlFor="resident_id">Select Resident *</Label>
            <Select
              value={formData.resident_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, resident_id: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a resident from the barangay" />
              </SelectTrigger>
              <SelectContent>
                {residents.map((resident) => (
                  <SelectItem key={resident.id} value={resident.id}>
                    {resident.full_name}{" "}
                    {resident.barangay && `(${resident.barangay})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.resident_id && (
              <p className="text-sm text-red-600">{errors.resident_id}</p>
            )}
          </div>

          {/* Selected Resident Info */}
          {selectedResident && (
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Full Name
                    </p>
                    <p className="font-medium">{selectedResident.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Barangay</p>
                    <p className="font-medium">{selectedResident.barangay}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Birth Date
                    </p>
                    <p className="font-medium">
                      {selectedResident.birth_date || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Gender</p>
                    <p className="font-medium">
                      {selectedResident.sex || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Contact</p>
                    <p className="font-medium">
                      {selectedResident.contact_number || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Purok</p>
                    <p className="font-medium">{selectedResident.purok}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* PhilHealth Number */}
          <div className="space-y-2">
            <Label htmlFor="philhealth_no">PhilHealth Number (Optional)</Label>
            <Input
              id="philhealth_no"
              placeholder="12-345678901-2"
              value={formData.philhealth_no}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  philhealth_no: e.target.value,
                }))
              }
            />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Format: XX-XXXXXXXXX-X (PhilHealth ID number if available)
            </p>
          </div>

          {/* Membership Type */}
          <div className="space-y-2">
            <Label htmlFor="membership_type">Membership Type *</Label>
            <Select
              value={formData.membership_type}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  membership_type: value as YakakFormData["membership_type"],
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select membership type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="senior">Senior Citizen</SelectItem>
                <SelectItem value="pwd">
                  Person with Disability (PWD)
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.membership_type && (
              <p className="text-sm text-red-600">{errors.membership_type}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex gap-3 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex gap-3 rounded-md bg-green-50 p-4 text-sm text-green-700 dark:bg-green-950 dark:text-green-200">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <p>YAKAP application submitted successfully!</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Submitting..." : "Submit YAKAP Application"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  resident_id: "",
                  philhealth_no: "",
                  membership_type: "individual",
                });
                setSelectedResident(null);
                setError(null);
                setSuccess(false);
                setErrors({});
              }}
              disabled={isSubmitting || isLoading}
            >
              Clear
            </Button>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400">
            * Required fields. Fields are aligned with PhilHealth Konsulta
            Registration requirements.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
