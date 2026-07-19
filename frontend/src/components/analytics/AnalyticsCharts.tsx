import { useQuery } from "react-query";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { fetchStatusBreakdown, fetchVehicleUtilization } from "../../api/analyticsApi";
import { SkeletonGrid } from "../common/Loader";
import { ErrorState } from "../common/Alert";
import Card, { CardHeader } from "../common/Card";
import EmptyState from "../common/EmptyState";
import { FiPieChart } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function AnalyticsCharts() {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "#cbd5e1" : "#475569";
  const gridColor = theme === "dark" ? "rgba(148,163,184,0.12)" : "rgba(148,163,184,0.2)";

  const {
    data: statusData,
    isLoading: statusLoading,
    isError: statusError,
    refetch: refetchStatus
  } = useQuery("status-breakdown", fetchStatusBreakdown);
  const {
    data: utilizationData,
    isLoading: utilLoading,
    isError: utilError,
    refetch: refetchUtil
  } = useQuery("vehicle-utilization", fetchVehicleUtilization);

  if (statusLoading || utilLoading) return <SkeletonGrid count={2} />;
  if (statusError || utilError) {
    return (
      <ErrorState
        title="Couldn't load analytics"
        onRetry={() => {
          refetchStatus();
          refetchUtil();
        }}
      />
    );
  }

  const hasStatusData = (statusData || []).some((s) => s.count > 0);
  const hasUtilData = (utilizationData || []).length > 0;

  const statusChartData = {
    labels: statusData?.map((s) => s.status.replace("_", " ")) || [],
    datasets: [
      {
        data: statusData?.map((s) => s.count) || [],
        backgroundColor: ["#94a3b8", "#3b66f5", "#22c55e", "#f87171"],
        borderWidth: 0
      }
    ]
  };

  const utilizationChartData = {
    labels: utilizationData?.map((v) => v.plateNumber) || [],
    datasets: [
      {
        label: "Routes Completed",
        data: utilizationData?.map((v) => v.totalRoutes) || [],
        backgroundColor: "#3b66f5",
        borderRadius: 8,
        maxBarThickness: 32
      }
    ]
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader title="Route Status Breakdown" subtitle="Distribution of routes by current status" />
        {hasStatusData ? (
          <Doughnut
            data={statusChartData}
            options={{
              plugins: { legend: { position: "bottom", labels: { color: textColor, padding: 16 } } }
            }}
          />
        ) : (
          <EmptyState icon={<FiPieChart />} title="No route data yet" />
        )}
      </Card>
      <Card>
        <CardHeader title="Vehicle Utilization" subtitle="Total routes completed per vehicle" />
        {hasUtilData ? (
          <Bar
            data={utilizationChartData}
            options={{
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { color: textColor }, grid: { color: gridColor } },
                y: { ticks: { color: textColor }, grid: { color: gridColor } }
              }
            }}
          />
        ) : (
          <EmptyState icon={<FiPieChart />} title="No vehicle data yet" />
        )}
      </Card>
    </div>
  );
}
