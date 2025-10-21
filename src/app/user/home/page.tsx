"use client";

import HeaderPage from "@/components/HeaderPage";
import NoAuth from "@/components/NoAuth";
import { ApiValidateLogin } from "@/utils/supabase/api/auth";
import useSettings from "@/store/settings";
import { getI18nText } from "@/utils/i18n";
import React, { useEffect, useState } from "react";
import useAuth from "@/store/auth";
import { RpcGetRoutinesByDay } from "@/utils/supabase/rpc/routines";
import { routineReponse } from "@/utils/entities/routineModel";
import getDayName from "@/composables/useGetDay";
import { Accordion, AccordionItem, Skeleton } from "@heroui/react";
import TrackExercise from "@/components/TrackExercise";

export default function Home() {
  const auth = useAuth();

  React.useEffect(() => {
    ApiValidateLogin();
  }, []);

  const settings = useSettings();
  const t = (key: string) => getI18nText(key, settings.language);

  const [routines, setRoutines] = useState<routineReponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await RpcGetRoutinesByDay(
        auth.sessionData?.user.id || "",
        getDayName(settings)
      );
      setRoutines(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [auth.sessionData?.user.id, settings]);

  useEffect(() => {
    if (!auth.sessionData?.user.id) return;

    fetchData();
  }, [auth.sessionData?.user.id, fetchData]);

  return (
    <div>
      <HeaderPage
        title={`${t("home.title")}`}
        subtitle={`${t("home.subtitle")}`}
      />
      <div className="w-full p-5 flex flex-wrap gap-5">
        <NoAuth>
          {loading ? (
            <>
              <Skeleton className="rounded-lg  w-full">
                <div className="max-w-sm w-full h-[65px] rounded-lg bg-default-300" />
              </Skeleton>
              <Skeleton className="rounded-lg  w-full">
                <div className="max-w-sm w-full h-[65px] rounded-lg bg-default-300" />
              </Skeleton>
            </>
          ) : routines.length > 0 ? (
            <>
              <div className="w-full text-start text-lg font-bold px-5">
                {getDayName(settings)}
              </div>
              <Accordion variant="splitted">
                {routines.map((m, index) => (
                  <AccordionItem
                    key={index}
                    aria-label={m.name}
                    title={m.name}
                    subtitle={
                      <span>
                        {m.exercises.length} {t("routines.exercises")}
                      </span>
                    }
                  >
                    <h3 className="text-sm font-bold text-neutral-500 pb-4">
                      Exercises
                    </h3>
                    <div className="flex flex-col gap-2">
                      {m.exercises.map((e, index) => (
                        <div
                          key={index}
                          className="px-2 py-3 border border-neutral-700 rounded-lg flex items-center justify-between gap-x-3"
                        >
                          <div className="flex items-center gap-x-2">
                            <TrackExercise id_routine={m.id} />{" "}
                            <div className="flex flex-col">
                              <strong>{e.name}</strong>
                              <span className="text-xs text-neutral-500">
                                {e.muscle_group}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-x-2">
                            <span>
                              {e.sets}{" "}
                              <span className="text-neutral-400">Sets</span>
                            </span>
                            <span>
                              {e.reps}{" "}
                              <span className="text-neutral-400">Reps</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </>
          ) : (
            <div className="text-center w-full p-7 bg-neutral-800 rounded-lg">
              <p className="text-xs">{t("routines.empty")}</p>
            </div>
          )}
        </NoAuth>
      </div>
    </div>
  );
}
