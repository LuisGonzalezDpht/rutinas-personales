"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectItem,
  SelectSection,
  Skeleton,
  Spinner,
} from "@heroui/react";
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
import Chart, { ChartSeries } from "@/components/Chart";

export default function Progress() {
  const auth = useAuth();
  const settings = useSettings();
  const t = useCallback((key: string) => getI18nText(key, settings.language), [settings.language]);

  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartSeries[]>([]);
  const [routines, setRoutines] = useState<routineReponse[]>([]);

  const [selectedRoutine, setSelectedRoutine] = useState<Set<string>>(
    new Set()
  );

  const [metrics, setSelectedMetrics] = useState<Set<string>>(
    new Set(["weight"])
  );
  const [range, setSelectedRange] = useState<Set<string>>(new Set(["day"]));

  const metricsData = ["weight", "sets", "reps"];

  const rangeData = ["day", "week", "month", "year"];

  // === Obtener rutinas del usuario ===
  const fetchDataRoutines = useCallback(async () => {
    try {
      setLoading(true);
      const data = await RpcGetRoutines(auth.sessionData?.user.id || "");
      if (!Array.isArray(data)) throw new Error("Invalid routine response");

      setSelectedRoutine(new Set([data[0].id]));
      setRoutines(data);
    } catch (err) {
      console.error(err);
      toast.error(t("progress.errorRoutines"));
    } finally {
      setLoading(false);
    }
  }, [auth.sessionData?.user?.id, t]);

  // === Obtener datos del gráfico ===
  const fetchDataChart = useCallback(
    async (routineId: string) => {
      try {
        setChartLoading(true);

        const selectedMetrics = Array.from(metrics); // puede ser ["weight"] o ["weight", "sets"]
        const selectedRange = Array.from(range)[0] || "day"; // solo uno: "day" o "week"

        // Ejecutar todas las métricas en paralelo
        const responses = await Promise.all(
          selectedMetrics.map((metric) =>
            RpcGetRoutineChartData(routineId, metric, selectedRange)
          )
        );

        // Filtrar solo las respuestas válidas
        const validResponses = responses.filter(
          (res) => res && res.code === 200 && res.data
        );

        if (validResponses.length === 0) {
          toast.error(t("progress.errorChart"));
          setChartData([]);
          return;
        }

        // Convertir a formato ChartSeries[]
        const formattedSeries = validResponses.map((res, index) => {
          const metric = selectedMetrics[index];

          return {
            id: metric,
            name:
              metric === "weight"
                ? "Weight"
                : metric === "sets"
                ? "Sets"
                : metric,
            color:
              metric === "weight"
                ? "#2962FF"
                : metric === "sets"
                ? "#FF7043"
                : "#9C27B0",
            data: res.data as ChartSeries["data"],
          };
        });

        setChartData(formattedSeries);
      } catch (err) {
        console.error(err);
        toast.error(t("progress.errorUnexpected"));
      } finally {
        setChartLoading(false);
      }
    },
    [metrics, range, t]
  );

  // === Carga inicial de rutinas ===
  useEffect(() => {
    if (auth.sessionData?.user.id) {
      fetchDataRoutines();
    }
  }, [auth.sessionData?.user.id, fetchDataRoutines]);

  // === Llama al gráfico al cambiar rutina seleccionada ===
  useEffect(() => {
    const routineId = Array.from(selectedRoutine)[0];
    if (routineId) {
      fetchDataChart(routineId);
    } else {
      setChartData([]);
    }
  }, [selectedRoutine, fetchDataChart]);

  const headingClasses =
    "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small";

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
            <>
              <Skeleton className="w-full h-[40px] rounded-lg"></Skeleton>
              <Skeleton className="w-full h-[400px] rounded-lg mt-3"></Skeleton>
            </>
          ) : routines.length === 0 ? (
            <div className="text-center text-neutral-400 text-sm py-10">
              {t("progress.noRoutines")}
            </div>
          ) : (
            <>
              <div className="w-full flex justify-center items-center gap-x-5">
                <Select
                  label="Routines"
                  labelPlacement="outside"
                  placeholder="Select a routine"
                  size="sm"
                  selectedKeys={selectedRoutine}
                  onSelectionChange={(keys) =>
                    setSelectedRoutine(new Set(Array.from(keys).map(String)))
                  }
                >
                  {Object.entries(
                    routines.reduce((acc, routine) => {
                      const day = routine.day_of_week || "Sin día";
                      if (!acc[day]) acc[day] = [];
                      acc[day].push(routine);
                      return acc;
                    }, {} as Record<string, typeof routines>)
                  )
                    // opcional: orden de lunes a domingo
                    .sort(([a], [b]) => {
                      const order = [
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday",
                      ];
                      return order.indexOf(a) - order.indexOf(b);
                    })
                    .map(([day, routinesByDay], index) => (
                      <SelectSection
                        key={day}
                        title={day}
                        showDivider={index < Object.keys(routines).length - 1}
                        classNames={{
                          heading: headingClasses,
                        }}
                      >
                        {routinesByDay.map((routine) => (
                          <SelectItem
                            key={String(routine.id)}
                            textValue={routine.name}
                          >
                            <span className="truncate">{routine.name}</span>
                          </SelectItem>
                        ))}
                      </SelectSection>
                    ))}
                </Select>
                <Select
                  label="Metrics"
                  labelPlacement="outside"
                  placeholder="Select a metric"
                  size="sm"
                  selectedKeys={metrics}
                  selectionMode="multiple"
                  onSelectionChange={(keys) => {
                    const arr = Array.from(keys).map(String);
                    if (arr.length) setSelectedMetrics(new Set(arr));
                  }}
                >
                  {metricsData.map((metric) => (
                    <SelectItem key={metric} textValue={metric}>
                      <span className="truncate">{metric}</span>
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Range"
                  labelPlacement="outside"
                  placeholder="Select a range"
                  size="sm"
                  selectedKeys={range}
                  onSelectionChange={(keys) => {
                    const arr = Array.from(keys).map(String);
                    if (arr.length) setSelectedRange(new Set(arr));
                  }}
                >
                  {rangeData.map((r) => (
                    <SelectItem key={r} textValue={r}>
                      <span className="truncate">{r}</span>
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="w-full flex justify-center mt-6">
                {chartLoading ? (
                  <div className="w-full flex justify-center items-center h-[400px] bg-neutral-800 rounded-lg">
                    <Spinner color="primary" />
                  </div>
                ) : chartData ? (
                  <div className="w-full text-center text-sm text-neutral-300">
                    <Chart series={chartData} />
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
