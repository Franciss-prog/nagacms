# Health Workers Module - Complete Implementation Guide

## Overview

This is a **production-ready health workers module** for barangay health centers with:

- ✅ Role-based access control (via Supabase RLS)
- ✅ Mobile-optimized data entry forms (Vaccination, Maternal Health, Senior Care)
- ✅ Offline-first architecture with local queue system
- ✅ Real-time updates via Supabase Postgres Changes
- ✅ Progressive Web App (PWA) for app-like experience
- ✅ Photo upload capability with camera support
- ✅ Automatic sync when online

---

## Architecture

### Technology Stack

| Component           | Technology                | Purpose                           |
| ------------------- | ------------------------- | --------------------------------- |
| **Frontend**        | Next.js 14 (App Router)   | Server-side rendering, API routes |
| **Database**        | Supabase (PostgreSQL)     | Data storage, RLS, Real-time      |
| **Authentication**  | Supabase Auth             | User sessions, role management    |
| **Offline Storage** | localStorage              | Queue for offline entries         |
| **Real-time**       | Supabase Postgres Changes | Live data subscriptions           |
| **PWA**             | Service Worker            | Offline app experience            |
| **UI**              | Tailwind CSS + Radix UI   | Modern responsive design          |

### Data Flow

```
┌─────────────────────┐
│    Health Worker    │
│   Mobile Device     │
└──────────┬──────────┘
           │
      ┌────▼─────┐
      │ OFFLINE? │
      └────┬─────┘
           │
     ┌─────┴─────┐
     │           │
    YES         NO
     │           │
     ▼           ▼
┌─────────┐  ┌──────────┐
│ Queue   │  │ Supabase │
│(Storage)│  │Database  │
└────┬────┘  └──────────┘
     │
     └──────── [When Online] ────┐
                                 ▼
                          ┌────────────┐
                          │ Auto Sync  │
                          └────────────┘
```

---

## Setup Instructions

### 1. Database Setup

#### Create Tables

Run the following SQL in Supabase SQL Editor:

```bash
# In Supabase Dashboard > SQL Editor, run these in order:
1. /SENIORS_ASSISTANCE_TABLE.sql
   - Creates seniors_assistance table
   - Adds RLS policies
   - Creates indexes
```

**Note**: The `vaccination_records` and health indicators tables should already exist from Phase 1.

#### Apply RLS Policies

Run in Supabase SQL Editor:

```bash
/RLS_POLICIES.sql
```

This creates policies that restrict:

- Health workers to their assigned barangay
- Staff (LGU) to see all records
- Residents to view their own records

### 2. Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Deploy Service Worker

The service worker is automatically served from `/public/sw.js`:

- Requires HTTPS in production
- Works on localhost for development
- Handles offline caching and background sync

---

## Features

### 1. Mobile Data Entry Forms

#### Vaccination Form

**File**: `/components/forms/vaccination-form.tsx`

Fields:

- Vaccine name (dropdown)
- Dose number (1-5)
- Vaccine date
- Vaccination site
- Batch number
- Next dose date
- Photo upload (optional)
- Notes

```tsx
import { VaccinationForm } from "@/components/forms/vaccination-form";

<VaccinationForm
  residentId="uuid"
  residentName="John Doe"
  barangay="San Vicente"
  recordedBy="worker-uuid"
  onSuccess={() => console.log("Saved!")}
/>;
```

#### Maternal Health Form

**File**: `/components/forms/maternal-health-form.tsx`

Fields:

- Visit date
- Trimester (First/Second/Third/Postpartum)
- **Vital Signs**: BP systolic, BP diastolic, weight, height
- Hemoglobin level
- **Interventions**: Tetanus, Iron, Prenatal vitamins
- Health complications
- Photo upload
- Next visit date
- Notes

```tsx
import { MaternalHealthForm } from "@/components/forms/maternal-health-form";

<MaternalHealthForm
  residentId="uuid"
  residentName="Jane Smith"
  barangay="San Vicente"
  recordedBy="worker-uuid"
  onSuccess={() => fetchRecords()}
/>;
```

#### Senior Assistance Form

**File**: `/components/forms/senior-assistance-form.tsx`

Fields:

