# Barangay GIS Map - Quick Implementation Guide

## Quick Start (5 minutes)

### Option 1: Simple Integration (Recommended)

```tsx
import { BarangayGisMapIntegrated } from "@/components/dashboard/barangay-gis-map-integrated";

export default function Page() {
  return (
    <div className="p-6">
      <BarangayGisMapIntegrated useMockData={true} />
    </div>
  );
}
```

That's it! All features included with mock data.

### Option 2: With Real Data

```tsx
"use client";

import { useEffect, useState } from "react";
import { BarangayGisMapIntegrated } from "@/components/dashboard/barangay-gis-map-integrated";
import type { BarangayVaccinationData } from "@/components/dashboard/barangay-gis-map";

export default function VaccinationDashboard() {
  const [data, setData] = useState<BarangayVaccinationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from your API
    fetch("/api/vaccination-by-barangay")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return <BarangayGisMapIntegrated data={data} useMockData={false} />;
}
```

### Option 3: Advanced Customization

```tsx
"use client";

import { useState } from "react";
import { BarangayGisMap } from "@/components/dashboard/barangay-gis-map";
import { BarangayStatsPanel } from "@/components/dashboard/barangay-stats-panel";
import { BarangayVaccinationLegend } from "@/components/dashboard/barangay-vaccination-legend";
import type {
  BarangayVaccinationData,
  BarangayStatsData,
} from "@/components/dashboard/barangay-gis-map";

export default function CustomMap() {
  const [selected, setSelected] = useState<BarangayStatsData | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const handleSelect = (barangay: string, data: BarangayVaccinationData) => {
    setSelected(data as BarangayStatsData);
    setPanelOpen(true);
  };

  return (
    <div className="space-y-6">
      <BarangayGisMap
        data={yourData}
        onBarangaySelect={handleSelect}
        title="Custom Title"
        height="h-[700px]"
      />

      <BarangayVaccinationLegend />

      <BarangayStatsPanel
        data={selected}
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
      />
    </div>
  );
}
```

## Common Tasks

### Display Map Only (No Legend/Panel)

```tsx
<BarangayGisMap
  data={data}
  useMockData={true}
  showLegend={false}
  onBarangaySelect={(name, data) => console.log(name, data)}
/>
```

### Change Map Height

```tsx
<BarangayGisMapIntegrated
  mapHeight="h-[800px]" // Default is h-[600px]
  useMockData={true}
/>
```

### Hide the Legend

```tsx
<BarangayGisMapIntegrated
  useMockData={true}
  showLegend={false}
  showMapLegend={false}
/>
```

### Handle Barangay Selection Elsewhere

```tsx
"use client";

import { useState } from "react";
import { BarangayGisMap } from "@/components/dashboard/barangay-gis-map";
import type { BarangayVaccinationData } from "@/components/dashboard/barangay-gis-map";

export default function IntegratedPage() {
  const [selectedData, setSelectedData] =
    useState<BarangayVaccinationData | null>(null);

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <BarangayGisMap
          data={mockData}
          onBarangaySelect={(name, data) => {
            setSelectedData(data);
            // Send to your custom analytics
            trackBarangayView(name);
          }}
        />
      </div>

      <div className="border-l">
        {selectedData && (
          <div>
            <h3>{selectedData.barangay}</h3>
            <p>Coverage: {selectedData.vaccination_coverage}%</p>
            {/* Your custom display */}
          </div>
        )}
      </div>
    </div>
  );
}
```

## Data Format Requirements

If you're providing your own data, ensure it matches this format:

```typescript
const data: BarangayVaccinationData[] = [
  {
    barangay: "San Juan", // Must match GeoJSON feature name
    vaccination_coverage: 85, // 0-100
    pending_interventions: 5, // Number only
    total_residents: 5000, // Number only
    maternal_health_visits: 42, // Optional
    senior_citizens_assisted: 128, // Optional
    last_updated: "2024-02-18T10:30:00Z", // Optional, ISO format
  },
  // ... more barangays
];
```

## Available Barangay Names (Mock Data)

When using mock GeoJSON, these barangay names must be matched:

- San Juan
- Santa Cruz
- Quiapo
- Binondo
- Intramuros
- Santa Ana
- Tondo
- Sampaloc
- Malate
- Ermita

To use different barangays, update the GeoJSON in `lib/utils/mock-barangay-geojson.ts`.

## Styling & Colors

### Vaccination Coverage Colors

```typescript
import { getCoverageColor } from "@/lib/utils/barangay-coverage-utils";

const color = getCoverageColor(85); // Returns color object
console.log(color.fill); // "#10B981" (green)
console.log(color.label); // "Good"
console.log(color.range); // "80-100%"
```

