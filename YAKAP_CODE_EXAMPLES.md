# YAKAP Form - Code Examples & Recipes

## Complete Implementation Examples

### 1. Basic Form Page Implementation

```typescript
// app/dashboard/yakap/page.tsx
"use client";

import { YakapFormStep } from "@/components/yakap/yakap-form-step";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function YakapApplicationPage() {
  const session = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!session?.user?.id) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-gray-600">
          Please log in to submit a YAKAP application.
        </div>
      </div>
    );
  }

  const handleSuccess = async () => {
    setIsLoading(true);
    // Optional: Show success toast or redirect
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.push("/dashboard/yakap/applications");
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Apply for YAKAP</h1>
        <p className="text-gray-600 mt-2">
          PhilHealth Konsulta - Community Health Service
        </p>
      </div>

      <YakapFormStep
        residentId={session.user.id}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
```

### 2. Applications List with Status Display

```typescript
// app/dashboard/yakap/applications/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { yakapService, type YakapApplication } from "@/lib/services/yakap.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function ApplicationsListPage() {
  const session = useSession();
  const [applications, setApplications] = useState<YakapApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const loadApplications = async () => {
      try {
        const { applications: apps, error: err } =
          await yakapService.getApplicationHistory(session.user.id);

        if (err) {
          setError(err);
          return;
        }

        setApplications(apps);
      } catch (err) {
        setError("Failed to load applications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading your applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "returned":
        return <AlertCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "pending":
        return "secondary";
      case "approved":
        return "default";
      case "returned":
        return "outline";
      case "rejected":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My YAKAP Applications</h1>
        <p className="text-gray-600 mt-2">
          View status of all your PhilHealth Konsulta applications
        </p>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            <p className="mb-4">
              You haven't submitted any YAKAP applications yet.
            </p>
            <a
              href="/dashboard/yakap"
              className="text-blue-600 hover:underline"
            >
              Submit your first application
            </a>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {app.resident_name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {app.barangay} • {app.membership_type}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(app.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(app.status)}
                      {app.status.charAt(0).toUpperCase() +
                        app.status.slice(1)}
                    </span>
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Applied Date</p>
                    <p className="font-medium">
                      {new Date(app.applied_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {app.approved_at && (
                    <div>
                      <p className="text-gray-600">Approved Date</p>
                      <p className="font-medium">
                        {new Date(app.approved_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {app.remarks && (
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded p-3">
                    <p className="text-xs font-medium text-blue-900 dark:text-blue-200 mb-1">
                      REMARKS
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-100">
                      {app.remarks}
                    </p>
                  </div>
                )}

                {app.status === "returned" && (
                  <a
                    href={`/dashboard/yakap/edit/${app.id}`}
                    className="inline-block text-blue-600 hover:underline text-sm"
                  >
                    Resubmit Application →
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 3. Application Detail Page with Edit Support

```typescript
// app/dashboard/yakap/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "@supabase/auth-helpers-react";
import { yakapService, type YakapApplication } from "@/lib/services/yakap.service";
import { YakapFormStep } from "@/components/yakap/yakap-form-step";
import { AlertCircle, Loader2 } from "lucide-react";

export default function EditApplicationPage() {
  const params = useParams();
  const session = useSession();
  const applicationId = params.id as string;

  const [application, setApplication] = useState<YakapApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) return;

    const loadApplication = async () => {
      try {
        const { application: app, error: err } =
          await yakapService.getApplicationById(applicationId);

        if (err) {
          setError(err);
          return;
        }

        if (!app) {
          setError("Application not found");
          return;
        }

        // Check if application can be re-submitted
        if (app.status !== "returned") {
          setError(
            `This application cannot be edited. Status: ${app.status}`
          );
          return;
        }

        setApplication(app);
      } catch (err) {
        setError("Failed to load application");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [applicationId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading application...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex gap-3 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-gray-600">
          Application not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Resubmit Application</h1>
        <p className="text-gray-600 mt-2">
          Update the information below and resubmit your application
        </p>
      </div>

      {application.remarks && (
        <div className="mb-6 flex gap-3 rounded-md bg-yellow-50 p-4 text-sm text-yellow-700 dark:bg-yellow-950 dark:text-yellow-200">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Application Needs Corrections</p>
            <p className="mt-1">{application.remarks}</p>
          </div>
        </div>
      )}

      <YakapFormStep
        residentId={application.resident_id}
        existingData={application.form_data}
        onSuccess={() => {
          // Redirect to applications list
          window.location.href = "/dashboard/yakap/applications";
        }}
      />
    </div>
  );
}
```

### 4. Status Checker Widget for Dashboard

```typescript
// components/yakap/yakap-status-widget.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { yakapService } from "@/lib/services/yakap.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
} from "lucide-react";

