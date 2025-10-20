"use client";

import { useEffect, useState } from "react";
import { Select, SelectItem, Spinner } from "@heroui/react";
import { toast } from "sonner";
import HeaderPage from "@/components/HeaderPage";
import NoAuth from "@/components/NoAuth";
import useAuth from "@/store/auth";
import useSettings from "@/store/settings";
import { routineReponse } from "@/utils/entities/routineModel";
import { getI18nText } from "@/utils/i18n";
import {
  RpcGetRoutineChartData,
  RpcGetRoutines,
} from "@/utils/supabase/rpc/routines";

export default function Progress() {
  const auth = useAuth();
  const settings = useSettings();
  const t = (key: string) => getI18nText(key, settings.language);

  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [routines, setRoutines] = useState<routineReponse[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<Set<string>>(
    new Set()
  );

  // === Obtener rutinas del usuario ===
  const fetchDataRoutines = async () => {
    try {
      setLoading(true);
      const data = await RpcGetRoutines(auth.sessionData?.user.id || "");
      if (!Array.isArray(data)) throw new Error("Invalid routine response");
      setRoutines(data);
    } catch (err) {
      console.error(err);
      toast.error(t("progress.errorRoutines"));
    } finally {
      setLoading(false);
    }
  };

  // === Obtener datos del gráfico ===
  const fetchDataChart = async (routineId: string) => {
    try {
      setChartLoading(true);

      const data = await RpcGetRoutineChartData(
        auth.sessionData?.user?.id || "",
        routineId,
        null, // Ejercicio seleccionado (a futuro)
        "week",
        ["weight", "sets", "reps"]
      );

      if (!data || data.code === 500) {
        toast.error(data?.message || t("progress.errorChart"));
        setChartData(null);
        return;
      }

      setChartData(data);
    } catch (err) {
      console.error(err);
      toast.error(t("progress.errorUnexpected"));
    } finally {
      setChartLoading(false);
    }
  };

  // === Carga inicial de rutinas ===
  useEffect(() => {
    if (auth.sessionData?.user.id) {
      fetchDataRoutines();
    }
  }, [auth.sessionData?.user.id]);

  // === Llama al gráfico al cambiar rutina seleccionada ===
  useEffect(() => {
    const routineId = Array.from(selectedRoutine)[0];
    if (routineId) {
      fetchDataChart(routineId);
    } else {
      setChartData(null);
    }
  }, [selectedRoutine]);

  // === Render principal ===
  return (
    <div>
      <HeaderPage
        title={`${t("progress.title")}`}
        subtitle={`${t("progress.subtitle")}`}
      />

      <div className="w-full p-5 flex flex-col gap-5">
        <NoAuth>
          {loading ? (
            <div className="w-full flex justify-center py-10">
              <Spinner color="primary" />
            </div>
          ) : routines.length === 0 ? (
            <div className="text-center text-neutral-400 text-sm py-10">
              {t("progress.noRoutines")}
            </div>
          ) : (
            <>
              <div className="max-w-xs w-full">
                <Select
                  className="w-full"
                  label={t("progress.selectRoutine")}
                  labelPlacement="outside"
                  placeholder={t("progress.placeholderRoutine")}
                  size="sm"
                  selectedKeys={selectedRoutine}
                  onSelectionChange={(keys) =>
                    setSelectedRoutine(new Set(Array.from(keys).map(String)))
                  }
                >
                  {routines.map((routine) => (
                    <SelectItem key={routine.id}>
                      <div className="flex items-center gap-x-2 w-full">
                        <span className="truncate max-w-[80%]">
                          {routine.name}
                        </span>
                        <span className="text-xs text-neutral-400 font-light">
                          {routine.day_of_week}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="w-full flex justify-center mt-6">
                {chartLoading ? (
                  <Spinner color="primary" />
                ) : chartData ? (
                  <div className="w-full text-center text-sm text-neutral-300">
                    {/* Aquí va el gráfico (ej: Recharts o Chart.js) */}
                    <p>📈 {t("progress.chartReady")}</p>
                  </div>
                ) : (
                  <p className="text-neutral-500 text-sm">
                    {t("progress.noData")}
                  </p>
                )}
              </div>
            </>
          )}
        </NoAuth>
      </div>
    </div>
  );
}