### Using Colors in Custom Components

```tsx
import { COVERAGE_COLORS } from "@/lib/utils/barangay-coverage-utils";

export function CustomLegend() {
  return (
    <div>
      {COVERAGE_COLORS.map((level) => (
        <div key={level.min}>
          <div style={{ backgroundColor: level.color.fill }}>
            {level.color.label}: {level.color.range}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Utility Functions Cheat Sheet

```typescript
import {
  getCoverageColor, // Get color object for coverage %
  getCoverageOpacity, // Get opacity value 0.6-0.9
  formatPercentage, // Format: "85%"
  getHealthStatus, // Returns: good | warning | critical
  calculateHealthScore, // Returns: 0-100 score
} from "@/lib/utils/barangay-coverage-utils";

// Examples
getCoverageColor(85); // { fill: "#10B981", ... }
getCoverageOpacity(85); // 0.9
formatPercentage(85.5); // "86%"
getHealthStatus(85, 2); // "good"
calculateHealthScore(85, 2, 5000); // ~88
```

## Common Errors & Solutions

### "Module not found: leaflet"

**Solution**: Run `npm install` again to ensure Leaflet is installed

```bash
npm install
```

### Map tiles not loading

**Solution**: Check internet connection, OpenStreetMap may be temporarily unavailable. It will retry automatically.

### Tooltips not showing

**Solution**: Ensure you're importing Leaflet CSS:

```tsx
import "leaflet/dist/leaflet.css";
```

### Stats panel not sliding

**Solution**: Check if CSS transitions are disabled globally, or verify z-index values aren't conflicting.

### Barangay not showing on map

**Solution**:

1. Check barangay name matches GeoJSON feature names exactly
2. Verify coordinates are valid (longitude: -180 to 180, latitude: -90 to 90)
3. Check browser console for GeoJSON parsing errors

## Performance Tips

1. **Lazy load the map**: Use dynamic imports for initial page load

   ```tsx
   const MapComponent = dynamic(
     () => import("@/components/dashboard/barangay-gis-map"),
     { loading: () => <div>Loading map...</div> },
   );
   ```

2. **Limit GeoJSON features**: More than 100 polygons may impact performance

3. **Cache data**: Don't refetch vaccination data on every render

   ```tsx
   const cachedData = useMemo(() => data, [data]);
   ```

4. **Debounce hover events**: High frequency updates should be debounced

## Accessibility

The component includes:

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard-accessible tooltips
- Color contrast compliant with WCAG AA

To improve accessibility further:

```tsx
<BarangayGisMap
  data={data}
  title="Barangay Vaccination Coverage (map visualization)"
  description="Interactive map showing vaccination coverage by barangay. Click barangay to view detailed statistics."
/>
```

## Testing

### Unit Test Example

```typescript
import {
  getCoverageColor,
  getHealthStatus,
} from "@/lib/utils/barangay-coverage-utils";

describe("barangay-coverage-utils", () => {
  it("returns correct color for coverage levels", () => {
    expect(getCoverageColor(85).label).toBe("Good");
    expect(getCoverageColor(50).label).toBe("Low");
  });

  it("calculates health status correctly", () => {
    expect(getHealthStatus(85, 2)).toBe("good");
    expect(getHealthStatus(30, 15)).toBe("critical");
  });
});
```

### Integration Test Example

```typescript
import { render, screen } from '@testing-library/react';
import { BarangayGisMapIntegrated } from '@/components/dashboard/barangay-gis-map-integrated';

it('renders map with mock data', () => {
  render(<BarangayGisMapIntegrated useMockData={true} />);
  expect(screen.getByText(/Vaccination Coverage/i)).toBeInTheDocument();
});
```

## Next Steps

1. ✅ **Add to your page**: Use one of the quick start examples above
2. ⚙️ **Connect real data**: Replace mock data with your API/database
3. 📊 **Customize styling**: Adjust colors and layout in utility files
4. 🗺️ **Update GeoJSON**: Replace mock boundaries with real ones
5. 📈 **Monitor performance**: Use browser DevTools to optimize

## Support & Resources

- **Leaflet Documentation**: https://leafletjs.com/reference.html
- **React-Leaflet Docs**: https://react-leaflet.js.org/
- **Tailwind CSS**: https://tailwindcss.com/
- **GeoJSON Spec**: https://tools.ietf.org/html/rfc7946

---

**Last Updated**: February 18, 2024  
**Version**: 1.0.0
