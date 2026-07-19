import DashboardLayout from "../components/layout/DashboardLayout";
import AnalyticsCharts from "../components/analytics/AnalyticsCharts";
import ReportsTable from "../components/analytics/ReportsTable";
import { PageHeader } from "../components/common/PageHeader";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Analytics & Reports"
        subtitle="Fleet performance, route outcomes and fuel consumption trends"
      />
      <div className="space-y-8">
        <AnalyticsCharts />
        <div>
          <h3 className="mb-3 text-base font-semibold text-slate-800 dark:text-slate-100">
            Fuel Report
          </h3>
          <ReportsTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
