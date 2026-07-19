import axiosClient from "./axiosClient";
import { CsvStopRow } from "../types";

export async function uploadStopsCsvRequest(
  file: File
): Promise<{ count: number; stops: CsvStopRow[] }> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosClient.post(
    "/api/upload/stops",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}