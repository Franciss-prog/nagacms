# Health Indicators Import & Integration Guide

This guide explains how to parse, insert, and display health indicators (disease surveillance data) from Naga City's CY 2023-2024 health data.

## Overview

The system now includes:

1. **CSV Parser** - Python script to parse disease surveillance data
2. **Database Schema** - `health_indicators` table for storing disease/health metrics
3. **API Endpoints** - Routes for CRUD operations on health indicators
4. **Server Actions** - Backend functions for bulk operations
5. **Frontend Component** - Rich UI for viewing and importing indicators

## File Structure

```
lib/
├── actions/
│   └── health-indicators.ts          # Server actions for CRUD & bulk operations
├── queries/
│   └── health-indicators.ts          # Query functions
└── schemas/
    └── health-indicators.ts          # Zod validation schemas (if needed)

app/
├── api/
│   └── health-indicators/
│       └── route.ts                  # API endpoints for health indicators
└── dashboard/
    └── health-indicators/
        └── page.tsx                  # Dashboard page with component integration

components/
└── dashboard/
    └── health-indicators-grid.tsx    # Main UI component for indicators

scripts/
└── parse-health-indicators.py        # CSV parser script for data processing
```

## Database Schema

The `health_indicators` table structure:

```sql
CREATE TABLE public.health_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
  indicator_type text NOT NULL,
  value numeric NOT NULL,
  unit text NOT NULL,
  status text CHECK (status = ANY (ARRAY['normal', 'warning', 'critical'])),
  notes text,
  recorded_by uuid NOT NULL REFERENCES public.users(id),
  recorded_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);
```

## Usage Guide

### 1. Parse CSV Data

The Python script generates sample health indicators based on Naga City's disease surveillance:

```bash
cd scripts
python3 parse-health-indicators.py
```

This creates `HEALTH_INDICATORS_SAMPLE_DATA.sql` with pre-generated insert statements.

### 2. Insert Data into Database

Run the generated SQL file in Supabase:

```sql
-- In Supabase SQL Editor
\i HEALTH_INDICATORS_SAMPLE_DATA.sql
```

Or manually insert:

```sql
INSERT INTO public.health_indicators (
  id,
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  notes,
  recorded_by,
  recorded_at
) VALUES (
  gen_random_uuid(),
  'resident-uuid-here',
  'Hypertension',
  150,
  'mmHg',
  'warning',
  'Recorded from disease surveillance',
  'user-uuid-here',
  now()
);
```

### 3. Use Server Actions

#### Single Health Indicator

```typescript
import { createHealthIndicatorAction } from "@/lib/actions/health-indicators";

const result = await createHealthIndicatorAction({
  resident_id: "resident-id",
  indicator_type: "Diabetes",
  value: 180,
  unit: "mg/dL",
  status: "warning",
  notes: "Fasting glucose test",
});
```

#### Bulk Import

```typescript
import { bulkCreateHealthIndicatorsAction } from "@/lib/actions/health-indicators";

const indicators = [
  {
    resident_id: "resident-1",
    indicator_type: "Hypertension",
    value: 140,
    unit: "mmHg",
    status: "warning",
  },
  {
    resident_id: "resident-2",
    indicator_type: "Diabetes",
    value: 200,
    unit: "mg/dL",
    status: "critical",
  },
];

const result = await bulkCreateHealthIndicatorsAction(indicators);
// Returns: { success: true, count: 2 }
```

#### Get Statistics

```typescript
import { getHealthIndicatorStatsAction } from "@/lib/actions/health-indicators";

const stats = await getHealthIndicatorStatsAction("resident-id");
// Returns statistics by indicator type (average, min, max, status distribution)
```

### 4. Frontend Component Usage

```typescript
import { HealthIndicatorsGrid } from "@/components/dashboard/health-indicators-grid";

// Display for specific resident
<HealthIndicatorsGrid
  residentId="resident-uuid"
  showStats={true}
/>

// Display for barangay
<HealthIndicatorsGrid
  barangay="Barangay San Jose"
  showStats={true}
/>
```

### 5. API Endpoints

#### GET Health Indicators

```bash
GET /api/health-indicators?residentId=uuid&type=Hypertension&limit=50&offset=0
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "resident_id": "uuid",
      "indicator_type": "Hypertension",
      "value": 150,
      "unit": "mmHg",
      "status": "warning",
      "recorded_at": "2024-01-30T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0
  }
}
```

#### POST Create Health Indicator

```bash
POST /api/health-indicators
Content-Type: application/json

{
  "resident_id": "uuid",
  "indicator_type": "Diabetes",
  "value": 180,
  "unit": "mg/dL",
  "status": "warning",
  "notes": "Fasting glucose"
}
```

## CSV Format for Bulk Import

The bulk import component accepts CSV format:

```
indicator_type,value,unit,status
Hypertension,140,mmHg,warning
Diabetes,180,mg/dL,normal
Heart Rate,88,bpm,normal
```

## Status Indicators

- **Normal**: Value within healthy range
- **Warning**: Value slightly elevated, requires monitoring
- **Critical**: Value dangerously high, requires immediate action

## Disease Categories Included

Based on Naga City's CY 2023-2024 data:

### Common Diseases by Barangay

- **Abella**: Hypertension, Diabetes, Respiratory Infection, Gastroenteritis, Dengue
- **Bagumbayan Norte**: Pneumonia, Malaria, Diarrhea, Hypertension, Asthma
- **Bagumbayan Sur**: Tuberculosis, Typhoid, Skin Infection, Bronchitis, Measles
- **Balao**: Diabetes, Hypertension, Pneumonia, Malaria, Dengue
- **Cararayan**: Respiratory Infection, Gastroenteritis, Hepatitis A, Measles, Typhoid
- **Mabini**: Hypertension, Heart Disease, Stroke, Chronic Kidney Disease, COPD
- **Sabang**: Malaria, Dengue, Leptospirosis, Typhoid, Pneumonia

## Features

✅ Parse and import CSV disease surveillance data
✅ Bulk insert health indicators
✅ Calculate statistics per indicator type
✅ Filter by indicator type
✅ Paginated data retrieval
✅ Status color coding (Normal/Warning/Critical)
✅ Statistics cards showing averages, min/max
✅ Responsive UI component
✅ Integration with Supabase

## Next Steps

1. Set up sample residents in the `residents` table
2. Run the Python parser to generate insert statements
3. Import the data into Supabase
4. Access the health indicators through the dashboard
5. Use the bulk import feature in the UI for additional data

## Troubleshooting

**Issue: "Unauthorized" error**

- Solution: Ensure user is logged in and has proper session

**Issue: "Invalid resident ID"**

- Solution: Verify resident exists in `residents` table

**Issue: No data showing**

- Solution: Check that health indicators exist for the resident in the database

**Issue: Bulk import failing**

- Solution: Verify CSV format matches: `type, value, unit, status`
