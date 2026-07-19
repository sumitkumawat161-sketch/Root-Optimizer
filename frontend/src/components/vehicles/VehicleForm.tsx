import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { FiHash, FiTruck, FiPackage, FiZap, FiBox, FiActivity } from "react-icons/fi";
import { Vehicle } from "../../types";
import { VehiclePayload } from "../../api/vehicleApi";
import Button from "../common/Button";
import { TextField, SelectField } from "../common/FormField";

interface VehicleFormProps {
  initialValues?: Vehicle | null;
  onSubmit: (values: VehiclePayload) => Promise<void>;
  onCancel: () => void;
}

export default function VehicleForm({ initialValues, onSubmit, onCancel }: VehicleFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<VehiclePayload>();

  useEffect(() => {
    if (initialValues) {
      reset({
        plateNumber: initialValues.plateNumber,
        type: initialValues.type,
        capacityKg: initialValues.capacityKg,
        fuelEfficiency: initialValues.fuelEfficiency,
        maxWeight: initialValues.maxWeight ?? undefined,
        maxVolume: initialValues.maxVolume ?? undefined,
        currentLoad: initialValues.currentLoad,
        status: initialValues.status
      });
    } else {
      reset({
        plateNumber: "",
        type: "",
        capacityKg: 0,
        fuelEfficiency: 0,
        maxWeight: undefined,
        maxVolume: undefined,
        currentLoad: 0,
        status: "AVAILABLE"
      });
    }
  }, [initialValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          ...values,
          capacityKg: Number(values.capacityKg),
          fuelEfficiency: Number(values.fuelEfficiency),
          maxWeight: values.maxWeight !== undefined && values.maxWeight !== null ? Number(values.maxWeight) : undefined,
          maxVolume: values.maxVolume !== undefined && values.maxVolume !== null ? Number(values.maxVolume) : undefined,
          currentLoad: values.currentLoad !== undefined && values.currentLoad !== null ? Number(values.currentLoad) : undefined
        });
      })}
      className="space-y-4"
    >
      <TextField
        label="Plate Number"
        placeholder="e.g. DL 01 AB 1234"
        icon={<FiHash className="h-4 w-4" />}
        error={errors.plateNumber?.message}
        {...register("plateNumber", { required: "Plate number is required" })}
      />

      <TextField
        label="Vehicle Type"
        placeholder="e.g. Delivery Van"
        icon={<FiTruck className="h-4 w-4" />}
        error={errors.type?.message}
        {...register("type", { required: "Type is required" })}
      />

      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Capacity (kg)"
          type="number"
          step="0.1"
          icon={<FiPackage className="h-4 w-4" />}
          {...register("capacityKg", { required: true, valueAsNumber: true })}
        />
        <TextField
          label="Efficiency (km/L)"
          type="number"
          step="0.1"
          icon={<FiZap className="h-4 w-4" />}
          {...register("fuelEfficiency", { required: true, valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Max Weight (kg)"
          type="number"
          step="0.1"
          hint="Defaults to Capacity if left blank"
          icon={<FiPackage className="h-4 w-4" />}
          {...register("maxWeight", { valueAsNumber: true })}
        />
        <TextField
          label="Max Volume (m³)"
          type="number"
          step="0.1"
          icon={<FiBox className="h-4 w-4" />}
          {...register("maxVolume", { valueAsNumber: true })}
        />
      </div>

      <TextField
        label="Current Load (kg)"
        type="number"
        step="0.1"
        hint="Weight already committed to active routes"
        icon={<FiActivity className="h-4 w-4" />}
        {...register("currentLoad", { valueAsNumber: true })}
      />

      <SelectField label="Status" {...register("status")}>
        <option value="AVAILABLE">Available</option>
        <option value="ON_ROUTE">On Route</option>
        <option value="MAINTENANCE">Maintenance</option>
      </SelectField>

      <div className="flex gap-2 pt-2">
        <Button type="submit" loading={isSubmitting} fullWidth>
          {initialValues ? "Update Vehicle" : "Add Vehicle"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
