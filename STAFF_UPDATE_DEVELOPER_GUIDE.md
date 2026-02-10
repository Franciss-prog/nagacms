# Staff Status Update Feature - Developer Guide

## Implementation Details

### 1. Role-Based Access Control

#### How It Works:

```typescript
// In API routes and server actions
const session = await getSession();

// Only allow barangay_admin and admin roles
if (!session || !["admin", "barangay_admin"].includes(session.user.role)) {
  return { error: "Unauthorized" };
}
```

#### Roles Defined in Types:

```typescript
// lib/types/index.ts
export type UserRole = "user" | "admin" | "barangay_admin";
```

### 2. State Management Pattern

#### Frontend State Tracking:

```typescript
// Components use React hooks for dialog state
const [selectedAppointment, setSelectedAppointment] = useState<...>(null);
const [newStatus, setNewStatus] = useState<string>("");
const [notes, setNotes] = useState<string>("");
const [isUpdating, setIsUpdating] = useState(false);
```

#### Page-Level State:

```typescript
// Pages track session for authorization check
const [state, setState] = useState<PageState>({
  appointments: [],
  session: null,
  // ...
});

const isStaff =
  state.session?.user?.role === "barangay_admin" ||
  state.session?.user?.role === "admin";
```

### 3. API Endpoint Structure

#### Request Flow:

```
Client Component
    ↓
Server Action (updateAppointmentStatus)
    ↓
HTTP PATCH Request
    ↓
API Route Handler (/api/appointments/update-status)
    ↓
Database Update + Activity Log
    ↓
Return Updated Data
    ↓
Component State Update + Refresh
```

#### Error Handling Pattern:

```typescript
try {
  const response = await fetch("/api/appointments/update-status", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appointmentId, status, notes }),
  });

  const result = await response.json();

  if (!response.ok) {
    return { success: false, error: result.error };
  }

  return { success: true, data: result.data };
} catch (error) {
  console.error("[updateAppointmentStatus]", error);
  return { success: false, error: "Failed to update appointment" };
}
```

### 4. Database Operations

#### Appointment Status Update:

```sql
UPDATE appointments
SET
  status = $1,
  notes = $2,
  booked_at = CASE WHEN $1 = 'booked' THEN now() ELSE NULL END,
  updated_at = now()
WHERE id = $3
RETURNING *;
```

#### YAKAP Status Update:

```sql
UPDATE yakap_applications
SET
  status = $1,
  remarks = $2,
  approved_by = CASE WHEN $1 = 'approved' THEN $4 ELSE NULL END,
  approved_at = CASE WHEN $1 = 'approved' THEN now() ELSE NULL END,
  updated_at = now()
WHERE id = $3
RETURNING *;
```

#### Activity Logging:

```sql
INSERT INTO activity_logs (user_id, action, resource_type, resource_id, changes)
VALUES ($1, $2, $3, $4, $5);
```

### 5. Component Composition Pattern

#### Dialog Implementation:

