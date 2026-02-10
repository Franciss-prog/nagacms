# Staff Status Update Feature - Visual Guide

## Feature Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Dashboard Pages                      │
├─────────────────────────────────────────────────────────────┤
│  /dashboard/appointments        /dashboard/yakap             │
│  - Fetches appointments          - Fetches YAKAP apps        │
│  - Checks user role              - Checks user role          │
│  - Sets isStaff prop             - Sets isStaff prop         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Table Components                          │
├─────────────────────────────────────────────────────────────┤
│  AppointmentsTable              YakakApplicationsList        │
│  - Displays appointments         - Routes to YakakTable      │
│  - Shows Update buttons (staff)   - Shows Update buttons      │
│  - Opens status dialog           - Opens status dialog       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Status Dialog                           │
├─────────────────────────────────────────────────────────────┤
│  - Status selector dropdown                                 │
│  - Optional notes/remarks textarea                          │
│  - Update/Cancel buttons                                    │
│  - Loading state during submission                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Server Actions                            │
├─────────────────────────────────────────────────────────────┤
│  updateAppointmentStatus()                                  │
│  updateYakakApplicationStatus()                             │
│  - Validates user authorization                            │
│  - Calls API endpoints                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      API Routes                             │
├─────────────────────────────────────────────────────────────┤
│  PATCH /api/appointments/update-status                     │
│  PATCH /api/yakap/update-status                            │
│  - Validates authorization                                 │
│  - Updates database                                        │
│  - Logs activity                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Database                         │
├─────────────────────────────────────────────────────────────┤
│  - appointments (status update)                            │
│  - yakap_applications (status update)                      │
│  - activity_logs (audit trail)                             │
└─────────────────────────────────────────────────────────────┘
```

## User Flow

### For Staff Members:

```
1. Staff logs in (barangay_admin or admin role)
                    ↓
2. Navigate to Appointments or YAKAP page
                    ↓
3. View list of appointments/YAKAP applications
                    ↓
4. Click "Update Status" button on a row
                    ↓
5. Dialog opens showing:
   - Current item details
   - Status dropdown selector
   - Optional notes/remarks field
                    ↓
6. Select new status
                    ↓
7. (Optional) Add notes/remarks
                    ↓
8. Click "Update Status" button
                    ↓
9. Request sent to API
                    ↓
10. Database updated & activity logged
                    ↓
11. Dialog closes & table refreshes
                    ↓
12. Updated status displayed in table
```

### For Regular Users:

```
1. User logs in (user role)
                    ↓
2. Navigate to Appointments or YAKAP page
                    ↓
3. View list of appointments/YAKAP applications
                    ↓
4. "Update Status" buttons NOT visible
                    ↓
5. Cannot modify any data
```

## Data Flow Example: Updating Appointment Status

```
User clicks "Update Status"
                ↓
Dialog opens with:
  - resident: John Doe
  - facility: City Health Center
  - current status: "available"
  - time_slot: "10:00 AM"
                ↓
User selects: "booked" from dropdown
User enters note: "Patient confirmed"
                ↓
User clicks "Update Status"
                ↓
updateAppointmentStatus() called
  → Validates user is barangay_admin/admin ✓
  → Calls PATCH /api/appointments/update-status
                ↓
API Route Handler:
  → Checks authorization ✓
  → Updates appointment:
    - status: "booked"
    - notes: "Patient confirmed"
    - booked_at: current timestamp
    - updated_at: current timestamp
  → Logs activity:
    - user_id: current user
    - action: "updated appointment status to booked"
    - resource_id: appointment id
                ↓
Returns updated appointment data
                ↓
Dialog closes
                ↓
Table refreshes with new data
                ↓
User sees appointment with:
  - Status badge: "Booked"
  - Booked time: "just now"
```

## Security Features

✅ **Role-Based Access Control**

- Only barangay_admin and admin can update statuses
- Regular users cannot see update controls

✅ **Audit Trail**

- All status changes logged to activity_logs table
- Tracks who made the change and when
- Includes change details

✅ **Request Validation**

- Required fields checked (appointmentId/yakakId, status)
- Invalid status values rejected
- User authorization verified before database update

✅ **Error Handling**

- 400: Bad Request (missing fields)
- 401: Unauthorized (insufficient permissions)
- 500: Server Error (database errors)
- User-friendly error messages displayed

## Component Props Reference

### AppointmentsTable

```typescript
interface AppointmentsTableProps {
  appointments: AppointmentWithDetails[];
  isLoading?: boolean;
  onStatusUpdated?: () => void; // NEW
  isStaff?: boolean; // NEW
}
```

### YakakTable

```typescript
interface YakakTableProps {
  applications: (YakakApplication & {...})[];
  isLoading?: boolean;
  onStatusChange?: (status: string) => void;
  onViewDetails?: (id: string) => void;
  isStaff?: boolean;              // NEW
  onStatusUpdated?: () => void;   // NEW
}
```

## Available Status Options

### Appointments Table - Status Values:

- `available` (Secondary badge)
- `booked` (Default badge)
- `completed` (Outline badge)
- `cancelled` (Destructive badge)
- `no_show` (Destructive badge)

### YAKAP Applications - Status Values:

- `pending` (Yellow badge)
- `approved` (Green badge)
- `returned` (Blue badge)
- `rejected` (Red badge)

## Testing Checklist

- [ ] Staff user can see "Update Status" buttons
- [ ] Regular user cannot see "Update Status" buttons
- [ ] Dialog opens with correct item details
- [ ] Status dropdown shows all available options
- [ ] Notes/remarks field is optional
- [ ] Update succeeds with valid status
- [ ] Update fails with invalid status
- [ ] Update fails for unauthorized users
- [ ] Table refreshes after successful update
- [ ] Activity is logged in database
- [ ] Booked_at timestamp updates on "booked" status
- [ ] Approved_by and approved_at update for YAKAP approvals
- [ ] Error messages display properly
