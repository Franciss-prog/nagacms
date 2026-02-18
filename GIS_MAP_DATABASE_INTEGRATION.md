# GIS Map Database Integration - Quick Start

## Overview

The GIS Map is now connected to your Supabase database and displays real vaccination coverage data from Naga City barangays.

## Sample Data Insertion

The sample data insertion query is provided in the main response. It includes:

- 81 sample residents across all 27 Naga City barangays (3 per barangay)
- Vaccination records with mixed statuses (completed, pending, overdue)

## Using the Database-Connected GIS Map

### Option 1: Server Component (Recommended)

```tsx
import { BarangayGisMapDatabase } from "@/components/dashboard/barangay-gis-map-database";

export default function GisMapPage() {
  return (
    <div className="p-6">
      <BarangayGisMapDatabase />
    </div>
  );
}
```

### Option 2: Fetch Data Manually

```tsx
import { BarangayGisMapIntegrated } from "@/components/dashboard/barangay-gis-map-integrated";
import { getGisMapVaccinationData } from "@/lib/queries/gis-map-data";

export default async function CustomPage() {
  const data = await getGisMapVaccinationData();

  return (
    <div className="p-6">
      <BarangayGisMapIntegrated
        data={data}
        useMockData={false}
        title="Custom Title"
      />
    </div>
  );
}
```

### Option 3: Client Component with Mock Data

```tsx
"use client";

import { BarangayGisMapIntegrated } from "@/components/dashboard/barangay-gis-map-integrated";

export default function MockMapPage() {
  return <BarangayGisMapIntegrated useMockData={true} title="Demo Map" />;
}
```

## How It Works

### Data Flow

1. **Database Tables**: `residents` and `vaccination_records`
2. **Query Function**: `getGisMapVaccinationData()` in `/lib/queries/gis-map-data.ts`
3. **Aggregation**: Groups residents by barangay, calculates vaccination coverage
4. **Rendering**: Displays color-coded markers on the map

### Vaccination Coverage Calculation

```
Coverage % = (Completed Vaccinations / Total Residents) × 100
```

### Color Coding

- 🔴 Red (0-40%): Critical - Needs immediate attention
- 🟠 Orange (40-60%): Low - Accelerated vaccination needed
- 🔵 Blue (60-80%): Moderate - On track
- 🟢 Green (80-100%): Good - Target achieved

## Database Schema

### Residents Table

```sql
residents (
  id uuid,
  barangay text,
  purok text,
  full_name text,
  birth_date date,
  sex text,
  ...
)
```

### Vaccination Records Table

```sql
vaccination_records (
  id uuid,
  resident_id uuid,
  vaccine_name text,
  dose_number int,
  vaccine_date date,
  status text, -- 'completed', 'pending', 'overdue'
  ...
)
```

## Features

### Interactive Map Markers

- Click on any marker to view detailed barangay statistics
- Hover to see quick vaccination percentage
- Color-coded by coverage level
- Percentage displayed on each marker

### Auto-Updates

- Data refreshes on page reload
- Real-time calculations from database
- Automatically handles new barangays

### Fallback Behavior

- If no database data is found, displays sample data
- Graceful error handling
- Console logging for debugging

## API Reference

### getGisMapVaccinationData()

Server action that fetches and aggregates vaccination data.

**Returns**: `Promise<BarangayVaccinationData[]>`

**Example**:

```typescript
const data = await getGisMapVaccinationData();
// [
//   {
//     barangay: "Abella",
//     vaccination_coverage: 85.5,
//     pending_interventions: 12,
//     total_residents: 3,
//     last_updated: "2026-02-18T..."
//   },
//   ...
// ]
```

### getGisMapBarangayData(barangay)

Fetches data for a specific barangay.

**Parameters**:

- `barangay: string` - Barangay name

**Returns**: `Promise<BarangayVaccinationData | null>`

## Performance Notes

- Query is optimized with indexed lookups on `barangay` and `resident_id`
- Aggregation done in application layer for flexibility
- Caching can be added using Next.js revalidation

## Troubleshooting

### No data showing?

1. Check if residents exist in database
2. Verify vaccination_records table has data
3. Check browser console for errors
4. Ensure Supabase connection is working

### Wrong calculations?

1. Verify foreign keys are correct (`resident_id` matches)
2. Check barangay names match exactly (case-sensitive)
3. Ensure vaccination status values are 'completed', 'pending', or 'overdue'

## Example Integration

See `app/dashboard/health-workers/page.tsx` for a complete example of integrating the GIS map into a dashboard page.