```typescript
<Dialog open={!!selectedAppointment} onOpenChange={handleDialogChange}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Update Appointment Status</DialogTitle>
      <DialogDescription>
        {/* Dynamic content from selected item */}
      </DialogDescription>
    </DialogHeader>

    {/* Status selector */}
    <Select value={newStatus} onValueChange={setNewStatus}>
      {/* Options */}
    </Select>

    {/* Notes input */}
    <Textarea value={notes} onChange={handleChange} />

    {/* Action buttons */}
    <DialogFooter>
      <Button onClick={handleCancel}>Cancel</Button>
      <Button onClick={handleSubmit} disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update Status"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 6. Conditional Rendering

#### Staff-Only Controls:

```typescript
export function AppointmentsTable({
  appointments,
  isLoading,
  onStatusUpdated,
  isStaff = false,  // NEW
}: AppointmentsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {/* Standard columns */}
          {isStaff && <TableHead>Action</TableHead>}  {/* NEW */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((item) => (
          <TableRow>
            {/* Standard cells */}
            {isStaff && (  {/* NEW */}
              <TableCell>
                <Button onClick={() => openDialog(item)}>
                  Update Status
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### 7. Data Refresh Pattern

#### After Successful Update:

```typescript
const handleStatusChange = async () => {
  setIsUpdating(true);
  try {
    const result = await updateAppointmentStatus(
      selectedAppointment.id,
      newStatus,
      notes,
    );

    if (result.success) {
      // Close dialog and reset state
      setSelectedAppointment(null);
      setNewStatus("");
      setNotes("");

      // Refresh parent component data
      onStatusUpdated?.(); // Calls fetchAppointments()
    } else {
      alert("Failed: " + result.error);
    }
  } finally {
    setIsUpdating(false);
  }
};
```

## Integration with Existing Systems

### Supabase Integration:

- Uses existing `createServerSupabaseClient()` for authenticated requests
- Leverages existing `getSession()` for authorization
- Maintains session cookies for authentication persistence

### Activity Logging:

- All status changes recorded in `activity_logs` table
- Includes user_id, action, resource_type, resource_id, changes
- Enables audit trail for compliance and debugging

### Database Schema Dependencies:

```
Tables Used:
- appointments (columns: id, status, booked_at, notes, updated_at)
- yakap_applications (columns: id, status, remarks, approved_by, approved_at, updated_at)
- activity_logs (columns: user_id, action, resource_type, resource_id, changes)
- users (columns: id, role) - for authorization
```

## Performance Considerations

### Optimization Strategies:

1. **State Updates** - Only update necessary state, avoid full page refresh
2. **Dialog Isolation** - Dialog state isolated from table state
3. **Conditional Rendering** - Staff controls only render for authorized users
4. **Lazy Loading** - Data fetched on page load, not on every interaction

### Potential Bottlenecks:

- Activity logging on every update (acceptable trade-off for audit trail)
- Full table refresh after update (could be optimized with optimistic updates)
- Session check on every page load (necessary for security)

## Testing Strategies

### Unit Tests:

```typescript
describe("updateAppointmentStatus", () => {
  it("should update status for authorized users", async () => {
    // Test implementation
  });

  it("should reject unauthorized users", async () => {
    // Test implementation
  });
});
```

### Integration Tests:

```typescript
describe("Appointments Page", () => {
  it("should show update buttons for staff", () => {
    // Render with isStaff={true}
    // Assert buttons are visible
  });

  it("should hide update buttons for regular users", () => {
    // Render with isStaff={false}
    // Assert buttons are not visible
  });
});
```

### E2E Tests:

```typescript
describe("Staff Status Update Flow", () => {
  it("should successfully update appointment status", () => {
    // Login as staff
    // Navigate to appointments
    // Click update button
    // Select new status
    // Verify update in database
  });
});
```

## Extension Points

### Adding New Status Update Endpoints:

1. Create API route at `/api/{resource}/update-status/route.ts`:

```typescript
export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || !["admin", "barangay_admin"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resourceId, status } = await request.json();
  // ... implementation
}
```

2. Add server action to `lib/actions/`:

```typescript
export async function updateResourceStatus(id: string, status: string) {
  const session = await getSession();
  // ... validation and API call
}
```

3. Update component to include status dialog
4. Update page to track session and pass isStaff prop

## Troubleshooting Guide

### Issue: "Update Status" buttons not visible for staff

**Solution**: Check that:

- User is logged in with correct role (barangay_admin or admin)
- `isStaff` prop is being passed correctly
- Session is being fetched in page component

### Issue: Status update fails silently

**Solution**: Check:

- Browser console for error messages
- Network tab for API response
- Database logs for constraint violations
- User authorization in backend

### Issue: Activity log not recording

**Solution**: Verify:

- `activity_logs` table exists in Supabase
- User has INSERT permission on activity_logs
- `created_at` column default is CURRENT_TIMESTAMP

## Security Best Practices

1. ✅ Always verify session on server (never trust client)
2. ✅ Check user role before allowing updates
3. ✅ Validate all input parameters
4. ✅ Log all state changes for audit trail
5. ✅ Use HTTPS for all API requests
6. ✅ Implement rate limiting for API endpoints
7. ✅ Sanitize user input in remarks/notes fields

## Performance Optimization Opportunities

1. **Optimistic Updates**: Update UI before server confirms
2. **Batch Operations**: Allow multiple status updates in one request
3. **Caching**: Cache status options and available transitions
4. **Debouncing**: Prevent rapid-fire update requests
5. **Pagination**: For large result sets in tables
