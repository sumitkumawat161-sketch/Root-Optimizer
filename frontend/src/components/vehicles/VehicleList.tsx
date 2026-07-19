import { FiTruck } from "react-icons/fi";
import { Vehicle } from "../../types";
import VehicleCard from "./VehicleCard";
import EmptyState from "../common/EmptyState";
import Button from "../common/Button";

interface VehicleListProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onAddNew?: () => void;
}

export default function VehicleList({ vehicles, onEdit, onDelete, onAddNew }: VehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <EmptyState
        icon={<FiTruck />}
        title="No vehicles yet"
        description="Add your first vehicle to start planning optimized routes."
        action={onAddNew && <Button onClick={onAddNew}>Add Vehicle</Button>}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
