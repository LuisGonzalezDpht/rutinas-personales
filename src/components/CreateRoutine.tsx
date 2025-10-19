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

export default function CreateRoutine({
  mode = "create",
}: {
  mode?: "create" | "edit";
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [routineName, setRoutineName] = React.useState("");
  const [daySelected, setDaySelected] = React.useState(new Set(["monday"]));
  const [exercises, setExercises] = React.useState<ExercisesAdded[]>([]);

  const auth = useAuth();

  async function addRoutine() {
    if (exercises.length === 0) return;
    if (!routineName && daySelected.size === 0) return;

    const id_user = await ApiGetUser(auth.sessionData?.user.email || "");

    const responseData: routineRequest = {
      p_name: routineName,
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

    const response = await RpcCreateRoutine(responseData);

    if (response.code === 200) {
      toast.success("Routine created successfully");
    } else {
      toast.error(response.message);
    }

    setRoutineName("");
    setDaySelected(new Set());
    setExercises([]);

    onClose();
  }

  function addExercise(exercise: ExercisesAdded) {
    setExercises([...exercises, exercise]);
  }

  function removeExercise(index: number) {
    setExercises(exercises.filter((_, i) => i !== index));
  }

  const isRoutineValid = exercises.length > 0;

  const ExercisesList = exercises.map((exercise, index) => (
    <div
      key={index}
      className={`flex flex-col items-start gap-y-2 relative p-4 transition-colors duration-200 group ${
        index === exercises.length % 2
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
      <div
        onClick={() => removeExercise(index)}
        className="absolute top-1 right-1 group-hover:opacity-100 opacity-0 transition-opacity duration-200 cursor-pointer"
      >
        <X className="h-4 w-4" />
      </div>
    </div>
  ));

  const ExercisesListContainer = (
    <div className="w-full bg-neutral-800 rounded-lg text-center max-h-[250px] overflow-auto transition-all duration-200">
      {isRoutineValid ? (
        ExercisesList
      ) : (
        <p className="text-xs p-4">
          No exercises added yet. Click "Add Exercise" to get started.
        </p>
      )}
    </div>
  );

  return (
    <>
      <Button
        onPress={onOpen}
        size="sm"
        color="primary"
        className="w-full md:justify-start"
      >
        <Plus className="h-4 w-4" /> {mode === "create" ? "Create" : "Edit"} new
        routine
      </Button>
      <Modal isOpen={isOpen} size="sm" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex flex-col items-start">
                  <h1 className="text-lg font-bold">
                    {mode === "create" ? "Create" : "Edit"} Routine
                  </h1>
                  <p className="text-xs font-normal text-neutral-400">
                    {mode === "create"
                      ? "Set up a new workout routine with exercises."
                      : "Edit the routine with exercises."}
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-start gap-y-5">
                  <Input
                    label="Routine Name"
                    placeholder="e.g., Push Day, Pull Day, Leg Day"
                    labelPlacement="outside"
                    size="sm"
                    value={routineName}
                    onValueChange={setRoutineName}
                  ></Input>
                  <Select
                    label="Day of Week"
                    placeholder="Select days"
                    labelPlacement="outside"
                    items={daysOfWeek}
                    defaultSelectedKeys={["monday"]}
                    selectedKeys={daySelected}
                    onSelectionChange={setDaySelected as any}
                    size="sm"
                    className="max-w-1/2"
                  >
                    {(day) => (
                      <SelectItem key={day.value}>{day.name}</SelectItem>
                    )}
                  </Select>
                  <div className="py-3 w-full space-y-5">
                    <div className="w-full flex justify-between items-center">
                      <h5 className="text-sm font-bold">Exercises</h5>
                      <AddExercise
                        mode={mode}
                        onAdd={addExercise}
                      ></AddExercise>
                    </div>
                    {ExercisesListContainer}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button size="sm" onPress={onClose}>
                  Close
                </Button>
                <Button size="sm" onPress={addRoutine} color="primary">
                  {mode === "create" ? "Create" : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
