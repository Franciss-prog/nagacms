# NagaCare Health Workers Dashboard Implementation

## Overview

The Health Workers Dashboard is a comprehensive, GIS-enabled community health information system built with Next.js and Supabase. It provides real-time health metrics, interactive barangay-level visualization, and actionable health interventions for community health workers.

## Features

### 1. **Interactive Barangay-Level Map**

- **Vaccination Coverage Visualization**: Color-coded barangays showing vaccination completion rates
- **Health Status Indicators**: Real-time status (Normal/Warning/Critical)
- **Underserved Areas Highlighting**: Automatic identification of areas needing attention
- **Maternal Health Monitoring Points**: Integrate tracking of maternal wellness
- **Senior Citizen Assistance Locations**: Track senior care programs
- **Interactive Selection**: Click barangays to filter dashboard data

**Components:**

- `BarangayMap` - Main interactive map component
- `UnderservedAreasHighlight` - Alert component for critical areas

### 2. **Key Health Indicators Dashboard**

- **Total Vaccinations Administered**: Real-time count with trend analysis
- **Maternal Health Visits Tracked**: Wellness check monitoring
- **Senior Citizens Receiving Assistance**: Active program tracking
- **Pending Health Interventions**: Priority case management

**Components:**

- `KeyMetricsGrid` - Quick metrics overview
- `VaccinationMetrics` - Detailed vaccination statistics
- `MaternalHealthMetrics` - Maternal wellness tracking
- `SeniorCitizenMetrics` - Senior care programs
- `PendingInterventionsMetrics` - Priority interventions

### 3. **Data Visualization Components**

- **Bar Charts**: Vaccination coverage by barangay
- **Line Graphs**: Health trends over 30-day period
- **Pie Charts**: Demographics and health status breakdown
- **Combined Charts**: Multi-metric analysis with bars and lines

**Components:**

- `SimpleBarChart` - Reusable bar chart component
- `HealthTrendLineChart` - Trend analysis with multiple lines
- `HealthStatusPieChart` - Distribution visualization
- `CombinedHealthChart` - Multi-metric charting
- `IndicatorTypeBarChart` - Indicator frequency analysis

## Technology Stack

- **Frontend**: Next.js 14+ (App Router)
- **State Management**: React hooks (useState, useEffect)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **UI Components**: Custom + Radix UI components
- **Language**: TypeScript

## File Structure

```
app/
  dashboard/
    health-workers/
      page.tsx           # Main dashboard page
      layout.tsx         # Layout with metadata

lib/
  queries/
    health-indicators.ts # Enhanced with dashboard queries
      - getVaccinationCoverageByBarangay()
      - getMaternalHealthStats()
      - getSeniorCitizenStats()
      - getPendingHealthInterventions()
      - getHealthTrendsOverTime()
      - getUnderservedAreas()
      - getBarangayHealthStatus()

components/
  dashboard/
    chart-components.tsx         # Reusable chart components
      - SimpleBarChart
      - HealthTrendLineChart
      - HealthStatusPieChart
      - CombinedHealthChart
      - IndicatorTypeBarChart

    barangay-map.tsx            # Map visualization components
      - BarangayMap
      - UnderservedAreasHighlight

    health-metrics-cards.tsx    # Metric card components
      - MetricCard
      - VaccinationMetrics
      - MaternalHealthMetrics
      - SeniorCitizenMetrics
      - PendingInterventionsMetrics
      - KeyMetricsGrid
```

## Key Queries Added

### 1. `getVaccinationCoverageByBarangay(year: number)`

Returns vaccination coverage statistics grouped by barangay:

```typescript
{
  barangay: string;
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  coverage_percentage: number;
}
```

### 2. `getMaternalHealthStats(barangay?: string, year?: number)`

Returns maternal health monitoring statistics:

```typescript
{
  total_visits: number;
  unique_mothers: number;
  critical_cases: number;
  warning_cases: number;
  normal_cases: number;
}
```

### 3. `getSeniorCitizenStats(barangay?: string, year?: number)`

Returns senior citizen assistance statistics:

```typescript
{
  total_seniors_assisted: number;
  active_assistance: number;
  completed_assistance: number;
  total_health_checks: number;
  critical_cases: number;
  warning_cases: number;
}
```

### 4. `getPendingHealthInterventions(barangay?: string)`

Returns health cases requiring intervention:

```typescript
{
  id: string;
  resident_id: string;
  indicator_type: string;
  value: number;
  unit: string;
  status: "warning" | "critical";
  recorded_at: string;
  residents: {
    full_name: string;
    barangay: string;
    contact_number: string;
  }
}
```

### 5. `getHealthTrendsOverTime(barangay?: string, daysBack: number = 30)`

Returns health trend data for chart visualization:

```typescript
{
  date: string;
  total: number;
  normal: number;
  warning: number;
  critical: number;
}
```

### 6. `getUnderservedAreas()`

Identifies barangays with high population and few health programs:

```typescript
{
  barangay: string;
  population: number;
  programs: number;
  ratio: number;
}
```

### 7. `getBarangayHealthStatus()`

Comprehensive health status for all barangays:

```typescript
{
  barangay: string;
  vaccination_coverage: number;
  pending_interventions: number;
  health_status: "normal" | "warning" | "critical";
}
```

## Dashboard Sections

### Header

- Dashboard title and subtitle
- Refresh button with loading state
- Export data button
- Last update timestamp

### Filters

- **Year Selection**: Compare data across years
- **Barangay Selection**: Focus on specific areas or view all
- **Status Filter**: Critical, Warning, or All cases

