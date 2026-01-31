# 🚀 Health Indicators Quick Start Guide

## What You Got

A complete health indicators (disease surveillance) system ready to use in your Naga CMS dashboard.

---

## ⚡ Quick Setup (5 minutes)

### 1. **View the Component** (Already Done! ✅)

Navigate to `/dashboard/health-indicators` - you'll see a new "Health Indicators Management" section at the bottom.

### 2. **Add Sample Data** (Optional)

Copy the SQL from `HEALTH_INDICATORS_SAMPLE_DATA.sql`:

1. Open Supabase dashboard
2. Go to SQL Editor
3. Paste the SQL and execute
4. You now have 35 sample records

### 3. **Create a Test Resident**

If you don't have residents yet:

```sql
INSERT INTO public.residents (
  barangay,
  purok,
  full_name,
  birth_date,
  sex,
  contact_number
) VALUES (
  'Barangay San Jose',
  'Purok 1',
  'Test Patient',
  '1985-01-15',
  'Male',
  '09123456789'
);
```

### 4. **Test Features**

The component shows:

- 📊 Statistics cards (average, min, max)
- 📋 Table of indicators
- 🎨 Color-coded status badges
- 🔍 Filter by type
- 📤 Bulk import button

---

## 📊 Using the Component

### Bulk Import (CSV Format)

Click "Bulk Import" and paste:

```
Hypertension, 140, mmHg, warning
Diabetes, 180, mg/dL, normal
Malaria, 5, cases, critical
```

Each line = `type, value, unit, status`

### Via Code

```typescript
import { bulkCreateHealthIndicatorsAction } from "@/lib/actions/health-indicators";

// Insert multiple indicators
const result = await bulkCreateHealthIndicatorsAction([
  {
    resident_id: "uuid",
    indicator_type: "Hypertension",
    value: 145,
    unit: "mmHg",
    status: "warning",
  },
]);
```

### Via API

```bash
GET /api/health-indicators?residentId=uuid
POST /api/health-indicators (with indicator data)
```

---

## 📁 Key Files

| File                                              | Purpose                           |
| ------------------------------------------------- | --------------------------------- |
| `HEALTH_INDICATORS_SAMPLE_DATA.sql`               | 35 sample records ready to import |
| `HEALTH_INDICATORS_INTEGRATION.md`                | Detailed technical docs           |
| `HEALTH_INDICATORS_SETUP.md`                      | Setup checklist & verification    |
| `HEALTH_INDICATORS_IMPLEMENTATION.md`             | What was built & how it works     |
| `scripts/parse-health-indicators.py`              | CSV parser (for your own data)    |
| `lib/actions/health-indicators.ts`                | Server-side functions             |
| `app/api/health-indicators/route.ts`              | REST API endpoints                |
| `components/dashboard/health-indicators-grid.tsx` | React component                   |

---

## 🎯 Common Tasks

### Show indicators for specific resident

```tsx
<HealthIndicatorsGrid residentId="resident-uuid" showStats={true} />
```

### Get statistics

```typescript
const stats = await getHealthIndicatorStatsAction("resident-id");
// Returns: { Hypertension: {avg: 142, min: 120, max: 160, ...}, ... }
```

### Filter by indicator type

Use the filter input in the component UI, or:

```typescript
const result = await getHealthIndicatorsAction("resident-id", {
  type: "Hypertension",
  limit: 20,
});
```

---

## ✨ What's Included

✅ Database table and indexes
✅ REST API (GET, POST)
✅ Server actions (CRUD, bulk, stats)
✅ React component (table, stats, import)
✅ CSV parser script
✅ Sample data (35 records)
✅ Full documentation
✅ TypeScript support
✅ Error handling
✅ Pagination support

---

## 🔍 Example Data

The system includes disease data for Naga City barangays:

- **Abella**: Hypertension, Diabetes, Respiratory Infection, Dengue, Gastroenteritis
- **Bagumbayan Norte**: Pneumonia, Malaria, Asthma, Diarrhea, Hypertension
- **Bagumbayan Sur**: Tuberculosis, Typhoid, Measles, Bronchitis, Skin Infection
- **Balao**: Diabetes, Pneumonia, Malaria, Hypertension, Dengue
- **Cararayan**: Respiratory Infection, Hepatitis A, Gastroenteritis, Typhoid, Measles
- **Mabini**: Heart Disease, Stroke, COPD, Chronic Kidney Disease, Hypertension
- **Sabang**: Dengue, Malaria, Leptospirosis, Pneumonia, Typhoid

---

## 🛠️ Customization

### Add different indicator types

Edit `DISEASES_BY_BARANGAY` in `scripts/parse-health-indicators.py`

### Change status colors

Update `getStatusColor()` in the component (around line 250)

### Modify UI layout

Edit the component's grid structure (responsive classes like `md:grid-cols-3`)

### Change statistics calculations

Update the stats function in `lib/actions/health-indicators.ts`

---

## 🐛 Troubleshooting

**Q: "No data showing"**

- A: Check if residents exist in the database
- A: Verify health_indicators table has data

**Q: Import fails**

- A: Check CSV format (comma-separated, 4 columns)
- A: Verify values are numeric
- A: Check resident_id exists

**Q: Status colors wrong**

- A: Status is auto-calculated based on value thresholds
- A: Manually set in bulk import if needed

**Q: Can't see component**

- A: Navigate to `/dashboard/health-indicators`
- A: Check if logged in
- A: Scroll down to "Health Indicators Management" section

---

## 📞 Need Help?

1. **Technical details** → `HEALTH_INDICATORS_INTEGRATION.md`
2. **Setup issues** → `HEALTH_INDICATORS_SETUP.md`
3. **How it works** → `HEALTH_INDICATORS_IMPLEMENTATION.md`
4. **API reference** → Check `app/api/health-indicators/route.ts`
5. **Functions** → Check `lib/actions/health-indicators.ts`

---

## 🎉 You're All Set!

The health indicators system is:

- ✅ Fully integrated
- ✅ Production-ready
- ✅ Tested and compiled
- ✅ Ready to use

Start using it now:

1. Go to `/dashboard/health-indicators`
2. Click "Bulk Import" or add indicators manually
3. View statistics and trends
4. Track disease surveillance across barangays

Happy coding! 🚀
