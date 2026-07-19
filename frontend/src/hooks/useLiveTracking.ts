import { useEffect, useState } from "react";
import { useSocketContext } from "../context/SocketContext";

export interface VehiclePosition {
  vehicleId: string;
  latitude: number;
  longitude: number;
}

export function useLiveTracking() {
  const socket = useSocketContext();
  const [positions, setPositions] = useState<Record<string, VehiclePosition>>({});

  useEffect(() => {
    if (!socket) return;

    function handleUpdate(payload: VehiclePosition) {
      setPositions((prev) => ({ ...prev, [payload.vehicleId]: payload }));
    }

    socket.on("vehicle:location-broadcast", handleUpdate);

    return () => {
      socket.off("vehicle:location-broadcast", handleUpdate);
    };
  }, [socket]);

  function sendLocationUpdate(payload: VehiclePosition) {
    socket?.emit("vehicle:location-update", payload);
  }

  return { positions: Object.values(positions), sendLocationUpdate };
}
