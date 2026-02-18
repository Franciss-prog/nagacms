# Barangay-Level GIS Map Feature Implementation Guide

## Overview

A comprehensive barangay-level GIS map visualization feature has been added to the Admin dashboard using Leaflet.js and react-leaflet. This feature displays vaccination coverage across barangays with interactive elements and detailed analytics.

## Features

✅ **GIS Visualization with Leaflet.js**

- Interactive OpenStreetMap-based map component
- GeoJSON boundaries for each barangay
- Real-time zoom and pan capabilities

✅ **Color-Coded Coverage Representation**

- **Red (0-40%)**: Critical - Immediate intervention needed
- **Orange (40-60%)**: Low - Accelerated vaccination needed
- **Blue (60-80%)**: Moderate - Ongoing monitoring required
- **Green (80-100%)**: Good - Maintain current efforts

✅ **Interactive Elements**

- **Hover Tooltips**: Display barangay name and vaccination coverage percentage
- **Hover Effects**: Subtle visual feedback with increased opacity
- **Click to Details**: Click any barangay to open side panel with full statistics

✅ **Statistics Side Panel**

- Slides in from right side when barangay is clicked
- **Health Score Meter**: Weighted calculation using vaccination coverage and interventions
- **Status Badge**: Visual health status (Good/Needs Attention/Critical)
- **Key Statistics**:
  - Population
  - Pending interventions
  - Maternal health visits
  - Senior citizens assisted
  - Last updated timestamp
- **Vaccination Breakdown**: Shows number of fully vaccinated vs. awaiting vaccination
- **Action Buttons**: View detailed reports or download statistics

✅ **Visual Legend**

- Color scale explanation card
- Coverage interpretation guide
- Map interaction instructions

✅ **Mock Data Support**

- Realistic mock GeoJSON for 10 sample barangays
- Mock vaccination data generation
- Seamless fallback when backend is unavailable

## Project Structure

```
components/dashboard/
├── barangay-gis-map.tsx                 # Main Leaflet map component
├── barangay-stats-panel.tsx             # Side panel with detailed statistics
├── barangay-vaccination-legend.tsx      # Legend and guide component
├── barangay-gis-map-integrated.tsx      # Integrated wrapper component
└── gis-map-index.ts                     # Barrel exports

lib/utils/
├── barangay-coverage-utils.ts           # Color and calculation utilities
└── mock-barangay-geojson.ts             # Mock GeoJSON and helper functions
```

## Component Architecture

### BarangayGisMap

Main map component using react-leaflet.

**Props:**

```typescript
interface BarangayGisMapProps {
  data: BarangayVaccinationData[];
  onBarangaySelect?: (barangay: string, data: BarangayVaccinationData) => void;
  title?: string;
  description?: string;
  height?: string;
  showLegend?: boolean;
}
```

**Usage:**

```tsx
<BarangayGisMap
  data={vaccinationData}
  onBarangaySelect={(barangay, data) => console.log(barangay, data)}
  height="h-[600px]"
  showLegend={true}
/>
```

### BarangayStatsPanel

Detailed statistics panel that slides in from the right.

**Props:**

```typescript
interface BarangayStatsPanelProps {
  data: BarangayStatsData | null;
  isOpen: boolean;
  onClose: () => void;
}
```

### BarangayVaccinationLegend

Standalone legend component explaining colors and interactions.

**Props:**

```typescript
interface BarangayVaccinationLegendProps {
  title?: string;
  description?: string;
  showDetail?: boolean;
}
```

### BarangayGisMapIntegrated

**Recommended** wrapper component combining all features with built-in state management.

**Props:**

```typescript
interface BarangayGisMapIntegratedProps {
  data?: BarangayVaccinationData[];
  useMockData?: boolean;
  title?: string;
  description?: string;
  mapHeight?: string;
  showLegend?: boolean;
  showMapLegend?: boolean;
}
```

**Usage:**

```tsx
// With mock data
<BarangayGisMapIntegrated useMockData={true} />

// With real data
<BarangayGisMapIntegrated
  data={realVaccinationData}
  useMockData={false}
/>
```

## Data Structures

### BarangayVaccinationData

```typescript
interface BarangayVaccinationData {
  barangay: string;
  vaccination_coverage: number; // 0-100
  pending_interventions: number;
  total_residents: number;
  maternal_health_visits?: number;
  senior_citizens_assisted?: number;
  last_updated?: string; // ISO date string
}
```

### BarangayStatsData

Extends `BarangayVaccinationData` with all properties required for the stats panel.

## Utility Functions

### barangay-coverage-utils.ts

```typescript
// Get color information based on coverage percentage
getCoverageColor(coverage: number): VaccinationCoverageColor

// Get opacity for hover effects
getCoverageOpacity(coverage: number): number

// Format percentage for display
formatPercentage(value: number): string

// Get health status based on multiple factors
getHealthStatus(coverage: number, pendingInterventions: number): 'good' | 'warning' | 'critical'

// Calculate weighted health score
calculateHealthScore(coverage: number, pendingInterventions: number, totalResidents: number): number
```