- Visit date
- **Vital Signs**: BP systolic, BP diastolic, heart rate, blood glucose, weight
- **Health Assessment**: Mobility status, Cognitive status, Health concerns, Medications
- **Assistance**: Type, Referral needed, Referral destination
- Photo upload
- Next visit date
- Notes

```tsx
import { SeniorAssistanceForm } from "@/components/forms/senior-assistance-form";

<SeniorAssistanceForm
  residentId="uuid"
  residentName="Maria Garcia"
  barangay="San Vicente"
  recordedBy="worker-uuid"
  onSuccess={() => refreshData()}
/>;
```

### 2. Offline-First Queue System

**File**: `/lib/utils/offline-queue.ts`

The queue automatically:

- Saves data to localStorage when offline
- Attempts sync when online
- Retries up to 3 times before requiring manual intervention
- Tracks sync status and errors

#### Using the Offline Queue

```tsx
import {
  addToQueue,
  getQueue,
  syncOfflineRecords,
} from "@/lib/utils/offline-queue";

// Add to queue manually
addToQueue("vaccination", vaccinationData);

// Get all queued items
const queue = getQueue();

// Sync when online
await syncOfflineRecords(queue);
```

#### UI Components for Queue Management

```tsx
// Show pending queue status
import { OfflineQueueStatus } from "@/components/offline/offline-queue-status";

<OfflineQueueStatus />;

// Show pending badge
import { OfflineQueueBadge } from "@/components/offline/offline-queue-status";

<OfflineQueueBadge />;

// Show detailed sync report
import { SyncStatusReport } from "@/components/offline/offline-queue-status";

<SyncStatusReport />;
```

### 3. Real-Time Updates

**File**: `/lib/hooks/useHealthWorkerRealtime.ts`

Subscribe to live data changes:

```tsx
import { useHealthWorkerRealtime } from "@/lib/hooks/useHealthWorkerRealtime";

export function VaccinationRecords({ barangay }) {
  const { isConnected, data, error } = useHealthWorkerRealtime({
    table: "vaccination_records",
    barangay,
    onInsert: (record) => console.log("New record:", record),
    onUpdate: (record) => console.log("Updated:", record),
    enabled: true,
  });

  return (
    <div>
      {isConnected ? "🟢 Live" : "🔴 Offline"}
      {data.map((record) => (
        <div key={record.id}>{record.data.vaccine_name}</div>
      ))}
    </div>
  );
}
```

#### Monitoring Connection Status

```tsx
import { useHealthWorkerRealtimeStatus } from "@/lib/hooks/useHealthWorkerRealtime";

export function StatusIndicator() {
  const { isFullyConnected, error } =
    useHealthWorkerRealtimeStatus("San Vicente");

  return (
    <div>
      {isFullyConnected ? "✅ Syncing live" : "⏳ Offline mode"}
      {error && <p>Connection error: {error.message}</p>}
    </div>
  );
}
```

### 4. PWA Features

**Files**:

- `/lib/utils/pwa-utils.ts` - Core PWA utilities
- `/public/sw.js` - Service worker
- `/public/manifest.json` - App manifest
- `/components/pwa/pwa-status-bar.tsx` - Status indicators

#### Install Prompt

```tsx
import { useInstallPrompt, promptInstall } from "@/lib/utils/pwa-utils";

export function InstallButton() {
  const { showPrompt, handleInstall } = useInstallPrompt();

  if (!showPrompt) return null;

  return <button onClick={handleInstall}>Install App</button>;
}
```

#### Status Bar

```tsx
import { PWAStatusBar } from "@/components/pwa/pwa-status-bar";

<PWAStatusBar showInstallPrompt={true} barangay="San Vicente" />;
```

#### Online/Offline Hook

```tsx
import { useOnlineStatus } from "@/lib/utils/pwa-utils";

export function ConnectionStatus() {
  const isOnline = useOnlineStatus();
  return <span>{isOnline ? "🟢 Online" : "🔴 Offline"}</span>;
}
```

---

## Integration Examples

### Complete Health Worker Dashboard

