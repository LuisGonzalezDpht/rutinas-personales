"use client";

import { daysOfWeek } from "@/shared/constants/Days";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { Plus, X } from "lucide-react";
import React from "react";
import AddExercise from "./AddExercise";
import { ExercisesAdded } from "@/shared/types/ExercisesAdded";
import { routineRequest } from "@/utils/entities/routineModel";
import RpcCreateRoutine from "@/utils/supabase/rpc/routines";
import ApiGetUser from "@/utils/supabase/api/user";
import useAuth from "@/store/auth";
import { toast } from "sonner";
import useSettings from "@/store/settings";
import { getI18nText } from "@/utils/i18n";

export default function CreateRoutine({
  mode = "create",
  onAdd,
}: {
  mode?: "create" | "edit";
  onAdd: () => void;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [routineName, setRoutineName] = React.useState("");
  const [daySelected, setDaySelected] = React.useState<Set<string>>(
    new Set(["monday"])
  );
  const [exercises, setExercises] = React.useState<ExercisesAdded[]>([]);
  const [loading, setLoading] = React.useState(false);

  const auth = useAuth();
  const settings = useSettings();

  const addExercise = React.useCallback(
    (exercise: ExercisesAdded) => setExercises((prev) => [...prev, exercise]),
    []
  );

  const removeExercise = React.useCallback(
    (index: number) =>
      setExercises((prev) => prev.filter((_, i) => i !== index)),
    []
  );

  async function addRoutine() {
    if (exercises.length === 0 || !routineName || daySelected.size === 0) {
      toast.error(
        getI18nText(
          "createRoutine.validation.completeAllFields",
          settings.language
        )
      );
      return;
    }

    try {
      setLoading(true);

      const id_user = await ApiGetUser(auth.sessionData?.user.email || "");

      const requestData: routineRequest = {
        p_name: routineName.trim(),
        p_day_of_week: Array.from(daySelected)[0],
        p_user_id: id_user.id,
        p_exercises: exercises.map((exercise) => ({
          name: exercise.name,
          muscle_group: exercise.muscleGroup,
          sets: exercise.sets,
          reps: exercise.reps,
          description: exercise.description || "",
        })),
      };

      const response = await RpcCreateRoutine(requestData);

      if (response.code === 200) {
        toast.success(getI18nText("createRoutine.success", settings.language));
        onAdd();
        resetForm();
        onClose();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(
        getI18nText("createRoutine.error.generic", settings.language)
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setRoutineName("");
    setDaySelected(new Set(["monday"]));
    setExercises([]);
  }

  const ExercisesList = React.useMemo(
    () =>
      exercises.length > 0 ? (
        exercises.map((exercise, index) => (
          <div
            key={index}
            className={`flex flex-col items-start gap-y-2 relative p-4 transition-colors duration-200 group ${
              index % 2 === 0
                ? "bg-neutral-700 hover:bg-neutral-600"
                : "bg-neutral-800 hover:bg-neutral-700"
            }`}
          >
            <p className="text-xs font-medium text-neutral-400">
              {exercise.name} ({exercise.muscleGroup})
            </p>
            <p className="text-xs font-normal text-neutral-200">
              {exercise.sets} sets of {exercise.reps} reps
            </p>
            {exercise.description && (
              <p className="text-xs font-normal text-neutral-300">
                {exercise.description}
              </p>
            )}
            <button
              onClick={() => removeExercise(index)}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))
      ) : (
        <p className="text-xs p-4 text-center">
          {getI18nText("createRoutine.noExercisesMessage", settings.language)}
        </p>
      ),
    [exercises, removeExercise, settings.language]
  );

  return (
    <>
      <Button
        onPress={onOpen}
        size="sm"
        color="primary"
        className="w-full md:justify-start"
      >
        <Plus className="h-4 w-4" />{" "}
        {mode === "create"
          ? getI18nText("createRoutine.button.create", settings.language)
          : getI18nText("createRoutine.button.edit", settings.language)}
      </Button>

      <Modal isOpen={isOpen} size="sm" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex flex-col items-start">
                  <h1 className="text-lg font-bold">
                    {mode === "create"
                      ? getI18nText(
                          "createRoutine.header.create",
                          settings.language
                        )
                      : getI18nText(
                          "createRoutine.header.edit",
                          settings.language
                        )}
                  </h1>
                  <p className="text-xs text-neutral-400">
                    {mode === "create"
                      ? getI18nText(
                          "createRoutine.description.create",
                          settings.language
                        )
                      : getI18nText(
                          "createRoutine.description.edit",
                          settings.language
                        )}
                  </p>
                </div>
              </ModalHeader>

              <ModalBody>
                <div className="flex flex-col items-start gap-y-5">
                  <Input
                    label={getI18nText(
                      "createRoutine.routineName",
                      settings.language
                    )}
                    placeholder={getI18nText(
                      "createRoutine.placeholder.routineName",
                      settings.language
                    )}
                    labelPlacement="outside"
                    size="sm"
                    value={routineName}
                    onValueChange={setRoutineName}
                  />
                  <Select
                    label={getI18nText(
                      "createRoutine.dayOfWeek",
                      settings.language
                    )}
                    placeholder={getI18nText(
                      "createRoutine.placeholder.selectDays",
                      settings.language
                    )}
                    labelPlacement="outside"
                    items={daysOfWeek}
                    selectedKeys={daySelected}
                    onSelectionChange={(keys) =>
                      setDaySelected(
                        new Set(Array.from(keys).map((k) => String(k)))
                      )
                    }
                    size="sm"
                  >
                    {(day) => (
                      <SelectItem key={day.value}>{day.name}</SelectItem>
                    )}
                  </Select>

                  <div className="py-3 w-full space-y-5">
                    <div className="w-full flex justify-between items-center">
                      <h5 className="text-sm font-bold">
                        {getI18nText("common.exercises", settings.language)}
                      </h5>
                      <AddExercise mode={mode} onAdd={addExercise} />
                    </div>

                    <div className="w-full bg-neutral-800 rounded-lg max-h-[250px] overflow-auto transition-all duration-200">
                      {ExercisesList}
                    </div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button size="sm" onPress={onClose} disabled={loading}>
                  {getI18nText("common.close", settings.language)}
                </Button>
                <Button
                  size="sm"
                  onPress={addRoutine}
                  color="primary"
                  isLoading={loading}
                >
                  {mode === "create"
                    ? getI18nText("common.create", settings.language)
                    : getI18nText("common.save", settings.language)}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
