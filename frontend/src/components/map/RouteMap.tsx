import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { Stop } from "../../types";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

interface RouteMapProps {
  stops: Stop[];
  depot?: { latitude: number; longitude: number };
  /** [lng, lat] road path from OSRM. When absent, falls back to a straight line through the stops. */
  geometry?: [number, number][] | null;
}

export default function RouteMap({ stops, depot, geometry }: RouteMapProps) {
  const center: [number, number] = depot
    ? [depot.latitude, depot.longitude]
    : stops.length > 0
    ? [stops[0].latitude, stops[0].longitude]
    : [28.6139, 77.209];

  const roadPositions: [number, number][] | null =
    geometry && geometry.length > 1 ? geometry.map(([lng, lat]) => [lat, lng]) : null;

  const straightLineFallback: [number, number][] = [
    ...(depot ? [[depot.latitude, depot.longitude] as [number, number]] : []),
    ...stops.map((s) => [s.latitude, s.longitude] as [number, number])
  ];

  const linePositions = roadPositions ?? straightLineFallback;

  return (
    <MapContainer center={center} zoom={12} className="h-full w-full">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {depot && (
        <Marker position={[depot.latitude, depot.longitude]}>
          <Popup>Depot</Popup>
        </Marker>
      )}
      {stops.map((stop) => (
        <Marker key={stop.id} position={[stop.latitude, stop.longitude]}>
          <Popup>
            <div className="text-sm">
              <p className="mb-1 font-semibold text-slate-800">{stop.label}</p>
              <p className="text-slate-600">Stop #{stop.sequence}</p>
              <p className="text-slate-600">Demand: {stop.demandKg}kg</p>
              <p className="text-slate-600">Priority: {stop.priority}</p>
              <p className={stop.visited ? "font-medium text-emerald-600" : "font-medium text-slate-400"}>
                {stop.visited ? "Visited" : "Pending"}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
      {linePositions.length > 1 && (
        <Polyline
          positions={linePositions}
          pathOptions={{
            color: "#3b66f5",
            weight: 4,
            opacity: 0.85,
            dashArray: roadPositions ? undefined : "6 6"
          }}
        />
      )}
    </MapContainer>
  );
}
