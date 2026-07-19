import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import DashboardLayout from "../components/layout/DashboardLayout";
import VehicleList from "../components/vehicles/VehicleList";
import VehicleForm from "../components/vehicles/VehicleForm";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { PageHeader } from "../components/common/PageHeader";
import { SkeletonGrid } from "../components/common/Loader";
import { ErrorState } from "../components/common/Alert";
import { useVehicles, useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from "../hooks/useVehicles";
import { Vehicle } from "../types";
import { VehiclePayload } from "../api/vehicleApi";

export default function VehicleManagementPage() {
  const { data: vehicles = [], isLoading, isError, refetch } = useVehicles();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);

  async function handleSubmit(values: VehiclePayload) {
    if (editing) {
      await updateVehicle.mutateAsync({ id: editing.id, payload: values });
    } else {
      await createVehicle.mutateAsync(values);
    }
    setShowForm(false);
    setEditing(null);
  }

  function openCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(vehicle: Vehicle) {
    setEditing(vehicle);
    setShowForm(true);
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Vehicle Management"
        subtitle="Track fleet capacity, fuel efficiency and vehicle availability"
        action={
          <Button icon={<FiPlus />} onClick={openCreate}>
            Add Vehicle
          </Button>
        }
      />

      {isLoading ? (
        <SkeletonGrid />
      ) : isError ? (
        <ErrorState title="Couldn't load vehicles" onRetry={() => refetch()} />
      ) : (
        <VehicleList
          vehicles={vehicles}
          onEdit={openEdit}
          onDelete={(id) => deleteVehicle.mutate(id)}
          onAddNew={openCreate}
        />
      )}

      <Modal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditing(null);
        }}
        title={editing ? "Edit Vehicle" : "Add Vehicle"}
        subtitle={editing ? "Update this vehicle's details" : "Register a new vehicle to your fleet"}
      >
        <VehicleForm
          initialValues={editing}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      </Modal>
    </DashboardLayout>
  );
}
