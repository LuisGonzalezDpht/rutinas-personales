"use client";

import { muscleGroups } from "@/shared/constants/MuscleGroup";
import { ExercisesAdded } from "@/shared/types/ExercisesAdded";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { PlusIcon } from "lucide-react";
import React from "react";

export default function AddExercise({
  mode = "create",
  onAdd,
}: {
  mode?: "create" | "edit";
  onAdd: (exercise: ExercisesAdded) => void;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [exerciseName, setExerciseName] = React.useState("");
  const [muscleGroup, setMuscleGroup] = React.useState<Set<string>>(new Set([]));
  const [sets, setSets] = React.useState(1);
  const [reps, setReps] = React.useState(1);
  const [description, setDescription] = React.useState("");

  const [errors, setErrors] = React.useState({
    exerciseName: "",
    muscleGroup: "",
    sets: "",
    reps: "",
  });

  const handleMuscleGroupChange = (keys: "all" | Set<React.Key>) => {
    if (keys === "all") {
      setMuscleGroup(new Set([]));
    } else {
      setMuscleGroup(new Set(Array.from(keys).map((k) => String(k))));
    }
  };

  function validateForm() {
    let isValid = true;
    if (!exerciseName) {
      setErrors({ ...errors, exerciseName: "Exercise name is required" });
      isValid = false;
    } else {
      setErrors({ ...errors, exerciseName: "" });
    }
    if (!muscleGroup) {
      setErrors({ ...errors, muscleGroup: "Muscle group is required" });
      isValid = false;
    } else {
      setErrors({ ...errors, muscleGroup: "" });
    }
    if (!sets) {
      setErrors({ ...errors, sets: "Sets is required" });
      isValid = false;
    } else {
      setErrors({ ...errors, sets: "" });
    }
    if (!reps) {
      setErrors({ ...errors, reps: "Reps is required" });
      isValid = false;
    } else {
      setErrors({ ...errors, reps: "" });
    }
    return isValid;
  }

  function handleSend() {
    if (!validateForm()) {
      return;
    }

    const exercise: ExercisesAdded = {
      name: exerciseName,
      muscleGroup: Array.from(muscleGroup)[0],
      sets,
      reps,
      description,
    };
    onAdd(exercise);
    setExerciseName("");
    setMuscleGroup(new Set([]));
    setSets(1);
    setReps(1);
    setDescription("");
    setErrors({
      exerciseName: "",
      muscleGroup: "",
      sets: "",
      reps: "",
    });
    onClose();
  }

  return (
    <>
      <Button variant="bordered" size="sm" onPress={onOpen}>
        <PlusIcon className="w-auto h-5" /> Add Exercise
      </Button>
      <Modal isOpen={isOpen} size="sm" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex flex-col items-start">
                  <h1 className="text-lg font-bold">
                    {mode === "create" ? "Add" : "Edit"} Exercise
                  </h1>
                  <p className="text-xs font-normal text-neutral-400">
                    {mode === "create"
                      ? "Add a new exercise to the routine."
                      : "Edit the exercise in the routine."}
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-start gap-y-5">
                  <Input
                    label="Exercise Name"
                    placeholder="e.g., Bench Press, Squats"
                    labelPlacement="outside"
                    size="sm"
                    value={exerciseName}
                    onValueChange={setExerciseName}
                    errorMessage={errors.exerciseName}
                    isRequired
                  />
                  <Select
                    label="Muscle Group"
                    placeholder="Select a muscle group"
                    labelPlacement="outside"
                    className="max-w-1/2"
                    size="sm"
                    selectedKeys={muscleGroup}
                    onSelectionChange={handleMuscleGroupChange}
                    errorMessage={errors.muscleGroup}
                    isRequired
                  >
                    {muscleGroups.map((group) => (
                      <SelectItem key={group}>{group}</SelectItem>
                    ))}
                  </Select>
                  <div className="flex justify-between gap-x-4">
                    <NumberInput
                      label="Sets"
                      placeholder="e.g., 3"
                      labelPlacement="outside"
                      size="sm"
                      value={sets}
                      onValueChange={setSets}
                      errorMessage={errors.sets}
                      minValue={1}
                      maxValue={100}
                      isRequired
                    />
                    <NumberInput
                      label="Reps"
                      placeholder="e.g., 10"
                      labelPlacement="outside"
                      size="sm"
                      value={reps}
                      onValueChange={setReps}
                      errorMessage={errors.reps}
                      minValue={1}
                      maxValue={100}
                      isRequired
                    />
                  </div>
                  <Textarea
                    label="Description (Optional)"
                    placeholder="Add notes about form, technique, etc."
                    labelPlacement="outside"
                    size="sm"
                    value={description}
                    onValueChange={setDescription}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button size="sm" onPress={onClose}>
                  Close
                </Button>
                <Button size="sm" onPress={handleSend} color="primary">
                  {mode === "create" ? "Add" : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
