# Health Workers Dashboard - Component Architecture Reference

## Component Hierarchy

```
HealthWorkersDashboard (page.tsx)
│
├── Header Section
│   ├── Title & Subtitle
│   ├── Refresh Button
│   ├── Export Button
│   └── Last Updated Timestamp
│
├── Filter Section
│   ├── Year Selector
│   ├── Barangay Selector
│   └── Status Filter
│
├── Key Metrics Section
│   └── KeyMetricsGrid
│       ├── MetricCard (Vaccinations)
│       ├── MetricCard (Maternal Health)
│       ├── MetricCard (Senior Citizens)
│       └── MetricCard (Pending Interventions)
│
├── Detailed Metrics Cards Section
│   ├── VaccinationMetrics
│   │   ├── Total Administered
│   │   ├── Completion Rate Progress Bar
│   │   └── Status Breakdown (Completed/Pending/Overdue)
│   │
│   ├── PendingInterventionsMetrics
│   │   ├── Critical Priority Count
│   │   └── Needs Attention Count
│   │
│   ├── MaternalHealthMetrics
│   │   ├── Total Visits
│   │   ├── Unique Mothers
│   │   └── Status Breakdown
│   │
│   └── SeniorCitizenMetrics
│       ├── Total Seniors Assisted
│       ├── Active/Completed Programs
│       └── Health Check Statistics
│
├── Barangay Map Section
│   └── BarangayMap
│       ├── Interactive Barangay Grid
│       ├── Color-Coded Coverage
│       ├── Status Badges
│       ├── Vaccination Coverage Chart
│       └── Legend
│
├── Underserved Areas Alert
│   └── UnderservedAreasHighlight
│       └── List of Critical Barangays
│
├── Data Visualizations Section
│   ├── SimpleBarChart
│   │   └── Vaccination Coverage by Barangay
│   │
│   ├── HealthTrendLineChart
│   │   └── Health Status Trends (30 days)
│   │
│   ├── Pie & Bar Charts Grid
│   │   ├── HealthStatusPieChart
│   │   └── IndicatorTypeBarChart
│   │
│   └── CombinedHealthChart
│       └── Vaccination + Coverage Analysis
│
└── Pending Interventions Table
    └── Scrollable Case List
        ├── Resident Name
        ├── Status Badge
        ├── Indicator Details
        ├── Location & Date
        └── Review Button
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ User Interaction (Filter Selection)                          │
│ - Year selected                                             │
│ - Barangay selected                                         │
│ - Status selected                                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ fetchDashboardData() Triggered                              │
│ [useEffect hook monitors selectedYear & selectedBarangay]   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Parallel Query Execution (Promise.all)                      │
│                                                             │
│ Promise.all([                                               │
│   getVaccinationCoverageByBarangay(),                      │
│   getMaternalHealthStats(),                                │
│   getSeniorCitizenStats(),                                 │
│   getPendingHealthInterventions(),                         │
│   getHealthTrendsOverTime(),                               │
│   getBarangayHealthStatus(),                               │
│   getIndicatorsByType(),                                   │
│   getIndicatorsByStatus(),                                 │
│   getUnderservedAreas()                                    │
│ ])                                                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ State Updates                                               │
│                                                             │
│ setVaccinationData()                                        │
│ setMaternalHealthStats()                                   │
│ setSeniorCitizenStats()                                    │
│ setPendingInterventions()                                  │
│ setHealthTrends()                                          │
│ setBarangayHealthStatus()                                  │
│ setIndicatorsByType()                                      │
│ setIndicatorsByStatus()                                    │
│ setUnderservedAreas()                                      │
│ setLastRefresh()                                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Component Re-render with New Data                           │
│                                                             │
│ All state-dependent components receive updated props        │
│ and automatically re-render                                │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ UI Updates                                                  │
│ - Metrics update with new values                            │
│ - Charts recalculate and animate                            │
│ - Map recolors based on new coverage data                   │
│ - Table populates with intervention cases                   │
│ - Underserved areas list updates                            │
└─────────────────────────────────────────────────────────────┘
```

## Component Props Interface Reference

### Chart Components

```typescript
// SimpleBarChart Props
{
  title: string;
  description?: string;
  data: any[];
  dataKey: string;           // Field to display as bar value
  nameKey: string;           // Field to display as x-axis label
  color?: string;            // Hex color for bars
  height?: number;           // Chart height in pixels
}

// HealthTrendLineChart Props
{
  title: string;
  description?: string;
  data: any[];
  lines: Array<{
    key: string;             // State field name
    color: string;           // Hex color
    name: string;            // Display label
  }>;
  height?: number;
}

// HealthStatusPieChart Props
{
  title: string;
  description?: string;
  data: Array<{
    name: string;            // Segment label
    value: number;           // Segment size
    color: string;           // Hex color
  }>;
  height?: number;
}

// CombinedHealthChart Props
{
  title: string;
  description?: string;
  data: any[];
  bars: Array<{
    key: string;
    color: string;
    name: string;
  }>;
  lines?: Array<{
    key: string;
    color: string;
    name: string;
  }>;
  height?: number;
}
```

### Metric Card Components

```typescript
// MetricCard Props
{
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;           // Percentage change
    isPositive: boolean;
  };
  bgColor?: string;          // Tailwind bg class
  textColor?: string;        // Tailwind text class
}

// VaccinationMetrics Props
{
  total: number;
  completed: number;
  pending: number;
  overdue?: number;
}

// MaternalHealthMetrics Props
{
  totalVisits: number;
  uniqueMothers: number;
  criticalCases: number;
  warningCases: number;
  normalCases: number;
}

// SeniorCitizenMetrics Props
{
  totalAssisted: number;
  activeAssistance: number;
  completedAssistance: number;
  totalHealthChecks: number;
  criticalCases: number;
  warningCases: number;
}

// PendingInterventionsMetrics Props
{
  count: number;
  criticalCount: number;
  warningCount: number;
  averageWaitTime?: string;
}
```

