import prisma from "../config/prismaClient";

export async function getDashboardSummary() {
  const [totalRoutes, activeRoutes, totalVehicles, availableVehicles, totalDrivers] =
    await Promise.all([
      prisma.route.count(),
      prisma.route.count({ where: { status: "IN_PROGRESS" } }),
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: "AVAILABLE" } }),
      prisma.driver.count()
    ]);

  const [fuelAgg, completedDeliveries, pendingDeliveries, nextRoute] = await Promise.all([
    prisma.route.aggregate({
      _sum: { estimatedFuel: true, totalDistanceKm: true, totalTravelTime: true }
    }),
    prisma.stop.count({ where: { visited: true } }),
    prisma.stop.count({ where: { visited: false } }),
    prisma.route.findFirst({
      where: { status: { in: ["PLANNED", "IN_PROGRESS"] } },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true, etaMinutes: true }
    })
  ]);

  const nextEta = nextRoute
    ? new Date(new Date(nextRoute.createdAt).getTime() + nextRoute.etaMinutes * 60000).toISOString()
    : null;

  return {
    totalRoutes,
    activeRoutes,
    totalVehicles,
    availableVehicles,
    totalDrivers,
    totalFuelLiters: fuelAgg._sum.estimatedFuel || 0,
    totalDistanceKm: fuelAgg._sum.totalDistanceKm || 0,
    totalTravelTimeMinutes: fuelAgg._sum.totalTravelTime || 0,
    completedDeliveries,
    pendingDeliveries,
    nextEta
  };
}

export async function getFuelReport() {
  const routes = await prisma.route.findMany({
    select: {
      id: true,
      name: true,
      estimatedFuel: true,
      totalDistanceKm: true,
      createdAt: true,
      vehicle: { select: { plateNumber: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return routes;
}

export async function getRouteStatusBreakdown() {
  const statuses = ["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;

  const counts = await Promise.all(
    statuses.map((status) => prisma.route.count({ where: { status } }))
  );

  return statuses.map((status, idx) => ({ status, count: counts[idx] }));
}

export async function getVehicleUtilization() {
  const vehicles = await prisma.vehicle.findMany({
    select: {
      id: true,
      plateNumber: true,
      status: true,
      _count: { select: { routes: true } }
    }
  });

  return vehicles.map((v: { plateNumber: string; status: string; _count: { routes: number } }) => ({
    plateNumber: v.plateNumber,
    status: v.status,
    totalRoutes: v._count.routes
  }));
}
