# Health Workers Dashboard - Implementation Guide

## Quick Start

### 1. Access the Dashboard

Navigate to your application at:

```
http://localhost:3000/dashboard/health-workers
```

### 2. Initial Setup

#### Ensure Database Tables Exist

The dashboard requires these tables in Supabase:

- `health_indicators`
- `vaccination_records`
- `health_programs`
- `program_beneficiaries`
- `residents`
- `users`
- `disease_cases`
- `vital_signs_history`

#### Load Sample Data

If you don't have data, load sample data into these tables:

```sql
-- Sample resident data
INSERT INTO residents (barangay, purok, full_name, birth_date, sex, contact_number)
VALUES
  ('Barangay 1', 'Purok A', 'Juan Dela Cruz', '1990-05-15', 'Male', '09123456789'),
  ('Barangay 2', 'Purok B', 'Maria Garcia', '1988-08-20', 'Female', '09987654321');

-- Sample vaccination records
INSERT INTO vaccination_records (resident_id, vaccine_name, dose_number, vaccine_date, status, administered_by)
VALUES
  ('resident-uuid-1', 'COVID-19', 1, '2025-01-15', 'completed', 'user-uuid-1'),
  ('resident-uuid-1', 'COVID-19', 2, '2025-02-15', 'pending', 'user-uuid-1');

-- Sample health indicators
INSERT INTO health_indicators (resident_id, indicator_type, value, unit, status, recorded_by)
VALUES
  ('resident-uuid-1', 'blood_pressure', 120, 'mmHg', 'normal', 'user-uuid-1'),
  ('resident-uuid-1', 'temperature', 37.5, 'Celsius', 'normal', 'user-uuid-1');
```

### 3. Component Integration

#### Import Components in Your Layout

```typescript
import { HealthWorkersDashboard } from "@/app/dashboard/health-workers/page";

// In your routing file
<Route path="/dashboard/health-workers" component={HealthWorkersDashboard} />
```

#### Add Navigation Link

Add to your dashboard navigation:

```typescript
<Link href="/dashboard/health-workers">
  <BarChart2 className="w-4 h-4" />
  Health Workers Dashboard
</Link>
```

### 4. Customization

#### Change Dashboard Title

Edit `page.tsx`:

```typescript
<h1 className="text-4xl font-bold">Your Custom Title</h1>
```

#### Adjust Metric Cards

Modify the `KeyMetricsGrid` component in `health-metrics-cards.tsx`:

```typescript
<MetricCard
  title="Custom Metric"
  value={customValue}
  bgColor="bg-custom-color"
  textColor="text-custom-text"
/>
```

#### Add New Chart

Use the chart components in `chart-components.tsx`:

```typescript
<SimpleBarChart
  title="New Chart"
  data={yourData}
  dataKey="value"
  nameKey="label"
/>
```

### 5. Data Flow

```
User Filters
    ↓
fetchDashboardData() triggers
    ↓
Parallel Query Execution
    ├→ getVaccinationCoverageByBarangay()
    ├→ getMaternalHealthStats()
    ├→ getSeniorCitizenStats()
    ├→ getPendingHealthInterventions()
    └→ getHealthTrendsOverTime()
    ↓
State Updates (setVaccinationData, etc.)
    ↓
Components Re-render with New Data
    ↓
Charts Update
```

## Feature Implementation Details

### Barangay Map Component

The `BarangayMap` component displays an interactive grid of barangays:

**Props:**

```typescript
interface BarangayMapProps {
  data: BarangayHealthData[];
  onBarangaySelect?: (barangay: string) => void;
  title?: string;
  description?: string;
}
```

**Usage:**

```typescript
<BarangayMap
  data={barangayHealthStatus}
  onBarangaySelect={(barangay) => setSelectedBarangay(barangay)}
/>
```

**Color Coding:**

- Green (80-100%): Excellent vaccination coverage
- Blue (60-80%): Good coverage
- Yellow (40-60%): Moderate coverage
- Red (0-40%): Low coverage

### Chart Components

All chart components are reusable and follow a consistent pattern:

```typescript
import { SimpleBarChart } from "@/components/dashboard/chart-components";

<SimpleBarChart
  title="Chart Title"
  description="Optional description"
  data={[{ name: "Item", value: 10 }]}
  dataKey="value"
  nameKey="name"
  color="#3b82f6"
  height={300}
/>
```

### Metric Cards

Display key metrics with trends:

```typescript
import { MetricCard } from "@/components/dashboard/health-metrics-cards";

<MetricCard
  title="Vaccinations"
  value={1234}
  description="This month"
  icon={<Syringe />}
  trend={{ value: 12, isPositive: true }}
/>
```