### mock-barangay-geojson.ts

```typescript
// GeoJSON data for 10 sample barangays
mockBarangayGeoJSON: BarangayGeoJSON

// Get center coordinates of a barangay
getBarangayCenter(barangay: BarangayGeoFeature): [number, number]

// Find barangay feature by name
findBarangayByName(name: string): BarangayGeoFeature | null
```

## Styling & Layout

The components use:

- **Tailwind CSS** for styling
- **Radix UI components** for UI elements
- **Lucide React** for icons
- **Leaflet CSS** for map styling
- **Custom CSS** for tooltips and map overlays

All components are responsive and work seamlessly with the existing layout:

- Map container is responsive and adapts to screen size
- Stats panel is fixed-position on desktop, full-width modal on mobile
- Legend component stacks properly on smaller screens

## Integration with Dashboard

The feature is integrated into `/app/dashboard/page.tsx`:

```tsx
<section>
  <h2 className="text-xl font-bold">Vaccination Coverage by Barangay</h2>
  <BarangayGisMapIntegrated
    useMockData={true}
    mapHeight="h-[600px]"
    showLegend={true}
  />
</section>
```

## Backend Integration Guide

### Fetching Real Vaccination Data

Create a server action or API route:

```typescript
// lib/queries/barangay-vaccination.ts
export async function getBarangayVaccinationData(): Promise<
  BarangayVaccinationData[]
> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("vaccination_coverage_by_barangay")
    .select("*")
    .order("barangay_name");

  if (error) {
    console.error("Failed to fetch vaccination data:", error);
    return []; // Falls back to mock data
  }

  return data.map((row) => ({
    barangay: row.barangay_name,
    vaccination_coverage: row.coverage_percentage,
    pending_interventions: row.pending_count,
    total_residents: row.population,
    maternal_health_visits: row.maternal_visits,
    senior_citizens_assisted: row.seniors_assisted,
    last_updated: row.updated_at,
  }));
}
```

### Using with Real Data

```tsx
"use client";

export default function DashboardPage() {
  const [data, setData] = useState<BarangayVaccinationData[]>([]);

  useEffect(() => {
    getBarangayVaccinationData().then(setData);
  }, []);

  return <BarangayGisMapIntegrated data={data} useMockData={false} />;
}
```

## Customizing GeoJSON Boundaries

To use real Municipal/Barangay boundaries:

1. **Option 1: Download from NAMRIA/PhilGIS**
   - Get official barangay GeoJSON files
   - Replace `mockBarangayGeoJSON` in `mock-barangay-geojson.ts`

2. **Option 2: From other sources**
   - OpenStreetMap Overpass API
   - Natural Earth Data
   - Local municipal GIS databases

3. **Implementation:**

   ```typescript
   // lib/utils/mock-barangay-geojson.ts
   import realBarangayGeoJSON from "@/public/data/barangay-boundaries.geojson";

   export const mockBarangayGeoJSON = realBarangayGeoJSON;
   ```

## Performance Considerations

- **Map rendering**: Leaflet handles up to 100+ polygons efficiently
- **GeoJSON optimization**: Current mock uses simple polygons; real data may need simplification
- **Data loading**: Implements suspense-friendly patterns for async data
- **Memory usage**: Components are lightweight and don't create memory leaks

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-responsive design
- Leaflet supports touch interactions for mobile devices

## Dependencies Added

```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.3"
}
```

Dev dependencies:

```json
{
  "@types/leaflet": "^1.9.8"
}
```

## Troubleshooting

### Map not loading

- Ensure Leaflet CSS is imported: `import 'leaflet/dist/leaflet.css'`
- Check browser console for errors
- Verify OpenStreetMap tiles are accessible

### Tooltips not appearing

- Check `barangay-tooltip` CSS class is defined
- Ensure mouse events are not blocked by overlays

### Stats panel sliding out slowly

- Adjust transition duration in `barangay-stats-panel.tsx`
- Check for CSS conflicts

### Mock data not generating

- Verify `generateMockData()` function in `barangay-gis-map-integrated.tsx`
- Check if `useMockData` prop is set to `true`

## Future Enhancements

1. **Real-time updates**: WebSocket integration for live coverage data
2. **Clustering**: Show aggregated coverage in zoomed-out views
3. **Time-series**: Animate coverage changes over time
4. **Comparison**: Compare barangays side-by-side
5. **Export**: Download maps as PNG/PDF
6. **Filters**: Filter by date range, health status, or coverage percentage
7. **Heatmap**: Alternative visualization using heatmap.js
8. **Multi-metric**: Display multiple health indicators simultaneously

## Support

For questions or issues:

1. Check components and utilities source code for inline documentation
2. Review mock data structure in `mock-barangay-geojson.ts`
3. Test with mock data first before integrating real data
4. Verify Leaflet/react-leaflet versions match

## License

As part of the NagaCMS project - maintained by health systems team.
