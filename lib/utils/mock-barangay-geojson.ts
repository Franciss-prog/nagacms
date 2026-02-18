/**
 * Mock GeoJSON data for barangay boundaries
 * This contains realistic barangay coordinates for demonstration
 */

export interface BarangayGeoFeature {
  type: "Feature";
  properties: {
    name: string;
    barangay_code: string;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

export interface BarangayGeoJSON {
  type: "FeatureCollection";
  features: BarangayGeoFeature[];
}

/**
 * Mock GeoJSON data representing barangay boundaries
 * Coordinates are in [longitude, latitude] format
 * Centered on Naga City, Bicol (13.6218°N, 123.1948°E)
 * All 27 barangays of Naga City
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
        type: "Polygon",
        coordinates: [
          [
            [123.155, 13.65],
            [123.165, 13.65],
            [123.165, 13.64],
            [123.155, 13.64],
            [123.155, 13.65],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Bagumbayan Norte",
        barangay_code: "NAG-BNO",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.17, 13.65],
            [123.18, 13.65],
            [123.18, 13.64],
            [123.17, 13.64],
            [123.17, 13.65],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Bagumbayan Sur",
        barangay_code: "NAG-BSU",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.185, 13.65],
            [123.195, 13.65],
            [123.195, 13.64],
            [123.185, 13.64],
            [123.185, 13.65],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Balatas",
        barangay_code: "NAG-BAL",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.2, 13.65],
            [123.21, 13.65],
            [123.21, 13.64],
            [123.2, 13.64],
            [123.2, 13.65],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Calauag",
        barangay_code: "NAG-CAL",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.215, 13.65],
            [123.225, 13.65],
            [123.225, 13.64],
            [123.215, 13.64],
            [123.215, 13.65],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Cararayan",
        barangay_code: "NAG-CAR",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.155, 13.635],
            [123.165, 13.635],
            [123.165, 13.625],
            [123.155, 13.625],
            [123.155, 13.635],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Carolina",
        barangay_code: "NAG-CRO",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.17, 13.635],
            [123.18, 13.635],
            [123.18, 13.625],
            [123.17, 13.625],
            [123.17, 13.635],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Concepcion Pequeña",
        barangay_code: "NAG-CPE",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.185, 13.635],
            [123.195, 13.635],
            [123.195, 13.625],
            [123.185, 13.625],
            [123.185, 13.635],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Concepcion Grande",
        barangay_code: "NAG-CGR",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.2, 13.635],
            [123.21, 13.635],
            [123.21, 13.625],
            [123.2, 13.625],
            [123.2, 13.635],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Dayangdang",
        barangay_code: "NAG-DAY",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.215, 13.635],
            [123.225, 13.635],
            [123.225, 13.625],
            [123.215, 13.625],
            [123.215, 13.635],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Del Rosario",
        barangay_code: "NAG-DEL",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.155, 13.62],
            [123.165, 13.62],
            [123.165, 13.61],
            [123.155, 13.61],
            [123.155, 13.62],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Dinaga",
        barangay_code: "NAG-DIN",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.17, 13.62],
            [123.18, 13.62],
            [123.18, 13.61],
            [123.17, 13.61],
            [123.17, 13.62],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Igualdad Interior",
        barangay_code: "NAG-IGU",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.185, 13.62],
            [123.195, 13.62],
            [123.195, 13.61],
            [123.185, 13.61],
            [123.185, 13.62],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Lerma",
        barangay_code: "NAG-LER",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.2, 13.62],
            [123.21, 13.62],
            [123.21, 13.61],
            [123.2, 13.61],
            [123.2, 13.62],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Liboton",
        barangay_code: "NAG-LIB",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.215, 13.62],
            [123.225, 13.62],
            [123.225, 13.61],
            [123.215, 13.61],
            [123.215, 13.62],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Mabolo",
        barangay_code: "NAG-MAB",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.155, 13.605],
            [123.165, 13.605],
            [123.165, 13.595],
            [123.155, 13.595],
            [123.155, 13.605],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Pangpang",
        barangay_code: "NAG-PAN",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.17, 13.605],
            [123.18, 13.605],
            [123.18, 13.595],
            [123.17, 13.595],
            [123.17, 13.605],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Panicuason",
        barangay_code: "NAG-PNI",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.185, 13.605],
            [123.195, 13.605],
            [123.195, 13.595],
            [123.185, 13.595],
            [123.185, 13.605],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Peñafrancia",
        barangay_code: "NAG-PEN",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.2, 13.605],
            [123.21, 13.605],
            [123.21, 13.595],
            [123.2, 13.595],
            [123.2, 13.605],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Sabang",
        barangay_code: "NAG-SAB",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.215, 13.605],
            [123.225, 13.605],
            [123.225, 13.595],
            [123.215, 13.595],
            [123.215, 13.605],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "San Felipe",
        barangay_code: "NAG-SFE",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.155, 13.59],
            [123.165, 13.59],
            [123.165, 13.58],
            [123.155, 13.58],
            [123.155, 13.59],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "San Francisco (Poblacion)",
        barangay_code: "NAG-SFR",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.17, 13.59],
            [123.18, 13.59],
            [123.18, 13.58],
            [123.17, 13.58],
            [123.17, 13.59],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "San Isidro",
        barangay_code: "NAG-SIS",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.185, 13.59],
            [123.195, 13.59],
            [123.195, 13.58],
            [123.185, 13.58],
            [123.185, 13.59],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Santa Cruz",
        barangay_code: "NAG-SCR",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.2, 13.59],
            [123.21, 13.59],
            [123.21, 13.58],
            [123.2, 13.58],
            [123.2, 13.59],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Santo Niño",
        barangay_code: "NAG-SNI",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.215, 13.59],
            [123.225, 13.59],
            [123.225, 13.58],
            [123.215, 13.58],
            [123.215, 13.59],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Tabuco",
        barangay_code: "NAG-TAB",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.175, 13.575],
            [123.185, 13.575],
            [123.185, 13.565],
            [123.175, 13.565],
            [123.175, 13.575],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Triangulo",
        barangay_code: "NAG-TRI",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.195, 13.575],
            [123.205, 13.575],
            [123.205, 13.565],
            [123.195, 13.565],
            [123.195, 13.575],
          ],
        ],
      },
    },
  ],
};

/**
 * Get center point of a barangay (for markers/labels)
 */
export function getBarangayCenter(
  barangay: BarangayGeoFeature,
): [number, number] {
  const coords =
    barangay.geometry.type === "Polygon"
      ? (barangay.geometry.coordinates[0] as number[][])
      : (barangay.geometry.coordinates[0][0] as number[][]);

  const lats = coords.map((c) => c[1]);
  const lons = coords.map((c) => c[0]);

  const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const avgLon = lons.reduce((a, b) => a + b, 0) / lons.length;

  return [avgLon, avgLat];
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
