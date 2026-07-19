import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import {
  FiMap,
  FiActivity,
  FiTruck,
  FiCheckCircle,
  FiUsers,
  FiDroplet,
  FiTrendingUp,
  FiClock,
  FiPackage
} from "react-icons/fi";
import DashboardLayout from "../components/layout/DashboardLayout";
import { fetchDashboardSummary } from "../api/analyticsApi";
import { PageHeader, StatCard } from "../components/common/PageHeader";
import { SkeletonGrid } from "../components/common/Loader";
import { ErrorState } from "../components/common/Alert";
import Card, { CardHeader } from "../components/common/Card";

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery("dashboard-summary", fetchDashboardSummary);

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        subtitle="A real-time overview of your fleet, routes and performance"
      />

      {isLoading ? (
        <SkeletonGrid count={11} />
      ) : isError ? (
        <ErrorState
          title="Couldn't load dashboard data"
          description="Check your connection and try again."
          onRetry={() => refetch()}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <StatCard
              label="Total Routes"
              value={data?.totalRoutes ?? 0}
              icon={<FiMap />}
              accent="brand"
            />
            <StatCard
              label="Active Routes"
              value={data?.activeRoutes ?? 0}
              icon={<FiActivity />}
              accent="teal"
            />
            <StatCard
              label="Total Vehicles"
              value={data?.totalVehicles ?? 0}
              icon={<FiTruck />}
              accent="violet"
            />
            <StatCard
              label="Available Vehicles"
              value={data?.availableVehicles ?? 0}
              icon={<FiCheckCircle />}
              accent="amber"
            />
            <StatCard
              label="Total Drivers"
              value={data?.totalDrivers ?? 0}
              icon={<FiUsers />}
              accent="brand"
            />
            <StatCard
              label="Total Fuel Used"
              value={`${data?.totalFuelLiters ?? 0} L`}
              icon={<FiDroplet />}
              accent="teal"
            />
            <StatCard
              label="Total Distance"
              value={`${data?.totalDistanceKm ?? 0} km`}
              icon={<FiTrendingUp />}
              accent="violet"
            />
            <StatCard
              label="Total Travel Time"
              value={`${Math.round(data?.totalTravelTimeMinutes ?? 0)} min`}
              icon={<FiClock />}
              accent="brand"
            />
            <StatCard
              label="Completed Deliveries"
              value={data?.completedDeliveries ?? 0}
              icon={<FiCheckCircle />}
              accent="teal"
            />
            <StatCard
              label="Pending Deliveries"
              value={data?.pendingDeliveries ?? 0}
              icon={<FiPackage />}
              accent="amber"
            />
            <StatCard
              label="Next ETA"
              value={
                data?.nextEta
                  ? new Date(data.nextEta).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "-"
              }
              icon={<FiClock />}
              accent="violet"
            />
          </div>

          <Card>
            <CardHeader
              title="Getting things moving"
              subtitle="Head to the Route Planner to optimize a new delivery route, or check Live Tracking to see your fleet in motion."
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <QuickLink to="/planner" title="Plan a route" description="Optimize stops in seconds" />
              <QuickLink to="/vehicles" title="Manage vehicles" description="Fleet capacity & status" />
              <QuickLink to="/tracking" title="Live tracking" description="See vehicles in real time" />
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}

function QuickLink({ to, title, description }: { to: string; title: string; description: string }) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft dark:border-slate-800"
    >
      <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-600 dark:text-slate-100 dark:group-hover:text-brand-400">
        {title}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
    </Link>
  );
}
