"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, MapPin, Phone, Clock } from "lucide-react";

interface HealthFacility {
  id: string;
  name: string;
  barangay: string;
  latitude: number;
  longitude: number;
  contact_json?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  operating_hours?: {
    start: string;
    end: string;
  };
}

interface HealthFacilitiesMapProps {
  facilities: HealthFacility[];
  selectedFacility?: string;
  onSelectFacility?: (facilityId: string) => void;
}

/**
 * Simple HTML-based map component (Leaflet would need npm package)
 * For now, we'll create a card-based UI for health facilities
 */
export function HealthFacilitiesMap({
  facilities,
  selectedFacility,
  onSelectFacility,
}: HealthFacilitiesMapProps) {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!mapReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Health Facilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Facilities in Your Area</CardTitle>
        <CardDescription>
          {facilities.length} facility(ies) available
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {facilities.length === 0 ? (
            <div className="flex items-center gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-700">
              <AlertCircle className="h-4 w-4" />
              No health facilities found in your area
            </div>
          ) : (
            facilities.map((facility) => (
              <div
                key={facility.id}
                onClick={() => onSelectFacility?.(facility.id)}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                  selectedFacility === facility.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div className="space-y-2">
                  <h3 className="font-semibold">{facility.name}</h3>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{facility.barangay}</span>
                    </div>

                    {facility.contact_json?.address && (
                      <div className="ml-6">
                        {facility.contact_json.address}
                      </div>
                    )}

                    {facility.contact_json?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{facility.contact_json.phone}</span>
                      </div>
                    )}

                    {facility.operating_hours && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {facility.operating_hours.start} -{" "}
                          {facility.operating_hours.end}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <div className="inline-block rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                      Coordinates: {facility.latitude.toFixed(4)},{" "}
                      {facility.longitude.toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {facilities.length > 0 && (
          <div className="mt-4 rounded-md bg-blue-50 p-3 text-xs text-blue-700">
            💡 <strong>Tip:</strong> For interactive map features, install
            Leaflet.js in your project
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Connection Status Indicator for real-time updates
 */
interface ConnectionStatusProps {
  isOnline: boolean;
  isConnected: boolean;
}

export function ConnectionStatus({
  isOnline,
  isConnected,
}: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        className={`h-3 w-3 rounded-full ${
          isOnline && isConnected ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className="text-muted-foreground">
        {isOnline && isConnected
          ? "Connected"
          : isOnline
            ? "Reconnecting..."
            : "Offline"}
      </span>
    </div>
  );
}