### Key Metrics Grid

Quick overview showing:

- Total vaccinations administered (with trend)
- Maternal health visits tracked (with trend)
- Senior citizens receiving care (with trend)
- Pending health interventions (with trend)

### Detailed Metric Cards

- **Vaccination Metrics**: Completion rate, status breakdown
- **Pending Interventions**: Count, severity distribution
- **Maternal Health**: Visit count, wellness status
- **Senior Citizens**: Active programs, health checks

### Barangay Map Section

- Interactive grid showing all barangays
- Color-coded by vaccination coverage
- Status badges (Normal/Warning/Critical)
- Click to filter dashboard

### Underserved Areas Alert

- Highlights critical barangays
- Shows pending intervention counts
- Direct access to detailed data

### Visualizations

1. **Vaccination Coverage Bar Chart**: Coverage percentage by barangay
2. **Health Trends Line Chart**: 30-day trend of health status
3. **Health Status Pie Chart**: Distribution of normal/warning/critical cases
4. **Indicator Type Bar Chart**: Frequency of each health indicator
5. **Combined Health Chart**: Vaccination and coverage analysis

### Pending Interventions Table

- Recent 20 cases requiring action
- Prioritized by status (critical first)
- Resident information and contact
- Quick action buttons

## Usage Guide

### Accessing the Dashboard

```
Navigate to: /dashboard/health-workers
```

### Filtering Data

1. Select year from dropdown (current year default)
2. Select barangay (all barangays default)
3. Optionally filter by status
4. Dashboard updates automatically

### Interpreting Metrics

- **Green**: Normal, healthy metrics
- **Yellow**: Warning, needs attention
- **Red**: Critical, immediate action needed

### Vaccination Coverage Scale

- **0-40%**: Low coverage (Red)
- **40-60%**: Moderate coverage (Yellow)
- **60-80%**: Good coverage (Blue)
- **80-100%**: Excellent coverage (Green)

## Integration with Supabase

The dashboard uses several Supabase tables:

### Tables Used

- `health_indicators` - Core health metrics
- `vaccination_records` - Vaccination data
- `health_programs` - Program information
- `program_beneficiaries` - Program enrollment
- `residents` - Population data
- `users` - Staff information

### Real-time Updates

To enable real-time updates, add subscriptions:

```typescript
import { createClient } from "@/lib/db";

const supabase = createClient();

supabase
  .from("health_indicators")
  .on("*", (payload) => {
    console.log("Change received!", payload);
    // Trigger refetch
  })
  .subscribe();
```

## Performance Optimizations

1. **Parallel Data Fetching**: All queries run simultaneously using Promise.all()
2. **Client-side Caching**: Consider adding React Query or SWR
3. **Pagination**: Intervention table shows 20 items with load more
4. **Lazy Loading**: Charts only render when data is available
5. **Memoization**: Consider wrapping chart components with React.memo()

## Future Enhancements

1. **Real Geographic Maps**: Integrate Leaflet with barangay boundary GeoJSON
2. **Mobile Responsiveness**: Further optimize for mobile devices
3. **Export Functionality**: PDF/Excel export for reports
4. **Real-time Updates**: WebSocket subscriptions for live data
5. **Advanced Analytics**: Prediction models for disease outbreak
6. **Multi-language Support**: Tagalog/English localization
7. **Role-based Views**: Customized dashboards for different user roles
8. **Notification System**: Alert health workers of critical cases
9. **Offline Support**: Progressive Web App capabilities
10. **Advanced Filtering**: Save filter presets for quick access

## Troubleshooting

### Dashboard Shows No Data

1. Check Supabase connection
2. Verify user has correct barangay assigned
3. Ensure sample data exists in database
4. Check browser console for errors

### Slow Loading

1. Check network tab for slow queries
2. Consider reducing date range
3. Implement pagination for large datasets
4. Use database indexes on common filters

### Charts Not Displaying

1. Verify Recharts is installed
2. Check data format matches expected structure
3. Ensure chart height is specified
4. Check browser console for component errors

## API Reference

### All Query Functions

```typescript
// Vaccination queries
getVaccinationCoverageByBarangay(year: number)
getVaccinationRecords(residentId: string, status?: string)
getPendingVaccinations(barangay: string)

// Health metrics queries
getMaternalHealthStats(barangay?: string, year?: number)
getSeniorCitizenStats(barangay?: string, year?: number)
getPendingHealthInterventions(barangay?: string)

// Trend and analysis queries
getHealthTrendsOverTime(barangay?: string, daysBack?: number)
getUnderservedAreas()
getBarangayHealthStatus()

// Indicator queries
getIndicatorsByType()
getIndicatorsByStatus()
getIndicatorStats()
```

## Database Schema Notes

All queries join with the `residents` table to get barangay information. Ensure the foreign key relationships are properly set:

```sql
-- Example join used in queries
SELECT h.*, r.barangay, r.full_name
FROM health_indicators h
JOIN residents r ON h.resident_id = r.id
WHERE r.barangay = $1
```

## Security Considerations

1. **Row Level Security (RLS)**: Enable RLS on Supabase tables
2. **User Authentication**: Dashboard requires valid session
3. **Barangay Assignment**: Users can only see their assigned barangay (can be enhanced)
4. **Data Privacy**: Never expose sensitive resident data in charts

## Support & Maintenance

For issues or feature requests:

1. Check existing documentation
2. Review database schema for data availability
3. Test with sample data
4. Check Supabase query logs for errors
5. Review console for client-side errors

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Maintained by**: NagaCare Development Team
