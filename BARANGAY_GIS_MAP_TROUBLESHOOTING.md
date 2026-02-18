# Barangay GIS Map - Troubleshooting & FAQ

## Common Issues & Solutions

### 🗺️ Map Rendering Issues

#### Issue: Map is not displaying, showing blank area

**Symptoms**: Component loads but map is grey/blank

**Solutions**:

1. Verify Leaflet CSS is imported

   ```tsx
   import "leaflet/dist/leaflet.css";
   ```

2. Check that component is client-only

   ```tsx
   "use client";
   ```

3. Verify height is set properly

   ```tsx
   <BarangayGisMap height="h-[600px]" />
   ```

4. Check browser console for errors
   - Right-click → Inspect → Console
   - Look for "Leaflet is not defined" or similar

#### Issue: Map tiles (OpenStreetMap) not loading

**Symptoms**: Map shows grey tiles, "Tile cannot be loaded" errors

**Solutions**:

1. Check internet connection
2. OpenStreetMap may be temporarily down - wait a few minutes
3. Try zooming out/in to refresh tiles
4. Check if firewall blocks CDN access
5. Clear browser cache (Cmd/Ctrl + Shift + Del)

#### Issue: Map markers/tooltip icons broken

**Symptoms**: Red X icons on map for markers

**Solutions**:

1. The component handles default Leaflet icons automatically
2. If custom icons needed, verify icon URLs in `barangay-gis-map.tsx` around line 40

---

### 🎨 Styling & Layout Issues

#### Issue: Map overlaps other content or is hidden

**Symptoms**: Map renders behind other elements

**Solutions**:

1. Check z-index values in CSS
   - Map should have `z-index: 0` or higher
   - Overlays should have `z-index: 40`
2. Ensure Card component has overflow visible

   ```tsx
   <Card className="overflow-hidden">
   ```

3. Check parent div height
   ```tsx
   <div style={{ height: "600px" }}>
     <BarangayGisMap />
   </div>
   ```

#### Issue: Colors not matching expected vaccination coverage

**Symptoms**: Barangay colored differently than expected

**Solutions**:

1. Check `getCoverageColor()` function in `barangay-coverage-utils.ts`
2. Verify data is being passed correctly
   ```tsx
   console.log(data); // Check if vaccination_coverage is 0-100
   ```
3. Test color function directly
   ```tsx
   const color = getCoverageColor(85);
   console.log(color); // Should show green
   ```

#### Issue: Hover tooltips not showing

**Symptoms**: Can't see barangay info on hover

**Solutions**:

1. Verify CSS for `.barangay-tooltip` exists (it's in the component)
2. Check if tooltips are hidden behind other elements
3. Try hovering for longer (tolerance is 300ms)
4. Clear browser cache and reload

---

### 📱 Interactive Features Issues

#### Issue: Click on barangay not opening stats panel

**Symptoms**: Click does nothing, panel doesn't slide in

**Solutions**:

1. Check if `onBarangaySelect` callback is defined
2. Verify `BarangayGisMapIntegrated` is used (includes state management)
3. Check browser console for JavaScript errors
4. Try simple test first:
   ```tsx
   <BarangayGisMap
     data={data}
     onBarangaySelect={(name, data) => console.log(name)}
   />
   ```

#### Issue: Stats panel not sliding smoothly

**Symptoms**: Panel appears instantly or jerky animation

**Solutions**:

1. Check CSS transitions aren't disabled globally

   ```css
   /* Don't have this */
   * {
     transition: none !important;
   }
   ```

2. Adjust transition duration in `barangay-stats-panel.tsx` line ~140

   ```tsx
   duration - 300; // Currently 300ms, can change to 500
   ```

3. Check if GPU acceleration is enabled (DevTools → Performance)

#### Issue: Stats panel doesn't close

**Symptoms**: Can't dismiss the panel

**Solutions**:

1. Check if `onClose` callback is defined
2. Try clicking the X button in top-right of panel
3. Try clicking overlay (outside the panel)
4. Verify `isOpen` state is updating
   ```tsx
   console.log("Panel open:", isPanelOpen);
   ```

---

### 📊 Data Issues

#### Issue: No data appears on map

**Symptoms**: Map loads but barangays aren't colored/have no data

**Solutions**:

1. Check if data is being passed

   ```tsx
   <BarangayGisMapIntegrated data={data} useMockData={false} />;
   // Add logging
   console.log("Data:", data);
   ```

2. Verify data format matches required structure

   ```tsx
   // Required format
   {
     barangay: string,
     vaccination_coverage: number,  // 0-100
     pending_interventions: number,
     total_residents: number
   }
   ```

3. If using mock data, ensure `useMockData={true}`

#### Issue: Mock data not generating

**Symptoms**: Empty map even with `useMockData={true}`

**Solutions**:

1. Check if `generateMockData()` function is defined
2. Verify barangay names match GeoJSON (case-sensitive)
   - Valid names: San Juan, Santa Cruz, Quiapo, etc.
3. Clear browser cache and reload

#### Issue: Vaccination coverage shows NaN or incorrect %

**Symptoms**: Stats show "NaN%" or wrong percentage

**Solutions**:

1. Check data types - vaccination_coverage should be number (0-100)
2. Verify no null/undefined values

   ```tsx
   data.forEach((d) => {
     console.assert(
       typeof d.vaccination_coverage === "number",
       "Invalid coverage",
     );
   });
   ```

3. Check for division by zero in calculations
   ```tsx
   // In barangay-coverage-utils.ts
   // Should have NULLIF to prevent this
   ```

---

### 🔄 Database & Backend Issues

#### Issue: Real data not loading

**Symptoms**: Using `useMockData={false}` but no data appears

**Solutions**:

1. Check if data fetching function is called

   ```tsx
   const data = await getBarangayVaccinationData();
   console.log("Fetched data:", data);
   ```

2. Verify database table exists

   ```sql
   SELECT * FROM barangay_vaccination_summary LIMIT 1;
   ```

3. Check database credentials in environment
4. Verify user has SELECT permission on the table
5. Check Supabase console for errors

#### Issue: "No matching version found for react-leaflet"

**Symptoms**: npm install fails

**Solutions**:

1. Use `npm install --legacy-peer-deps`

   ```bash
   npm install --legacy-peer-deps
   ```

2. Downgrade react-leaflet version in package.json

   ```json
   "react-leaflet": "^4.2.1"
   ```

3. Check npm registry is accessible
   ```bash
   npm config get registry
   ```

---

### ⚡ Performance Issues

#### Issue: Map is slow, zooming/panning lags

**Symptoms**: Sluggish interactions, 60+ FPS drops

**Solutions**:

1. Reduce GeoJSON complexity
   - Simplify polygon coordinates
   - Use TopoJSON instead of GeoJSON for large datasets

2. Enable hardware acceleration
   - Chrome DevTools → Settings → Rendering → check "Paint flashing"

3. Reduce number of barangays initially
   - Implement virtualization for 100+ features

4. Profile performance
   ```tsx
   console.time("map-render");
   // ... render code ...
   console.timeEnd("map-render");
   ```

#### Issue: Memory leaks, app crashes with many interactions

**Symptoms**: App becomes unresponsive over time

**Solutions**:

1. Check for cleanup in useEffect

   ```tsx
   useEffect(() => {
     return () => {
       map.removeLayer(geoJson);
     };
   }, []);
   ```

2. Use React DevTools Profiler
   - Record interactions
   - Look for unnecessary re-renders

3. Check component unmounting properly
   - No lingering event listeners

---

### 🌐 Browser Compatibility

#### Issue: Map works in Chrome but not Firefox/Safari

**Symptoms**: Different behavior in different browsers

**Solutions**:

1. Check browser console in that specific browser
2. Verify Leaflet version supports the browser
3. Check for prefixed CSS properties

   ```css
   /* Use vendor prefixes */
   -webkit-transform: scale(1.1);
   -moz-transform: scale(1.1);
   ```

4. Test with browserstack.com if needed

#### Issue: Mobile map doesn't pan/zoom properly

**Symptoms**: Touch interactions don't work well on mobile

**Solutions**:

1. Ensure Leaflet touch plugins are enabled
2. Verify viewport meta tag is set

   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```

3. Check if touch events are being prevented
   ```tsx
   // Don't have this
   e.preventDefault();
   ```

---

## FAQ - Frequently Asked Questions

### Q: Can I use real GeoJSON boundaries?

**A**: Yes! Replace `mockBarangayGeoJSON` in `lib/utils/mock-barangay-geojson.ts`:

```tsx
import realData from "@/public/barangay-boundaries.geojson.json";
export const mockBarangayGeoJSON = realData;
```

### Q: How do I customize the colors?

**A**: Edit `COVERAGE_COLORS` in `barangay-coverage-utils.ts`:

```tsx
export const COVERAGE_COLORS: CoverageLevel[] = [
  {
    min: 0,
    max: 40,
    color: {
      fill: "#EF4444", // Change hex color here
      // ...
    },
  },
  // ...
];
```

### Q: How do I show different metrics besides vaccination?

**A**: Create a new property in `BarangayVaccinationData` and new color scheme:

```tsx
export interface BarangayHealthMetrics {
  barangay: string;
  maternal_health_coverage: number; // New metric
  // ...
}
```

### Q: Can I add more barangays?

**A**: Yes! Add GeoJSON features to `mockBarangayGeoJSON`:

```tsx
{
  type: "Feature",
  properties: { name: "My Barangay", barangay_code: "MB001" },
  geometry: { type: "Polygon", coordinates: [...] }
}
```

### Q: How do I handle real-time updates?

**A**: Add WebSocket listener:

```tsx
useEffect(() => {
  const ws = new WebSocket("wss://...");
  ws.onmessage = (event) => {
    const newData = JSON.parse(event.data);
    setData(newData);
  };
  return () => ws.close();
}, []);
```

### Q: Is the stats panel mobile-responsive?

**A**: Yes! It uses `w-full sm:w-96` classes to adapt to screen size.

### Q: Can I embed this in another page?

**A**: Yes! Just import and use:

```tsx
import BarangayGisMapIntegrated from "@/components/dashboard/barangay-gis-map-integrated";

// Use in any page
<BarangayGisMapIntegrated useMockData={true} />;
```

### Q: How do I filter by health status?

**A**: Use `getBarangayVaccinationWithFilters`:

```tsx
const criticalBarangays = await getBarangayVaccinationWithFilters({
  healthStatus: "critical",
});
```

### Q: What's the maximum number of barangays supported?

**A**: Leaflet handles 100+ polygons efficiently. Beyond that, consider:

- Clustering
- Simplifying GeoJSON
- Heatmap visualization

### Q: How do I export the map?

**A**: Add action button handler:

```tsx
const handleExport = async () => {
  const element = document.querySelector(".leaflet-container");
  const canvas = await html2canvas(element);
  const link = document.createElement("a");
  link.href = canvas.toDataURL();
  link.download = "barangay-map.png";
  link.click();
};
```

---

## Getting Help

### Debugging Steps

1. **Check browser console** (F12)
   - Look for red errors
   - Check network tab for failed requests

2. **Add logging**

   ```tsx
   console.log("Component mounted");
   console.log("Data received:", data);
   console.log("Selected barangay:", selectedBarangay);
   ```

3. **Test in isolation**

   ```tsx
   // Simple test component
   export default function Test() {
     return <BarangayGisMapIntegrated useMockData={true} />;
   }
   ```

4. **Check React DevTools**
   - Install React DevTools browser extension
   - Inspect component props/state

### Resources

- **Leaflet Docs**: https://leafletjs.com/
- **React-Leaflet**: https://react-leaflet.js.org/
- **MDN Web Docs**: https://developer.mozilla.org/

### Still Having Issues?

1. Check existing issues in project
2. Review inline code comments
3. Post detailed error message with:
   - Browser version
   - Error from console
   - Steps to reproduce
   - Expected vs actual behavior

---

## Performance Monitoring

### Monitor in DevTools

```tsx
// In your component
useEffect(() => {
  console.time("map-setup");
  // component setup...
  console.timeEnd("map-setup");
}, []);
```

### Check Bundle Size

```bash
npm run build
# Check size of: .next/static/
```

### Use Lighthouse

1. Chrome DevTools → Lighthouse
2. Audit Performance
3. Look for opportunities

---

**Last Updated**: February 18, 2024  
**Version**: 1.0.0

Still stuck? Check the component source code - it has detailed inline comments! 🎯