export function YakapStatusWidget() {
  const session = useSession();
  const [status, setStatus] = useState<string | null>(null);
  const [canApply, setCanApply] = useState(true);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const checkStatus = async () => {
      try {
        const { hasApplication, application: app } =
          await yakapService.getApplicationStatus(session.user.id);

        const { canApply: able } = await yakapService.canApply(
          session.user.id
        );

        if (hasApplication) {
          setStatus(app?.status || null);
          setApplication(app);
        }
        setCanApply(able);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>YAKAP Application Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-600 py-4">
            <p className="mb-4">No YAKAP application submitted yet</p>
            <a
              href="/dashboard/yakap"
              className="text-blue-600 hover:underline font-medium"
            >
              Submit Application
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusConfig = {
    pending: {
      icon: Clock,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-700",
      title: "Pending Review",
      description: "Your application is being reviewed by the health office",
    },
    approved: {
      icon: CheckCircle2,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      title: "Approved",
      description: "Congratulations! You are now registered for YAKAP",
    },
    returned: {
      icon: AlertCircle,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      title: "Needs Corrections",
      description: "Please review the remarks and resubmit your application",
    },
    rejected: {
      icon: XCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-700",
      title: "Rejected",
      description: "Contact the health office for more information",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>YAKAP Application Status</CardTitle>
        <Badge>{status}</Badge>
      </CardHeader>
      <CardContent>
        <div
          className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4`}
        >
          <div className="flex gap-3">
            <Icon className={`${config.textColor} h-5 w-5 flex-shrink-0 mt-1`} />
            <div className="flex-1">
              <p className={`${config.textColor} font-semibold`}>
                {config.title}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {config.description}
              </p>

              {application?.remarks && (
                <p className="text-sm text-gray-700 mt-3">
                  <strong>Remarks:</strong> {application.remarks}
                </p>
              )}

              {status === "returned" && (
                <a
                  href={`/dashboard/yakap/edit/${application?.id}`}
                  className="inline-block mt-3 text-sm text-blue-600 hover:underline font-medium"
                >
                  Resubmit Application →
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 5. Server Action for Admin Review

```typescript
// lib/actions/yakap-admin.ts
"use server";

import { createServerSupabaseClient, getSession } from "@/lib/auth";
import { z } from "zod";

const approveYakapSchema = z.object({
  id: z.string().uuid(),
  remarks: z.string().optional(),
});

export async function approveYakapApplication(
  formData: z.infer<typeof approveYakapSchema>,
) {
  const session = await getSession();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  // Check if user is admin (you can add role checking)
  const validation = approveYakapSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: "Invalid request" };
  }

  const { id, remarks } = validation.data;

  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("yakap_applications")
      .update({
        status: "approved",
        approved_by: session.user.id,
        approved_at: new Date().toISOString(),
        remarks,
      })
      .eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to approve application" };
  }
}
```

## Common Use Cases

### Get Application Status for Dashboard Widget

```typescript
const { application } = await yakapService.getApplicationStatus(residentId);
console.log(application?.status); // "pending" | "approved" | "returned" | "rejected"
```

### Check if User Can Apply

```typescript
const { canApply, reason } = await yakapService.canApply(residentId);
if (!canApply) {
  console.log("Cannot apply:", reason);
}
```

### Get All User's Applications

```typescript
const { applications } = await yakapService.getApplicationHistory(residentId);
applications.forEach((app) => console.log(app.resident_name, app.status));
```

### Handle Re-submission After Rejection

```typescript
// After user edits form and resubmits
const { success } = await yakapService.updateApplication(
  applicationId,
  updatedFormData,
);
```

## Tips & Best Practices

1. **Always check `canApply()`** before showing the form
2. **Store `form_data` as JSONB** for flexibility in future changes
3. **Use resident_id** to prevent duplicate applications
4. **Validate on both client and server** for security
5. **Clear remarks** when resubmitting to track latest status
6. **Log all status changes** for audit trail
7. **Send email notifications** on status changes
8. **Implement rate limiting** for API submissions
