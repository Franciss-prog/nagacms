/**
 * Client-side validation for Barangay Profile form
 * Provides real-time field-level validation before server submission
 */

import type { BarangayProfileFormData } from "@/components/barangay-profiling/barangay-profile-form";

export type ValidationError = Record<string, string>;

/**
 * Validates form data client-side and returns field-level errors
 * Only validates required fields for better UX
 */
export function validateBarangayProfileForm(
  data: BarangayProfileFormData,
): ValidationError {
  const errors: ValidationError = {};

  // Required fields validation
  if (!data.membershipType) {
    errors.membershipType = "Membership type is required";
  }

  if (!data.lastName || data.lastName.trim() === "") {
    errors.lastName = "Last name is required";
  }

  if (!data.firstName || data.firstName.trim() === "") {
    errors.firstName = "First name is required";
  }

  if (!data.age || data.age === "") {
    errors.age = "Age is required";
  } else {
    const ageNum = parseInt(data.age, 10);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
      errors.age = "Age must be between 0 and 150";
    }
  }

  if (!data.birthdate || data.birthdate === "") {
    errors.birthdate = "Birthdate is required";
  } else {
    // Validate birthdate format (YYYY-MM-DD)
    const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthdateRegex.test(data.birthdate)) {
      errors.birthdate = "Invalid birthdate format";
    } else {
      // Check if date is valid
      const date = new Date(data.birthdate);
      if (isNaN(date.getTime())) {
        errors.birthdate = "Invalid birthdate";
      } else if (date > new Date()) {
        errors.birthdate = "Birthdate cannot be in the future";
      }
    }
  }

  if (!data.civilStatus || data.civilStatus === "") {
    errors.civilStatus = "Civil status is required";
  }

  // Current Address validation
  if (!data.currentBarangay || data.currentBarangay.trim() === "") {
    errors.currentBarangay = "Barangay is required";
  }

  if (!data.currentStreet || data.currentStreet.trim() === "") {
    errors.currentStreet = "House/Street is required";
  }

  if (!data.currentCity || data.currentCity.trim() === "") {
    errors.currentCity = "City/Municipality is required";
  }

  if (!data.currentProvince || data.currentProvince.trim() === "") {
    errors.currentProvince = "Province is required";
  }

  // Optional: Email validation if provided
  if (data.email && data.email.trim() !== "") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = "Invalid email address";
    }
  }

  return errors;
}

/**
 * Check if there are any validation errors
 */
export function hasValidationErrors(errors: ValidationError): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Get count of validation errors
 */
export function getErrorCount(errors: ValidationError): number {
  return Object.keys(errors).length;
}

/**
 * Get a specific field error message
 */
export function getFieldError(
  errors: ValidationError,
  field: string,
): string | undefined {
  return errors[field];
}