### Map Component

```typescript
// BarangayMap Props
{
  data: Array<{
    barangay: string;
    vaccination_coverage: number;
    pending_interventions: number;
    health_status: "normal" | "warning" | "critical";
    maternal_health_visits?: number;
    senior_citizens_assisted?: number;
  }>;
  onBarangaySelect?: (barangay: string) => void;
  title?: string;
  description?: string;
}

// UnderservedAreasHighlight Props
{
  data: BarangayHealthData[];
  onBarangaySelect?: (barangay: string) => void;
}
```

## Query Output Formats

### getVaccinationCoverageByBarangay

```typescript
Array<{
  barangay: string;
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  coverage_percentage: number;
}>;
```

### getMaternalHealthStats

```typescript
{
  total_visits: number;
  unique_mothers: number;
  critical_cases: number;
  warning_cases: number;
  normal_cases: number;
}
```

### getHealthTrendsOverTime

```typescript
Array<{
  date: string; // YYYY-MM-DD
  total: number;
  normal: number;
  warning: number;
  critical: number;
}>;
```

### getPendingHealthInterventions

```typescript
Array<{
  id: string;
  resident_id: string;
  indicator_type: string;
  value: number;
  unit: string;
  status: "warning" | "critical";
  recorded_at: string;
  residents: {
    id: string;
    full_name: string;
    barangay: string;
    contact_number: string;
  };
}>;
```

### getBarangayHealthStatus

```typescript
Array<{
  barangay: string;
  vaccination_coverage: number;
  pending_interventions: number;
  health_status: "normal" | "warning" | "critical";
}>;
```

## State Management

### Dashboard Page State Variables

```typescript
// Filter state
selectedYear: number          // Current year selected
selectedBarangay: string      // "all" or specific barangay

// UI state
isLoading: boolean           // Data loading indicator
lastRefresh: Date | null     // Last update timestamp

// Data state
vaccinationData: any[]        // Vaccination coverage by barangay
maternalHealthStats: any      // Maternal health statistics
seniorCitizenStats: any       // Senior citizen statistics
pendingInterventions: any[]   // Pending intervention cases
healthTrends: any[]           // 30-day trend data
barangayHealthStatus: BarangayHealthData[]  // All barangay status
indicatorsByType: any[]       // Indicator type frequency
indicatorsByStatus: any[]     // Health status distribution
underservedAreas: any[]       // Underserved barangays
```

## Error Handling

All queries include try-catch blocks:

```typescript
try {
  const { data, error } = await supabase.from("table").select("*");
  if (error) throw error;
  return data || [];
} catch (error) {
  console.error("Error fetching data:", error);
  return []; // Return empty array as fallback
}
```

Dashboard catches fetch errors:

```typescript
try {
  // Fetch all data
  setLastRefresh(new Date());
} catch (error) {
  console.error("Error fetching dashboard data:", error);
  // Data remains in previous state
  // User sees outdated data with notice
}
```

## Performance Characteristics

### Loading Time Optimization

- **Parallel Queries**: All 9 queries run simultaneously (~15-30ms vs 200-300ms sequential)
- **Lazy Rendering**: Charts only render when data available
- **Pagination**: Intervention list shows 20 items initially
- **Memoization**: Consider wrapping chart components with React.memo()

### Expected Load Times

- Initial load: 1-3 seconds
- Filter update: 0.3-1 second
- Chart animation: 0.5 seconds

### Memory Usage

- State stored in component memory (not persisted)
- Charts use Recharts efficient rendering
- Intervention list limited to 20 visible items

## Browser Compatibility

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ⚠️ IE11 (Not supported, use polyfills for Promise.all)

## Accessibility Features

- Semantic HTML structure
- Color-blind friendly color scheme (with patterns)
- Keyboard navigation support
- ARIA labels on interactive elements
- Focus indicators on buttons
- High contrast text

## Mobile Responsiveness

```
Mobile (< 640px):
- Single column grid
- Stacked filters
- Touch-friendly buttons
- Collapsed sections

Tablet (640px - 1024px):
- 2-column grid for metrics
- Side-by-side filters
- Scalable charts

Desktop (> 1024px):
- Multi-column layouts
- Full feature set
- Optimized spacing
```

## Testing Strategy

### Unit Tests

```typescript
// Test individual components
- MetricCard display
- Chart data processing
- BarangayMap color logic
```

### Integration Tests

```typescript
// Test component interactions
- Filter changes trigger data fetch
- Data updates propagate to components
- Charts update with new data
```

### E2E Tests

```typescript
// Test full user workflows
- User selects year → data updates
- User selects barangay → map highlights
- User clicks intervention → details load
```

## Deployment Checklist

- [ ] All environment variables configured
- [ ] Supabase tables created with sample data
- [ ] API keys secured in .env.local
- [ ] RLS policies configured on Supabase
- [ ] User authentication working
- [ ] Responsive design tested on mobile
- [ ] Performance tested (load time < 3s)
- [ ] Error handling tested
- [ ] Browser compatibility verified
- [ ] Accessibility audit passed
- [ ] Analytics configured
- [ ] Monitoring/logging enabled

---

For more information, refer to:

- HEALTH_WORKERS_DASHBOARD.md (Feature documentation)
- HEALTH_WORKERS_DASHBOARD_SETUP.md (Setup and customization)
