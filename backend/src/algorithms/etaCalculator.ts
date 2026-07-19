export interface EtaOptions {
  distanceKm: number;
  averageSpeedKmh: number;
  trafficFactor?: number;
  stopCount?: number;
  minutesPerStop?: number;
}

export function calculateEtaMinutes(options: EtaOptions): number {
  const {
    distanceKm,
    averageSpeedKmh,
    trafficFactor = 1,
    stopCount = 0,
    minutesPerStop = 5
  } = options;

  const safeSpeed = Math.max(averageSpeedKmh, 1);
  const travelMinutes = (distanceKm / safeSpeed) * 60 * trafficFactor;
  const stopMinutes = stopCount * minutesPerStop;

  return Math.round(travelMinutes + stopMinutes);
}
