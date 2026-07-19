import { FiNavigation, FiWifi } from "react-icons/fi";
import DashboardLayout from "../components/layout/DashboardLayout";
import LiveTrackingMap from "../components/map/LiveTrackingMap";
import { useVehicles } from "../hooks/useVehicles";
import { useLiveTracking } from "../hooks/useLiveTracking";
import { PageHeader } from "../components/common/PageHeader";
import Loader from "../components/common/Loader";
import { ErrorState } from "../components/common/Alert";
import Badge from "../components/common/Badge";

export default function LiveTrackingPage() {
  const { data: vehicles = [], isLoading, isError, refetch } = useVehicles();
  const { positions } = useLiveTracking();

  return (
    <DashboardLayout>
      <PageHeader
        title="Live Tracking"
        subtitle="Real-time vehicle positions across your fleet"
        action={
          <Badge color="green" icon={<FiWifi className="h-3 w-3" />}>
            {positions.length} live
          </Badge>
        }
      />
      {isLoading ? (
        <Loader label="Loading fleet locations..." />
      ) : isError ? (
        <ErrorState title="Couldn't load vehicles" onRetry={() => refetch()} />
      ) : (
        <div className="h-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          {vehicles.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
              <FiNavigation className="h-8 w-8" />
              <p className="text-sm font-medium">No vehicles to track yet</p>
            </div>
          ) : (
            <LiveTrackingMap vehicles={vehicles} positions={positions} />
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
