import { useRef, useState, DragEvent } from "react";
import { FiUploadCloud, FiFileText } from "react-icons/fi";
import { uploadStopsCsvRequest } from "../../api/uploadApi";
import { CsvStopRow } from "../../types";
import Alert from "../common/Alert";

interface CsvUploaderProps {
  onParsed: (stops: CsvStopRow[]) => void;
}

export default function CsvUploader({ onParsed }: CsvUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  async function processFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const result = await uploadStopsCsvRequest(file);
      onParsed(result.stops);
      setFileName(file.name);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to parse CSV");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          dragActive
            ? "border-brand-400 bg-brand-50 dark:bg-brand-500/10"
            : "border-slate-300 bg-white hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900"
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient-soft text-brand-600 dark:text-brand-400">
          {uploading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          ) : (
            <FiUploadCloud className="h-5 w-5" />
          )}
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {uploading ? "Parsing CSV..." : "Drag & drop a CSV, or click to browse"}
        </p>
        <p className="text-xs text-slate-400">Columns: label, latitude, longitude, demandKg, priority</p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {fileName && !error && (
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <FiFileText className="h-3.5 w-3.5" />
          Loaded stops from <span className="font-medium">{fileName}</span>
        </div>
      )}

      {error && <Alert variant="error">{error}</Alert>}
    </div>
  );
}
