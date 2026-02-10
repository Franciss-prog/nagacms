# Quick Reference: Staff Status Update Feature

## Files Modified

| File                                             | Changes                                        |
| ------------------------------------------------ | ---------------------------------------------- |
| `components/appointments/appointments-table.tsx` | Added status update dialog, buttons, and logic |
| `components/yakap/yakap-table.tsx`               | Added status update dialog, buttons, and logic |
| `components/yakap/yakap-applications-list.tsx`   | Integrated YakakTable for staff users          |
| `app/dashboard/appointments/page.tsx`            | Added session tracking and isStaff logic       |
| `app/dashboard/yakap/page.tsx`                   | Added session tracking and isStaff logic       |
| `lib/actions/appointments.ts`                    | Added server actions for status updates        |

## Files Created

| File                                          | Purpose                                   |
| --------------------------------------------- | ----------------------------------------- |
| `app/api/appointments/update-status/route.ts` | API endpoint to update appointment status |
| `app/api/yakap/update-status/route.ts`        | API endpoint to update YAKAP status       |
| `STAFF_STATUS_UPDATE_FEATURE.md`              | Detailed feature documentation            |

## How to Test

### Test Appointments Status Update:

1. Login as barangay_admin or admin
2. Navigate to Dashboard → Health Facility Appointments
3. Click "Update Status" button on any appointment
4. Select new status and optionally add notes
5. Click "Update Status" - table should refresh

### Test YAKAP Status Update:

1. Login as barangay_admin or admin
2. Navigate to Dashboard → YAKAP Application Form
3. Scroll to YAKAP Applications section
4. Click "Update" button on any application
5. Select new status and optionally add remarks
6. Click "Update Status" - table should refresh

### Test Authorization:

1. Login as regular user (not staff)
2. Try to access appointments or YAKAP pages
3. Status update buttons should NOT be visible
4. No "Update" actions should be available

## Key Features

✅ Role-based access control (staff only)
✅ Status update dialogs with optional notes/remarks
✅ Auto-refresh after successful updates
✅ Activity logging for audit trail
✅ Input validation and error handling
✅ Loading states for better UX
✅ Supports multiple status options per module

## Available Statuses

### Appointments:

- booked
- completed
- cancelled
- no_show

### YAKAP Applications:

- pending
- approved
- returned
- rejected

## Environment Requirements

- Supabase tables: `appointments`, `yakap_applications`, `activity_logs`, `users`
- User roles: `admin`, `barangay_admin`, `user`
- Next.js 13+ with server actions support
