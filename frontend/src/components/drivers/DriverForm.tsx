import { useForm } from "react-hook-form";
import { useState } from "react";
import { FiMail, FiPhone, FiCreditCard } from "react-icons/fi";
import { DriverPayload } from "../../api/driverApi";
import { Vehicle } from "../../types";
import Button from "../common/Button";
import { TextField, SelectField } from "../common/FormField";
import Alert from "../common/Alert";

interface DriverFormProps {
  vehicles: Vehicle[];
  onSubmit: (values: DriverPayload) => Promise<void>;
  onCancel: () => void;
}

export default function DriverForm({ vehicles, onSubmit, onCancel }: DriverFormProps) {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<DriverPayload>();

  async function handleFormSubmit(values: DriverPayload) {
    setError(null);
    try {
      await onSubmit(values);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Driver not found.");
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <TextField
        label="Driver Email"
        type="email"
        placeholder="driver@company.com"
        icon={<FiMail className="h-4 w-4" />}
        hint="Must match the email of an existing account with the Driver role."
        error={errors.email?.message}
        {...register("email", { required: "Required" })}
      />

      <TextField
        label="Phone"
        placeholder="+91 98765 43210"
        icon={<FiPhone className="h-4 w-4" />}
        error={errors.phone?.message}
        {...register("phone", { required: "Required" })}
      />

      <TextField
        label="License Number"
        placeholder="DL-1420110012345"
        icon={<FiCreditCard className="h-4 w-4" />}
        error={errors.licenseNo?.message}
        {...register("licenseNo", { required: "Required" })}
      />

      <SelectField label="Assign Vehicle" {...register("vehicleId")}>
        <option value="">Unassigned</option>
        {vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.plateNumber}
          </option>
        ))}
      </SelectField>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="flex gap-2 pt-2">
        <Button type="submit" loading={isSubmitting} fullWidth>
          Add Driver
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
