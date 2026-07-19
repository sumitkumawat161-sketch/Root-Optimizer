import { parse } from "csv-parse/sync";

export interface CsvStopRow {
  label: string;
  latitude: number;
  longitude: number;
  demandKg: number;
  priority: number;
}

export function parseStopsCsv(buffer: Buffer): CsvStopRow[] {
  const records: Record<string, string>[] = parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  return records.map((row) => {
    const label = row.label || row.name || "Unnamed Stop";
    const latitude = parseFloat(row.latitude || row.lat);
    const longitude = parseFloat(row.longitude || row.lng || row.lon);
    const demandKg = row.demandKg ? parseFloat(row.demandKg) : 0;
    const priority = row.priority ? parseInt(row.priority, 10) : 1;

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      throw new Error(`Invalid coordinates for stop "${label}"`);
    }

    return { label, latitude, longitude, demandKg, priority };
  });
}