```tsx
"use client";

import { useState, useEffect } from "react";
import { VaccinationForm } from "@/components/forms/vaccination-form";
import { MaternalHealthForm } from "@/components/forms/maternal-health-form";
import { SeniorAssistanceForm } from "@/components/forms/senior-assistance-form";
import { PWAStatusBar } from "@/components/pwa/pwa-status-bar";
import { OfflineQueueStatus } from "@/components/offline/offline-queue-status";
import { useHealthWorkerRealtimeStatus } from "@/lib/hooks/useHealthWorkerRealtime";

export default function HealthWorkerDashboard() {
  const [formType, setFormType] = useState<
    "vaccination" | "maternal" | "senior"
  >("vaccination");
  const [residentId, setResidentId] = useState("");
  const { isFullyConnected } = useHealthWorkerRealtimeStatus("San Vicente");

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header with status */}
      <header className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold">Health Worker Dashboard</h1>
        <div className="text-sm text-gray-600">
          {isFullyConnected ? "✅ Real-time sync active" : "⏳ Offline mode"}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Form selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setFormType("vaccination")}
            className={`px-4 py-2 rounded ${
              formType === "vaccination"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Vaccination
          </button>
          <button
            onClick={() => setFormType("maternal")}
            className={`px-4 py-2 rounded ${
              formType === "maternal" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Maternal Health
          </button>
          <button
            onClick={() => setFormType("senior")}
            className={`px-4 py-2 rounded ${
              formType === "senior" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Senior Care
          </button>
        </div>

        {/* Offline queue status */}
        <OfflineQueueStatus />

        {/* Forms */}
        {residentId && (
          <>
            {formType === "vaccination" && (
              <VaccinationForm
                residentId={residentId}
                residentName="Resident Name"
                barangay="San Vicente"
                recordedBy="worker-uuid"
              />
            )}
            {formType === "maternal" && (
              <MaternalHealthForm
                residentId={residentId}
                residentName="Resident Name"
                barangay="San Vicente"
                recordedBy="worker-uuid"
              />
            )}
            {formType === "senior" && (
              <SeniorAssistanceForm
                residentId={residentId}
                residentName="Resident Name"
                barangay="San Vicente"
                recordedBy="worker-uuid"
              />
            )}
          </>
        )}
      </main>

      {/* PWA Status Bar */}
      <PWAStatusBar showInstallPrompt={true} barangay="San Vicente" />
    </div>
  );
}
```

---

## Testing

### Test Offline Mode

1. **Enable offline in DevTools**:
   - Chrome: DevTools > Network tab > Throttling > Offline
   - Firefox: Ctrl+Shift+K > Offline

2. **Test form submission**:
   - Fill vaccination form while offline
   - Submit - should see "Saved offline" message
   - Data should appear in offline queue

3. **Test sync**:
   - Go online (disable offline in DevTools)
   - Click "Sync Now" in queue status
   - Records should sync to database

### Test Real-Time Updates

1. **Open app in two browsers**:
   - Health worker in one window
   - Dashboard in another

2. **Submit record in worker window**:
   - Should see real-time update in dashboard
   - Only if both online

3. **Monitor connection**:
   - Watch status indicator in status bar
   - Should show "Live" when streaming, "Queue" when offline

### Test PWA Installation

1. **Supported browsers**:
   - Chrome/Edge: Click install button or address bar prompt
   - Firefox: Add-ons button or home screen menu
   - Safari: Share > Add to Home Screen

2. **After installation**:
   - App should work offline
   - Can use forms without internet
   - Data syncs when online

---

## Performance Optimization

### Caching Strategies

The service worker implements:

| Asset Type    | Strategy                | TTL |
| ------------- | ----------------------- | --- |
| HTML pages    | Stale-while-revalidate  | 24h |
| API calls     | Network-first           | N/A |
| Static assets | Cache-first             | 30d |
| Images        | Cache-first with update | 7d  |

### Bundle Size

- Main app: ~150KB (gzipped)
- Service worker: ~15KB
- Forms: ~50KB each

### Mobile Performance

- Lazy load forms only when needed
- Chunk by route (Next.js automatic)
- Image optimization with Next.js Image
- CSS-in-JS only for dynamic components

---

## Troubleshooting

### Service Worker Not Registering

**Problem**: SW registration fails
**Solution**:

1. Check: HTTPS required in production
2. Check: `/public/sw.js` exists
3. Check: Browser console for errors

### Offline Queue Not Syncing

**Problem**: Data stuck in queue
**Solution**:

1. Check online status: `navigator.onLine`
2. Clear queue in UI: "Clear" button
3. Check sync errors in status

### Real-time Not Updating

**Problem**: Live updates not appearing
**Solution**:

1. Check internet connection
2. Verify RLS policies applied in Supabase
3. Check auth session is valid
4. Monitor: Network tab > WS connections

### PWA Not Installing

**Problem**: Install button doesn't appear
**Solution**:

1. Check: Desktop Chrome/Edge (mobile differs)
2. Check: HTTPS in production
3. Check: `/manifest.json` valid
4. Check: Served from HTTPS domain

---

## Security Considerations

### Data Protection

- ✅ **RLS Policies**: All data access controlled at DB level
- ✅ **Auth**: All requests require valid session
- ✅ **Barangay Isolation**: Workers see only their assigned barangay
- ✅ **Encryption**: HTTPS/TLS for all network traffic
- ✅ **Storage**: localStorage cleared on logout

### Best Practices

1. **Never store sensitive auth tokens in localStorage**
   - Already handled by Supabase client

2. **Validate all form submissions server-side**
   - Forms do local validation
   - Server validates before inserting

3. **Clear cache on security event**
   - Add logout function to clear PWA cache

4. **Rotate credentials regularly**
   - Use Supabase session refresh

---

## Future Enhancements

### Phase 4 (Planned)

- [ ] Batch photo upload to Supabase Storage
- [ ] SMS notifications for high-priority cases
- [ ] QR code resident verification
- [ ] Multilingual support (Tagalog)
- [ ] Offline index for faster local queries
- [ ] Location services integration
- [ ] Voice notes in forms
- [ ] Analytics dashboard

### Phase 5 (Future)

- [ ] Native mobile app (React Native)
- [ ] Desktop admin panel
- [ ] Report generation
- [ ] Integration with national health system

---

## Support & Documentation

### File Structure

```
┌── lib/
│   ├── hooks/
│   │   └── useHealthWorkerRealtime.ts      // Real-time subscriptions
│   ├── queries/
│   │   └── health-workers.ts               // Database queries
│   ├── types/
│   │   └── index.ts                        // TypeScript types
│   └── utils/
│       ├── offline-queue.ts                // Offline queue system
│       └── pwa-utils.ts                    // PWA utilities
├── components/
│   ├── forms/
│   │   ├── vaccination-form.tsx            // Vaccination entry
│   │   ├── maternal-health-form.tsx        // Maternal health entry
│   │   └── senior-assistance-form.tsx      // Senior care entry
│   ├── offline/
│   │   └── offline-queue-status.tsx        // Queue UI components
│   └── pwa/
│       ├── pwa-status-bar.tsx              // Status indicators
│       └── pwa-initializer.tsx             // PWA init
├── public/
│   ├── sw.js                               // Service worker
│   ├── manifest.json                       // PWA manifest
│   └── offline.html                        // Offline fallback
└── SQL/
    ├── RLS_POLICIES.sql                    // Security policies
    └── SENIORS_ASSISTANCE_TABLE.sql         // Senior care table
```

### Key Types

```typescript
// VaccinationRecord
{
  vaccine_name: string
  dose_number: number
  vaccine_date: string
  status: "pending" | "completed" | "failed"
  photo_url?: string
  synced: boolean
}

// MaternalHealthRecord
{
  visit_date: string
  trimester: "First" | "Second" | "Third" | "Postpartum"
  blood_pressure_systolic: number
  blood_pressure_diastolic: number
  hemoglobin: number
  interventions: {
    tetanus_toxoid: boolean
    iron_supplement: boolean
    prenatal_vitamins: boolean
  }
  synced: boolean
}

// SeniorAssistanceRecord
{
  visit_date: string
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  heart_rate?: number
  blood_glucose?: number
  mobility_status: "independent" | "assisted" | "dependent"
  cognitive_status: "sharp" | "mild_impairment" | "moderate_impairment" | "severe_impairment"
  assistance_type?: string
  referral_needed: boolean
  synced: boolean
}
```

---

## Questions?

For issues or questions, check:

1. Supabase documentation: https://supabase.com/docs
2. Next.js App Router: https://nextjs.org/docs/app
3. Service Worker API: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
4. PWA docs: https://web.dev/progressive-web-apps/

---

**Last Updated**: January 2025
**Version**: 2.0 (Complete Health Workers Module)
**Status**: Production-ready ✅
