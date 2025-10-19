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
import { toast } from "sonner";

export default function AddExercise({
  mode = "create",
  onAdd,
}: {
  mode?: "create" | "edit";
  onAdd: (exercise: ExercisesAdded) => void;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [exerciseName, setExerciseName] = React.useState("");
  const [muscleGroup, setMuscleGroup] = React.useState<Set<string>>(new Set());
  const [sets, setSets] = React.useState(1);
  const [reps, setReps] = React.useState(1);
  const [description, setDescription] = React.useState("");

  const handleMuscleGroupChange = React.useCallback(
    (keys: "all" | Set<React.Key>) => {
      if (keys === "all") {
        setMuscleGroup(new Set());
      } else {
        setMuscleGroup(new Set(Array.from(keys).map((k) => String(k))));
      }
    },
    []
  );

  const resetForm = React.useCallback(() => {
    setExerciseName("");
    setMuscleGroup(new Set());
    setSets(1);
    setReps(1);
    setDescription("");
  }, []);

  const validateForm = React.useCallback(() => {
    if (!exerciseName.trim()) {
      toast.error("Please enter an exercise name");
      return false;
    }
    if (muscleGroup.size === 0) {
      toast.error("Please select a muscle group");
      return false;
    }
    if (!sets || sets < 1) {
      toast.error("Sets must be at least 1");
      return false;
    }
    if (!reps || reps < 1) {
      toast.error("Reps must be at least 1");
      return false;
    }
    return true;
  }, [exerciseName, muscleGroup, sets, reps]);

  const handleSend = React.useCallback(() => {
    if (!validateForm()) return;

    const exercise: ExercisesAdded = {
      name: exerciseName.trim(),
      muscleGroup: Array.from(muscleGroup)[0],
      sets,
      reps,
      description: description.trim(),
    };

    onAdd(exercise);
    toast.success("Exercise added successfully");

    resetForm();
    onClose();
  }, [
    exerciseName,
    muscleGroup,
    sets,
    reps,
    description,
    onAdd,
    onClose,
    resetForm,
    validateForm,
  ]);

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
                  <p className="text-xs text-neutral-400">
                    {mode === "create"
                      ? "Add a new exercise to the routine."
                      : "Edit the exercise details."}
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
                    isRequired
                  />
                  <Select
                    label="Muscle Group"
                    placeholder="Select a muscle group"
                    labelPlacement="outside"
                    size="sm"
                    selectedKeys={muscleGroup}
                    onSelectionChange={handleMuscleGroupChange}
                    isRequired
                  >
                    {muscleGroups.map((group) => (
                      <SelectItem key={group}>{group}</SelectItem>
                    ))}
                  </Select>

                  <div className="flex justify-between gap-x-4 w-full">
                    <NumberInput
                      label="Sets"
                      placeholder="e.g., 3"
                      labelPlacement="outside"
                      size="sm"
                      value={sets}
                      onValueChange={setSets}
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