## Database Queries Reference

### Get Vaccination Coverage by Barangay

```typescript
const coverage = await getVaccinationCoverageByBarangay(2025);
// Returns array of barangay coverage data
```

### Get Maternal Health Statistics

```typescript
const stats = await getMaternalHealthStats("Barangay 1", 2025);
// Returns { total_visits, unique_mothers, critical_cases, ... }
```

### Get Health Trends

```typescript
const trends = await getHealthTrendsOverTime("Barangay 1", 30);
// Returns array of daily trend data
```

### Get Pending Interventions

```typescript
const pending = await getPendingHealthInterventions("Barangay 1");
// Returns array of intervention cases
```

## Styling Guide

The dashboard uses Tailwind CSS with a consistent color scheme:

- **Primary**: Blue (Vaccination metrics)
- **Secondary**: Pink (Maternal health)
- **Tertiary**: Purple (Senior citizens)
- **Alerts**: Red/Yellow (Critical/Warning)

### Color Classes Used:

```
bg-blue-50, bg-pink-50, bg-purple-50, bg-red-50, bg-yellow-50
text-blue-700, text-pink-700, text-purple-700, text-red-700, text-yellow-700
border-blue-300, border-pink-300, border-purple-300, border-red-400, border-yellow-400
```

### Responsive Classes:

```
grid-cols-1    (Mobile)
md:grid-cols-2 (Tablet)
lg:grid-cols-3 (Desktop)
lg:grid-cols-4 (Large Desktop)
```

## Advanced Customization

### Add Real-time Updates

```typescript
import { createClient } from "@/lib/db";

const supabase = createClient();

useEffect(() => {
  const subscription = supabase
    .from("health_indicators")
    .on("INSERT", (payload) => {
      // Refetch data
      fetchDashboardData();
    })
    .subscribe();

  return () => supabase.removeChannel(subscription);
}, []);
```

### Export Dashboard Data

```typescript
const exportToCSV = () => {
  const csv = Convert.arrayToCSV(vaccinationData);
  downloadFile(csv, "vaccination-report.csv");
};
```

### Add Predefined Time Ranges

```typescript
const timeRanges = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 3 months", days: 90 },
  { label: "Last 6 months", days: 180 },
];
```

## Testing

### Test with Mock Data

```typescript
const mockVaccinationData = [
  {
    barangay: "Barangay 1",
    total: 100,
    completed: 85,
    pending: 10,
    overdue: 5,
    coverage_percentage: 85,
  },
];

setVaccinationData(mockVaccinationData);
```

### Unit Test Example

```typescript
import { render, screen } from "@testing-library/react";
import { MetricCard } from "@/components/dashboard/health-metrics-cards";

describe("MetricCard", () => {
  it("displays the metric title", () => {
    render(
      <MetricCard
        title="Test Metric"
        value={100}
        icon={<div />}
      />
    );
    expect(screen.getByText("Test Metric")).toBeInTheDocument();
  });
});
```

## Performance Monitoring

Monitor dashboard performance:

```typescript
// In page.tsx
useEffect(() => {
  const startTime = performance.now();

  fetchDashboardData().then(() => {
    const endTime = performance.now();
    console.log(`Data load time: ${endTime - startTime}ms`);
  });
}, []);
```

## Troubleshooting Common Issues

### Issue: "Cannot read property 'map' of undefined"

**Solution**: Add null checks and default values

```typescript
const data = vaccinationData || [];
```

### Issue: Charts not rendering

**Solution**: Verify data format matches expected structure

```typescript
// Expected format for BarChart
[{ barangay: "Name", coverage_percentage: 80 }];
```

### Issue: Slow dashboard load

**Solution**: Check network tab and consider caching

```typescript
const [cachedData, setCachedData] = useState(null);
const [cacheTime, setCacheTime] = useState(0);

if (Date.now() - cacheTime < 300000) {
  // 5 min cache
  return cachedData;
}
```

## Next Steps

1. **Customize Metrics**: Add/remove metrics based on requirements
2. **Add Notifications**: Alert health workers of critical cases
3. **Implement Export**: Add PDF/Excel report generation
4. **Add Filters**: More granular filtering options
5. **Real-time Updates**: Enable live data updates
6. **Mobile Optimization**: Further enhance mobile experience
7. **Analytics**: Track dashboard usage and metrics
8. **Integration**: Connect with other health systems

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Recharts Documentation](https://recharts.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

For additional support, contact the NagaCare development team.
