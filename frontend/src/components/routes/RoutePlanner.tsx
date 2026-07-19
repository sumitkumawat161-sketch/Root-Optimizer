import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FiTrash2, FiPlus, FiNavigation, FiMapPin, FiMap, FiClock, FiDroplet } from "react-icons/fi";
import { useVehicles } from "../../hooks/useVehicles";
import { useCreateRoute } from "../../hooks/useRoutes";
import { CsvStopRow, RouteRecord } from "../../types";
import CsvUploader from "./CsvUploader";
import Button from "../common/Button";
import RouteMap from "../map/RouteMap";
import Card, { CardHeader } from "../common/Card";
import { TextField, SelectField } from "../common/FormField";
import Alert from "../common/Alert";
import EmptyState from "../common/EmptyState";

interface PlannerFormValues {
  name: string;
  vehicleId: string;
  algorithm: "nearest-neighbor" | "priority-first";
  averageSpeedKmh: number;
  trafficFactor: number;
  depotLat: number;
  depotLng: number;
  stops: CsvStopRow[];
}

export default function RoutePlanner() {
  const { data: vehicles = [] } = useVehicles();
  const createRoute = useCreateRoute();
  const [result, setResult] = useState<RouteRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, control, watch } = useForm<PlannerFormValues>({
    defaultValues: {
      name: "",
      algorithm: "nearest-neighbor",
      averageSpeedKmh: 40,
      trafficFactor: 1,
      depotLat: 28.6139,
      depotLng: 77.209,
      stops: []
    }
  });

  const { fields, append, remove, replace } = useFieldArray({ control, name: "stops" });

  function handleCsvParsed(parsedStops: CsvStopRow[]) {
    replace(parsedStops);
  }

  async function onSubmit(values: PlannerFormValues) {
    setError(null);
    try {
      const route = await createRoute.mutateAsync({
        name: values.name,
        vehicleId: values.vehicleId,
        algorithm: values.algorithm,
        averageSpeedKmh: Number(values.averageSpeedKmh),
        trafficFactor: Number(values.trafficFactor),
        depot: { id: "depot", latitude: Number(values.depotLat), longitude: Number(values.depotLng) },
        stops: values.stops.map((s) => ({
          label: s.label,
          latitude: Number(s.latitude),
          longitude: Number(s.longitude),
          demandKg: Number(s.demandKg),
          priority: Number(s.priority)
        }))
      });
      setResult(route);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to optimize route");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Card>
          <CardHeader title="Route details" subtitle="Basic configuration for this optimization run" />
          <div className="space-y-4">
            <TextField label="Route Name" placeholder="e.g. North Delhi Morning Run" {...register("name", { required: true })} />

            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Vehicle" {...register("vehicleId", { required: true })}>
                <option value="">Select vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plateNumber} ({v.capacityKg}kg)
                  </option>
                ))}
              </SelectField>
              <SelectField label="Algorithm" {...register("algorithm")}>
                <option value="nearest-neighbor">Nearest Neighbor</option>
                <option value="priority-first">Priority First</option>
              </SelectField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Avg Speed (km/h)"
                type="number"
                {...register("averageSpeedKmh", { valueAsNumber: true })}
              />
              <TextField
                label="Traffic Factor"
                type="number"
                step="0.1"
                hint="1 = normal traffic, higher = slower"
                {...register("trafficFactor", { valueAsNumber: true })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Depot Latitude"
                type="number"
                step="0.0001"
                icon={<FiMapPin className="h-4 w-4" />}
                {...register("depotLat", { valueAsNumber: true })}
              />
              <TextField
                label="Depot Longitude"
                type="number"
                step="0.0001"
                icon={<FiMapPin className="h-4 w-4" />}
                {...register("depotLng", { valueAsNumber: true })}
              />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Import stops" subtitle="Upload a CSV or add stops manually below" />
          <CsvUploader onParsed={handleCsvParsed} />
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                Stops ({fields.length})
              </h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<FiPlus />}
              onClick={() => append({ label: "", latitude: 0, longitude: 0, demandKg: 0, priority: 1 })}
            >
              Add Stop
            </Button>
          </div>

          {fields.length === 0 ? (
            <EmptyState
              icon={<FiMapPin />}
              title="No stops added"
              description="Upload a CSV file above or add stops manually to build your route."
            />
          ) : (
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/50"
                >
                  <input
                    className="focus-ring col-span-4 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Label"
                    {...register(`stops.${index}.label` as const)}
                  />
                  <input
                    className="focus-ring col-span-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Lat"
                    type="number"
                    step="0.0001"
                    {...register(`stops.${index}.latitude` as const, { valueAsNumber: true })}
                  />
                  <input
                    className="focus-ring col-span-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Lng"
                    type="number"
                    step="0.0001"
                    {...register(`stops.${index}.longitude` as const, { valueAsNumber: true })}
                  />
                  <input
                    className="focus-ring col-span-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Demand"
                    type="number"
                    {...register(`stops.${index}.demandKg` as const, { valueAsNumber: true })}
                  />
                  <input
                    className="focus-ring col-span-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Pri"
                    type="number"
                    {...register(`stops.${index}.priority` as const, { valueAsNumber: true })}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="col-span-1 flex items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {error && <Alert variant="error">{error}</Alert>}

        <Button
          type="submit"
          loading={createRoute.isLoading}
          fullWidth
          size="lg"
          icon={<FiNavigation />}
        >
          Generate Optimized Route
        </Button>
      </form>

      <div className="flex flex-col gap-4">
        {result && (
          <Card>
            <CardHeader title="Optimized result" subtitle={`${result.optimizedStops.length} stops · ${result.algorithm.replace("-", " ")}`} />
            <div className="grid grid-cols-3 gap-3">
              <ResultMetric icon={<FiMap />} label="Distance" value={`${result.totalDistance} km`} />
              <ResultMetric
                icon={<FiClock />}
                label="Travel Time"
                value={result.totalTravelTime != null ? `${Math.round(result.totalTravelTime)} min` : "-"}
              />
              <ResultMetric
                icon={<FiDroplet />}
                label="Fuel"
                value={`${result.estimatedFuel} L`}
              />
            </div>
            {result.eta && (
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Estimated arrival:{" "}
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {new Date(result.eta).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </p>
            )}
          </Card>
        )}

        <div className="h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-800 dark:bg-slate-900 xl:sticky xl:top-20 xl:h-[calc(100vh-7rem)]">
          <RouteMap
            stops={result?.stops || []}
            geometry={result?.geometry}
            depot={{ latitude: watch("depotLat"), longitude: watch("depotLng") }}
          />
        </div>
      </div>
    </div>
  );
}

function ResultMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/60">
      <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-500 shadow-soft dark:bg-slate-900">
        {icon}
      </div>
      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{value}</p>
      <p className="text-[11px] text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
