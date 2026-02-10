# Staff Status Update Feature - Implementation Summary

## Overview

Added functionality for staff (barangay_admin and admin roles) to update appointment and YAKAP form statuses with notes/remarks.

## Changes Made

### 1. **API Routes Created**

#### Appointment Status Update

- **File**: `app/api/appointments/update-status/route.ts`
- **Method**: PATCH
- **Authorization**: Only barangay_admin and admin roles
- **Payload**:
  - `appointmentId`: String (required)
  - `status`: String (required) - one of: booked, completed, cancelled, no_show
  - `notes`: String (optional)
- **Features**:
  - Updates appointment status
  - Records booked_at timestamp when status is "booked"
  - Logs activity to activity_logs table
  - Returns updated appointment data

#### YAKAP Status Update

- **File**: `app/api/yakap/update-status/route.ts`
- **Method**: PATCH
- **Authorization**: Only barangay_admin and admin roles
- **Payload**:
  - `yakakId`: String (required)
  - `status`: String (required) - one of: pending, approved, returned, rejected
  - `remarks`: String (optional)
- **Features**:
  - Updates YAKAP application status
  - Sets approver and approval timestamp when status is "approved"
  - Logs activity to activity_logs table
  - Returns updated YAKAP data

### 2. **Server Actions**

#### File: `lib/actions/appointments.ts`

- `updateAppointmentStatus()` - Server action to update appointment status
- `updateYakakApplicationStatus()` - Server action to update YAKAP status
- Both validate user authorization before making API calls

### 3. **Updated Components**

#### Appointments Table (`components/appointments/appointments-table.tsx`)

- Added `isStaff` prop to conditionally show update controls
- Added `onStatusUpdated` callback prop for refreshing data
- New status update dialog with:
  - Status dropdown selector
  - Optional notes textarea
  - Cancel/Update buttons
  - Loading state during update
- Displays "Update Status" button for each appointment (staff only)
- Available status options: booked, completed, cancelled, no_show

#### YAKAP Table (`components/yakap/yakap-table.tsx`)

- Added `isStaff` prop to conditionally show update controls
- Added `onStatusUpdated` callback prop for refreshing data
- New status update dialog with:
  - Status dropdown selector
  - Optional remarks textarea
  - Cancel/Update buttons
  - Loading state during update
- Displays "Update" button for each application (staff only)
- Available status options: pending, approved, returned, rejected

#### YAKAP Applications List (`components/yakap/yakap-applications-list.tsx`)

- Added `isStaff` and `onStatusUpdated` props
- Routes to YakakTable component when staff views the list
- Maintains original simple list view for non-staff users

### 4. **Updated Pages**

#### Appointments Page (`app/dashboard/appointments/page.tsx`)

- Added session state to track current user
- Calculates `isStaff` from user role
- Passes `isStaff` and `onStatusUpdated` to AppointmentsTable
- Auto-refreshes data after status updates

#### YAKAP Page (`app/dashboard/yakap/page.tsx`)

- Added session state to track current user
- Calculates `isStaff` from user role
- Passes `isStaff` and `onStatusUpdated` to YakakApplicationsList
- Auto-refreshes data after status updates

## Authorization Rules

- Only users with `barangay_admin` or `admin` roles can update statuses
- Unauthorized requests return 401 error
- All changes are logged to the activity_logs table

## User Experience

### For Staff Members:

1. View appointments/YAKAP forms in their respective dashboard pages
2. Click "Update Status" (appointments) or "Update" (YAKAP)
3. Select new status from dropdown
4. Optionally add notes/remarks
5. Click "Update Status" button
6. Table auto-refreshes with new data

### For Regular Users:

- Can view appointments and YAKAP forms
- Cannot see update buttons
- Cannot modify status

## Status Transitions

### Appointments:

- `available` → booked, completed, cancelled, no_show
- `booked` → completed, cancelled, no_show
- `completed` → (no further changes)
- `cancelled` → (no further changes)
- `no_show` → (no further changes)

### YAKAP Applications:

- `pending` → approved, returned, rejected
- `approved` → (no further changes typically, but can revert if needed)
- `returned` → pending (for resubmission)
- `rejected` → (no further changes typically)

## Database Integration

- Uses existing Supabase tables: `appointments`, `yakap_applications`, `activity_logs`
- Automatically tracks who made changes and when
- Maintains referential integrity with user_id in activity logs

## Error Handling

- Missing required fields: 400 Bad Request
- Unauthorized access: 401 Unauthorized
- Database errors: 500 Internal Server Error
- Client-side error alerts for user feedback
- Server-side logging for debugging
