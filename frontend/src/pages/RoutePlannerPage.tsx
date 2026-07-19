import { useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import RoutePlanner from "../components/routes/RoutePlanner";
import RouteDetails from "../components/routes/RouteDetails";
import RouteList from "../components/routes/RouteList";
import { useRoutes } from "../hooks/useRoutes";
import { PageHeader } from "../components/common/PageHeader";
import { SkeletonTable } from "../components/common/Loader";
import { ErrorState } from "../components/common/Alert";

export default function RoutePlannerPage() {
  const { id } = useParams<{ id?: string }>();
  const { data: routes = [], isLoading, isError, refetch } = useRoutes();

  return (
    <DashboardLayout>
      {id ? (
        <RouteDetails />
      ) : (
        <div className="space-y-8">
          <PageHeader
            title="Route Planner"
            subtitle="Build optimized delivery routes with real-time distance, ETA and fuel estimates"
          />
          <RoutePlanner />
          <div>
            <h3 className="mb-3 text-base font-semibold text-slate-800 dark:text-slate-100">
              All Routes
            </h3>
            {isLoading ? (
              <SkeletonTable />
            ) : isError ? (
              <ErrorState title="Couldn't load routes" onRetry={() => refetch()} />
            ) : (
              <RouteList routes={routes} />
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
