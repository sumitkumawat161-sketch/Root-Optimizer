import { useQuery, useMutation, useQueryClient } from "react-query";
import { FiUsers, FiTruck, FiMap, FiShield, FiTrash2 } from "react-icons/fi";
import DashboardLayout from "../components/layout/DashboardLayout";
import axiosClient from "../api/axiosClient";
import { User } from "../types";
import { PageHeader, StatCard } from "../components/common/PageHeader";
import { SkeletonTable } from "../components/common/Loader";
import { ErrorState } from "../components/common/Alert";

async function fetchUsers(): Promise<User[]> {
  const { data } = await axiosClient.get<User[]>("/api/admin/users");
  return data;
}

async function fetchStats() {
  const { data } = await axiosClient.get("/api/admin/stats");
  return data;
}

export default function AdminPanelPage() {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading, isError, refetch } = useQuery("admin-users", fetchUsers);
  const { data: stats } = useQuery("admin-stats", fetchStats);

  const updateRole = useMutation(
    ({ id, role }: { id: string; role: string }) =>
      axiosClient.put(`/api/admin/users/${id}/role`, { role }),
    { onSuccess: () => queryClient.invalidateQueries("admin-users") }
  );

  const deleteUser = useMutation((id: string) => axiosClient.delete(`/api/admin/users/${id}`), {
    onSuccess: () => queryClient.invalidateQueries("admin-users")
  });

  return (
    <DashboardLayout>
      <PageHeader title="Admin Panel" subtitle="Manage users, roles and system-wide statistics" />

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Users" value={stats.users} icon={<FiUsers />} accent="brand" />
          <StatCard label="Vehicles" value={stats.vehicles} icon={<FiTruck />} accent="teal" />
          <StatCard label="Drivers" value={stats.drivers} icon={<FiShield />} accent="violet" />
          <StatCard label="Routes" value={stats.routes} icon={<FiMap />} accent="amber" />
        </div>
      )}

      {isLoading ? (
        <SkeletonTable />
      ) : isError ? (
        <ErrorState title="Couldn't load users" onRetry={() => refetch()} />
      ) : (
        <div className="surface-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Name
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Role
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{u.name}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="px-5 py-3">
                      <select
                        className="focus-ring rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                        value={u.role}
                        onChange={(e) => updateRole.mutate({ id: u.id, role: e.target.value })}
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="DISPATCHER">Dispatcher</option>
                        <option value="DRIVER">Driver</option>
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => deleteUser.mutate(u.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-2.5 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
