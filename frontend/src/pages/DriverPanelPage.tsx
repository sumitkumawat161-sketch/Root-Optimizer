import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import DashboardLayout from "../components/layout/DashboardLayout";
import DriverList from "../components/drivers/DriverList";
import DriverForm from "../components/drivers/DriverForm";
import DriverPanel from "../components/drivers/DriverPanel";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { PageHeader } from "../components/common/PageHeader";
import { SkeletonTable } from "../components/common/Loader";
import { ErrorState } from "../components/common/Alert";
import { useDrivers, useCreateDriver, useUpdateDriver, useDeleteDriver } from "../hooks/useDrivers";
import { useVehicles } from "../hooks/useVehicles";
import { useAuth } from "../hooks/useAuth";
import { Driver } from "../types";
import { DriverPayload } from "../api/driverApi";

export default function DriverPanelPage() {
  const { user } = useAuth();

  if (user?.role === "DRIVER") {
    return (
      <DashboardLayout>
        <PageHeader title="My Assignments" subtitle="Routes and stops assigned to you today" />
        <DriverPanel />
      </DashboardLayout>
    );
  }

  return <DriverManagementView />;
}

function DriverManagementView() {
  const { data: drivers = [], isLoading, isError, refetch } = useDrivers();
  const { data: vehicles = [] } = useVehicles();
  const createDriver = useCreateDriver();
  const updateDriver = useUpdateDriver();
  const deleteDriver = useDeleteDriver();
  const [showForm, setShowForm] = useState(false);

  async function handleCreate(values: DriverPayload) {
    await createDriver.mutateAsync(values);
    setShowForm(false);
  }

  function handleToggleAvailability(driver: Driver) {
    updateDriver.mutate({ id: driver.id, payload: { available: !driver.available } });
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Driver Management"
        subtitle="Manage driver profiles, availability and vehicle assignments"
        action={
          <Button icon={<FiPlus />} onClick={() => setShowForm(true)}>
            Add Driver
          </Button>
        }
      />

      {isLoading ? (
        <SkeletonTable />
      ) : isError ? (
        <ErrorState title="Couldn't load drivers" onRetry={() => refetch()} />
      ) : (
        <DriverList
          drivers={drivers}
          onToggleAvailability={handleToggleAvailability}
          onDelete={(id) => deleteDriver.mutate(id)}
        />
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Add Driver"
        subtitle="Create a driver profile for an existing user account"
      >
        <DriverForm vehicles={vehicles} onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      </Modal>
    </DashboardLayout>
  );
}
