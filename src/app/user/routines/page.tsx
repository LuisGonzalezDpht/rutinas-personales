"use client";
import { useEffect, useState } from "react";
import CreateRoutine from "@/components/CreateRoutine";
import HeaderPage from "@/components/HeaderPage";
import NoAuth from "@/components/NoAuth";
import { RpcGetRoutines } from "@/utils/supabase/rpc/routines";
import useAuth from "@/store/auth";
import { routineReponse } from "@/utils/entities/routineModel";
import { Calendar, Delete, Dumbbell, Edit, MoreVertical } from "lucide-react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from "@heroui/react";
import { ApiDeleteRoutine } from "@/utils/supabase/api/routines";
import useSettings from "@/store/settings";
import { getI18nText } from "@/utils/i18n";

export default function Routines() {
  const auth = useAuth();
  const [routines, setRoutines] = useState<routineReponse[]>([]);
  const [loading, setLoading] = useState(true);
  const settings = useSettings();
  const t = (key: string) => getI18nText(key, settings.language);

  const fetchData = async () => {
    try {
      const data = await RpcGetRoutines(auth.sessionData?.user.id || "", true);
      setRoutines(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.sessionData?.user.id) return;
    fetchData();
  }, [auth.sessionData?.user.id]);

  function refreshRoutines() {
    if (!auth.sessionData?.user.id) return;
    fetchData();
  }

  function deleteRoutine(id: string) {
    if (!auth.sessionData?.user.id) return;

    const fetchData = async () => {
      try {
        await ApiDeleteRoutine(id);
        refreshRoutines();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }

  return (
    <div>
      <HeaderPage
        title={`${t("routines.title")}`}
        subtitle={`${t("routines.subtitle")}`}
      >
        {auth.isAuthenticated && <CreateRoutine onAdd={refreshRoutines} />}
      </HeaderPage>
      <div className="w-full p-5 flex flex-wrap gap-5">
        <NoAuth>
          {loading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <Skeleton key={idx} className="rounded-lg max-w-sm w-full">
                <div className="max-w-sm w-full h-[170px] rounded-lg bg-default-300" />
              </Skeleton>
            ))
          ) : routines.length > 0 ? (
            <>
              {routines.map((m: routineReponse) => {
                return (
                  <div
                    key={m.id}
                    className="border border-neutral-700 p-5 rounded-lg flex flex-col gap-y-5 max-w-sm w-full"
                  >
                    <div className="text-white text-lg font-bold flex items-center justify-between gap-x-2">
                      <div>
                        <Calendar className="inline-block w-auto h-4 text-neutral-400" />
                        <span className="bg-neutral-800 px-2 rounded-md capitalize text-xs">
                          {m.day_of_week}
                        </span>
                      </div>
                      <div>
                        <Popover>
                          <PopoverTrigger>
                            <Button variant="flat" isIconOnly>
                              <MoreVertical className="w-auto h-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="flex flex-col gap-y-2">
                              <Button
                                variant="flat"
                                color="danger"
                                onPress={() => deleteRoutine(m.id)}
                              >
                                <Delete className="w-auto h-4" />{" "}
                                {t("routines.deleteRoutine")}
                              </Button>
                              <Button variant="flat" color="success" isDisabled>
                                <Edit className="w-auto h-4" />{" "}
                                {t("routines.editRoutine")}
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="text-white text-sm font-medium space-y-5">
                      <h2 className="text-lg font-bold text-nowrap whitespace-nowrap text-ellipsis">
                        {m.name}
                      </h2>
                      <p className="gap-x-3 flex items-center">
                        <Dumbbell className="inline-block w-auto h-4 text-neutral-400" />
                        <span className="text-neutral-400">
                          {m.exercises.length} {t("routines.exercises")}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="text-center w-full p-10 bg-neutral-800 rounded-lg">
              <p className="text-xs">{t("routines.empty")}</p>
            </div>
          )}
        </NoAuth>
      </div>
    </div>
  );
}
