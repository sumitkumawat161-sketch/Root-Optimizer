import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { VehiclePosition } from "../../hooks/useLiveTracking";
import { Vehicle } from "../../types";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

interface LiveTrackingMapProps {
  vehicles: Vehicle[];
  positions: VehiclePosition[];
}

export default function LiveTrackingMap({ vehicles, positions }: LiveTrackingMapProps) {
  const center: [number, number] = [28.6139, 77.209];

  function findPlate(vehicleId: string) {
    return vehicles.find((v) => v.id === vehicleId)?.plateNumber || vehicleId;
  }

  const staticVehicles = vehicles.filter(
    (v) => v.latitude !== null && v.longitude !== null
  );

  return (
    <MapContainer center={center} zoom={11} className="h-full w-full">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {staticVehicles.map((vehicle) => (
        <Marker key={vehicle.id} position={[vehicle.latitude as number, vehicle.longitude as number]}>
          <Popup>
            {vehicle.plateNumber} ({vehicle.status})
          </Popup>
        </Marker>
      ))}
      {positions.map((pos) => (
        <Marker key={pos.vehicleId} position={[pos.latitude, pos.longitude]}>
          <Popup>{findPlate(pos.vehicleId)} - live</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
