# YAKAP (PhilHealth Konsulta) Form Implementation

## Overview

This implementation provides a comprehensive step-by-step form for PhilHealth Konsulta (Yakap) application submission. The form is designed to collect detailed personal, family, address, and membership information required for health insurance coverage registration.

## Components

### 1. **YAKAP Service** (`lib/services/yakap.service.ts`)

The service layer handles all business logic for YAKAP applications:

#### Interfaces

```typescript
interface YakapFormData {
  // Personal Information
  philhealthNo: string;
  lastName: string;
  firstName: string;
  middleName: string;
  suffix: string;
  sex: string;
  age: string;
  birthdate: string;
  birthPlace: string;
  civilStatus: string;
  maidenLastName: string;
  maidenMiddleName: string;
  educationalAttainment: string;
  employmentStatus: string;
  occupation: string;
  religion: string;
  indigenous: string;
  bloodType: string;

  // Family Information
  motherFirstName: string;
  motherLastName: string;
  motherMiddleName: string;
  motherBirthdate: string;
  fatherFirstName: string;
  fatherLastName: string;
  fatherMiddleName: string;
  fatherBirthdate: string;
  spouseFirstName: string;
  spouseLastName: string;
  spouseBirthdate: string;

  // Address & Contact
  streetAddress: string;
  province: string;
  cityMunicipality: string;
  barangay: string;
  email: string;
  mobile: string;

  // Membership
  membershipType: string;
  firstChoiceKPP: string;
  secondChoiceKPP: string;
}

interface YakapApplication {
  id: string;
  resident_id: string;
  resident_name: string;
  barangay: string;
  membership_type: "individual" | "family" | "senior" | "pwd";
  philhealth_no: string | null;
  status: "pending" | "approved" | "returned" | "rejected";
  form_data: YakapFormData;
  applied_at: string;
  approved_by: string | null;
  approved_at: string | null;
  remarks: string | null;
  document_url: string | null;
  created_at: string;
  updated_at: string;
}
```

#### Key Methods

**1. `submitApplication(formData, residentId)`**

- Submits a new YAKAP application
- Checks for existing pending/approved applications
- Validates membership type
- Returns success status and application data

**2. `getApplicationStatus(residentId)`**

- Retrieves the most recent application for a resident
- Returns application data or empty state

**3. `getApplicationHistory(residentId)`**

- Returns all applications submitted by a resident
- Ordered by creation date (newest first)

**4. `canApply(residentId)`**

- Checks if a resident can submit a new application
- Returns ability status and reason if restricted

**5. `updateApplication(applicationId, formData)`**

- Updates an existing application (for re-submission)
- Resets status to 'pending' for re-review
- Clears previous remarks

**6. `getApplicationById(applicationId)`**

- Retrieves a specific application by ID

### 2. **Step-by-Step Form Component** (`components/yakap/yakap-form-step.tsx`)

A 3-step form component that guides users through the application process:

#### Step 1: Personal Information

- Name fields (Last, First, Middle, Suffix)
- Birth details (Date, Place, Age)
- Personal characteristics (Sex, Blood Type, Religion)
- Status information (Civil Status, Employment Status)
- Additional details (Education, Occupation, Indigenous Group)
- PhilHealth Number

#### Step 2: Address & Contact Information

- Street Address
- Province, City/Municipality, Barangay
- Email Address
- Mobile Number

#### Step 3: Family & Membership Information

- Mother's Information (Name, Birthdate)
- Father's Information (Name, Birthdate)
- Spouse Information (if applicable)
- Membership Type Selection
- Health Provider Preferences (First & Second Choice KPP)

### 3. **Database Migration** (`migrations/001_yakap_applications_add_form_data.sql`)

Updates the `yakap_applications` table to support comprehensive form data:

#### Changes

- Adds `resident_id` column for resident linkage
- Adds `form_data` JSONB column to store complete form
- Updates membership_type constraint to valid values
- Creates indexes for performance optimization
- Adds documentation comments

## Usage

### Basic Implementation

```typescript
import { YakapFormStep } from "@/components/yakap/yakap-form-step";

export function YakapApplicationPage({ residentId }: { residentId: string }) {
  return (
    <YakapFormStep
      residentId={residentId}
      onSuccess={() => {
        // Handle successful submission
        console.log("Application submitted!");
      }}
    />
  );
}
```

### Checking Application Status

```typescript
import { yakapService } from "@/lib/services/yakap.service";

// Check if user has pending application
const { hasApplication, application } =
  await yakapService.getApplicationStatus(residentId);

// Check if user can apply
const { canApply, reason } = await yakapService.canApply(residentId);
```

### Getting Application History

```typescript
const { applications, error } =
  await yakapService.getApplicationHistory(residentId);

// Display all past applications
applications.forEach((app) => {
  console.log(`Application ${app.id}: ${app.status}`);
});
```

## Database Schema

```sql
CREATE TABLE yakap_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID,
  resident_name TEXT NOT NULL,
  barangay TEXT NOT NULL,
  membership_type TEXT NOT NULL CHECK (membership_type IN ('individual', 'family', 'senior', 'pwd')),
  philhealth_no TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'returned', 'rejected')),
  form_data JSONB,
  applied_at TIMESTAMP DEFAULT now(),
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP,
  remarks TEXT,
  document_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),

  -- Indexes
  INDEX idx_resident_id (resident_id),
  INDEX idx_barangay (barangay),
  INDEX idx_status (status),
  INDEX idx_applied_at (applied_at),
  INDEX idx_membership_type (membership_type),
  INDEX idx_form_data (form_data) USING GIN
);
```

## Membership Types

- **Individual**: Single person membership
- **Family**: Family group coverage
- **Senior**: Senior citizen (60+ years old)
- **PWD**: Person with Disability

## Form Validation

### Step 1 Validation

- Last Name (required)
- First Name (required)
- Sex (required)
- Birthdate (required)

### Step 2 Validation

- Street Address (required)
- Barangay (required)
- Email (required)
- Mobile Number (required)

### Step 3 Validation

- Membership Type (required)

## Status Workflow

1. **pending**: Application submitted, awaiting review
2. **approved**: Application approved by health office
3. **returned**: Application returned for corrections/missing documents
4. **rejected**: Application rejected (final decision)

## Error Handling

The service includes comprehensive error handling:

- **Duplicate Application Prevention**: Blocks new submissions if pending/approved application exists
- **Validation Errors**: Detailed field-level error messages
- **Database Errors**: Graceful error handling with user-friendly messages
- **Try-Catch Blocks**: All async operations wrapped with error handling

## Features

✅ Step-by-step guided form interface
✅ Comprehensive personal information collection
✅ Family relationship tracking
✅ Address and contact information
✅ Membership type selection with provider preferences
✅ Real-time form validation
✅ Error handling and user feedback
✅ Success notifications
✅ Application history tracking
✅ Duplicate application prevention
✅ Re-submission support for returned applications
✅ JSONB data storage for flexibility

## Integration Notes

1. Ensure the `users` table exists for the `approved_by` foreign key
2. The `form_data` JSONB column provides flexibility for future enhancements
3. All timestamps are in UTC (with timezone)
4. The component uses Supabase for backend operations
5. Authentication is required (uses `createServerSupabaseClient`)

## Next Steps

1. Run the migration to update the database schema
2. Update your dashboard/yakap pages to import `YakapFormStep`
3. Integrate the form into your application flow
4. Set up approval workflows in the admin dashboard
5. Configure email notifications for application status changes
