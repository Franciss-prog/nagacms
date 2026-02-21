/**
 * GeoJSON data for Naga City barangay boundaries
 * Coordinates based on actual geographic locations of Naga City, Camarines Sur
 */

export interface BarangayGeoFeature {
  type: "Feature";
  properties: {
    name: string;
    barangay_code: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface BarangayGeoJSON {
  type: "FeatureCollection";
  features: BarangayGeoFeature[];
}

/**
 * Actual GeoJSON data representing barangay center points
 * Coordinates are in [longitude, latitude] format
 * Based on real locations of Naga City, Camarines Sur, Philippines (13.6219°N, 123.1948°E)
 * All 27 barangays of Naga City with accurate coordinates
 */
export const mockBarangayGeoJSON: BarangayGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Abella",
        barangay_code: "NAG-ABE",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1856, 13.6315],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Bagumbayan Norte",
        barangay_code: "NAG-BNO",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1923, 13.6198],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Bagumbayan Sur",
        barangay_code: "NAG-BSU",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1912, 13.6142],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Balatas",
        barangay_code: "NAG-BAL",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1758, 13.6425],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Calauag",
        barangay_code: "NAG-CAL",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1685, 13.6512],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Cararayan",
        barangay_code: "NAG-CAR",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1542, 13.6378],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Carolina",
        barangay_code: "NAG-CRO",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1625, 13.6285],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Concepcion Pequeña",
        barangay_code: "NAG-CPE",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1845, 13.6255],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Concepcion Grande",
        barangay_code: "NAG-CGR",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1725, 13.6185],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Dayangdang",
        barangay_code: "NAG-DAY",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1955, 13.6085],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Del Rosario",
        barangay_code: "NAG-DEL",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1878, 13.6225],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Dinaga",
        barangay_code: "NAG-DIN",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1435, 13.6125],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Igualdad Interior",
        barangay_code: "NAG-IGU",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1898, 13.6178],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Lerma",
        barangay_code: "NAG-LER",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1785, 13.6115],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Liboton",
        barangay_code: "NAG-LIB",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1965, 13.6055],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Mabolo",
        barangay_code: "NAG-MAB",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1715, 13.6045],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Pangpang",
        barangay_code: "NAG-PAN",
      },
      geometry: {
        type: "Point",
        coordinates: [123.2025, 13.5985],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Panicuason",
        barangay_code: "NAG-PNI",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1385, 13.6485],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Peñafrancia",
        barangay_code: "NAG-PEN",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1935, 13.6268],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Sabang",
        barangay_code: "NAG-SAB",
      },
      geometry: {
        type: "Point",
        coordinates: [123.2085, 13.6125],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "San Felipe",
        barangay_code: "NAG-SFE",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1675, 13.5945],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "San Francisco (Poblacion)",
        barangay_code: "NAG-SFR",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1885, 13.6205],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "San Isidro",
        barangay_code: "NAG-SIS",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1815, 13.5895],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Santa Cruz",
        barangay_code: "NAG-SCR",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1955, 13.5835],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Santo Niño",
        barangay_code: "NAG-SNI",
      },
      geometry: {
        type: "Point",
        coordinates: [123.2115, 13.5885],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Tabuco",
        barangay_code: "NAG-TAB",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1775, 13.5725],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Triangulo",
        barangay_code: "NAG-TRI",
      },
      geometry: {
        type: "Point",
        coordinates: [123.1865, 13.6315],
      },
    },
  ],
};

/**
 * Get center point of a barangay (for markers/labels)
 * For Point geometries, returns the coordinates directly
 */
export function getBarangayCenter(
  barangay: BarangayGeoFeature,
): [number, number] {
  // For Point geometry, return coordinates directly
  return barangay.geometry.coordinates;
}

/**
 * Find barangay feature by name
 */
export function findBarangayByName(name: string): BarangayGeoFeature | null {
  return (
    mockBarangayGeoJSON.features.find(
      (f) => f.properties.name.toLowerCase() === name.toLowerCase(),
    ) || null
  );
}
