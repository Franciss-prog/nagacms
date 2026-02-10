# YAKAP Form Setup Guide

## Quick Start

### Step 1: Run Database Migration

Execute the SQL migration to update your database schema:

```bash
# Using psql directly
psql -h your_host -U your_user -d your_database -f migrations/001_yakap_applications_add_form_data.sql

# Or copy-paste the migration SQL into your Supabase SQL Editor
```

### Step 2: Update Your Page Component

Replace or update your yakap form page to use the new step-by-step form:

```typescript
// app/dashboard/yakap/page.tsx
"use client";

import { YakapFormStep } from "@/components/yakap/yakap-form-step";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

export default function YakapPage() {
  const session = useSession();
  const router = useRouter();

  if (!session?.user?.id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <YakapFormStep
        residentId={session.user.id}
        onSuccess={() => {
          // Redirect to applications list or success page
          router.push("/dashboard/yakap/success");
        }}
      />
    </div>
  );
}
```

### Step 3: Create Applications List Page

Display submitted applications:

```typescript
// app/dashboard/yakap/applications/page.tsx
"use client";

import { useEffect, useState } from "react";
import { yakapService, type YakapApplication } from "@/lib/services/yakap.service";
import { useSession } from "@supabase/auth-helpers-react";

export default function ApplicationsPage() {
  const session = useSession();
  const [applications, setApplications] = useState<YakapApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const loadApplications = async () => {
      const { applications } = await yakapService.getApplicationHistory(
        session.user.id
      );
      setApplications(applications);
      setLoading(false);
    };

    loadApplications();
  }, [session?.user?.id]);

  if (loading) return <div>Loading applications...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My YAKAP Applications</h1>

      {applications.length === 0 ? (    
        <div className="text-center text-gray-500 py-8">
          No applications yet. Submit your first application to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{app.resident_name}</h3>
                  <p className="text-sm text-gray-600">{app.barangay}</p>
                  <p className="text-sm text-gray-600">
                    Type: {app.membership_type}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  app.status === 'approved' ? 'bg-green-100 text-green-800' :
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  app.status === 'returned' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>
              {app.remarks && (
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Remarks:</strong> {app.remarks}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Applied: {new Date(app.applied_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Step 4: Create Status Check Component

Add a status checker in your dashboard:

```typescript
// components/yakap/yakap-status-checker.tsx
"use client";

import { useEffect, useState } from "react";
import { yakapService } from "@/lib/services/yakap.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface YakapStatusCheckerProps {
  residentId: string;
}

export function YakapStatusChecker({ residentId }: YakapStatusCheckerProps) {
  const [application, setApplication] = useState(null);
  const [canApply, setCanApply] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const { hasApplication, application } =
        await yakapService.getApplicationStatus(residentId);

      const { canApply: able } = await yakapService.canApply(residentId);

      if (hasApplication) {
        setApplication(application);
      }
      setCanApply(able);
      setLoading(false);
    };

    checkStatus();
  }, [residentId]);

  if (loading) return <div>Checking status...</div>;

  if (!application) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>YAKAP Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            You haven't submitted a YAKAP application yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      message: "Your application is being reviewed",
    },
    approved: {
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      message: "Congratulations! Your application has been approved",
    },
    returned: {
      icon: AlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      message: "Your application needs corrections",
    },
    rejected: {
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      message: "Your application was not approved",
    },
  };

  const config = statusConfig[application.status];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle>YAKAP Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`${config.bgColor} p-4 rounded-lg`}>
          <div className="flex gap-3">
            <Icon className={`${config.color} h-6 w-6 flex-shrink-0`} />
            <div>
              <p className={`${config.color} font-semibold`}>
                {application.status.charAt(0).toUpperCase() +
                  application.status.slice(1)}
              </p>
              <p className="text-sm text-gray-700 mt-1">{config.message}</p>
              {application.remarks && (
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Remarks:</strong> {application.remarks}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

## File Structure

```
nagacms/
├── lib/
│   └── services/
│       └── yakap.service.ts          # YAKAP service with business logic
├── components/
│   └── yakap/
│       └── yakap-form-step.tsx       # 3-step form component
├── migrations/
│   └── 001_yakap_applications_add_form_data.sql  # Database migration
├── app/
│   └── dashboard/
│       └── yakap/
│           ├── page.tsx               # Application form page
│           ├── applications/
│           │   └── page.tsx           # Applications list page
│           └── success/
│               └── page.tsx           # Success page
└── YAKAP_FORM_IMPLEMENTATION.md      # Implementation documentation
```

## Testing

### Test Submission

1. Navigate to the YAKAP form page
2. Fill in Step 1 (Personal Information)
3. Click "Next Step"
4. Fill in Step 2 (Address & Contact)
5. Click "Next Step"
6. Fill in Step 3 (Family & Membership)
7. Click "Submit Application"
8. Verify application appears in applications list

### Test Status Checking

```typescript
// In browser console
const { yakapService } = await import("/lib/services/yakap.service");
const status = await yakapService.getApplicationStatus("resident-id");
console.log(status);
```

### Test Validation

1. Click "Next Step" without filling required fields
2. Verify error messages appear
3. Fill in required fields
4. Verify errors clear and form progresses

## Troubleshooting

### Application not saving

- Check browser console for errors
- Verify Supabase connection
- Ensure resident_id is valid
- Check database schema has been migrated

### Form not loading

- Clear browser cache
- Check that YakapFormStep component is imported correctly
- Verify resident ID is being passed
- Check for TypeScript errors

### Status not updating

- Refresh the page
- Check that getApplicationHistory is being called
- Verify resident ID matches submitted application

## Next Steps

1. Set up admin dashboard for reviewing applications
2. Add email notifications for status changes
3. Create batch export for approved applications
4. Add document upload support
5. Implement SMS notifications
6. Create API endpoint for external integrations

For detailed API documentation, see `YAKAP_FORM_IMPLEMENTATION.md`
