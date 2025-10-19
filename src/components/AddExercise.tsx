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
import useSettings from "@/store/settings";
import { getI18nText } from "@/utils/i18n";

export default function AddExercise({
  mode = "create",
  onAdd,
}: {
  mode?: "create" | "edit";
  onAdd: (exercise: ExercisesAdded) => void;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const settings = useSettings();

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
      toast.error(getI18nText("addExercise.validation.exerciseNameRequired", settings.language));
      return false;
    }
    if (muscleGroup.size === 0) {
      toast.error(getI18nText("addExercise.validation.muscleGroupRequired", settings.language));
      return false;
    }
    if (!sets || sets < 1) {
      toast.error(getI18nText("addExercise.validation.setsMin", settings.language));
      return false;
    }
    if (!reps || reps < 1) {
      toast.error(getI18nText("addExercise.validation.repsMin", settings.language));
      return false;
    }
    return true;
  }, [exerciseName, muscleGroup, sets, reps, settings.language]);

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
    toast.success(getI18nText("addExercise.success", settings.language));

    resetForm();
    onClose();
  }, [exerciseName, muscleGroup, sets, reps, description, onAdd, onClose, resetForm, validateForm, settings.language]);

  return (
    <>
      <Button variant="bordered" size="sm" onPress={onOpen}>
        <PlusIcon className="w-auto h-5" /> {getI18nText("addExercise.button", settings.language)}
      </Button>

      <Modal isOpen={isOpen} size="sm" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex flex-col items-start">
                  <h1 className="text-lg font-bold">
                    {mode === "create"
                      ? getI18nText("addExercise.addTitle", settings.language)
                      : getI18nText("addExercise.editTitle", settings.language)}
                  </h1>
                  <p className="text-xs text-neutral-400">
                    {mode === "create"
                      ? getI18nText("addExercise.addDescription", settings.language)
                      : getI18nText("addExercise.editDescription", settings.language)}
                  </p>
                </div>
              </ModalHeader>

              <ModalBody>
                <div className="flex flex-col items-start gap-y-5">
                  <Input
                    label={getI18nText("addExercise.exerciseName", settings.language)}
                    placeholder={getI18nText("addExercise.placeholder.exerciseName", settings.language)}
                    labelPlacement="outside"
                    size="sm"
                    value={exerciseName}
                    onValueChange={setExerciseName}
                    isRequired
                  />
                  <Select
                    label={getI18nText("addExercise.muscleGroup", settings.language)}
                    placeholder={getI18nText("addExercise.placeholder.muscleGroup", settings.language)}
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
                      label={getI18nText("addExercise.sets", settings.language)}
                      placeholder={getI18nText("addExercise.placeholder.sets", settings.language)}
                      labelPlacement="outside"
                      size="sm"
                      value={sets}
                      onValueChange={setSets}
                      minValue={1}
                      maxValue={100}
                      isRequired
                    />
                    <NumberInput
                      label={getI18nText("addExercise.reps", settings.language)}
                      placeholder={getI18nText("addExercise.placeholder.reps", settings.language)}
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
                    label={getI18nText("addExercise.descriptionOptional", settings.language)}
                    placeholder={getI18nText("addExercise.placeholder.description", settings.language)}
                    labelPlacement="outside"
                    size="sm"
                    value={description}
                    onValueChange={setDescription}
                  />
                </div>
              </ModalBody>

              <ModalFooter>
                <Button size="sm" onPress={onClose}>
                  {getI18nText("common.close", settings.language)}
                </Button>
                <Button size="sm" onPress={handleSend} color="primary">
                  {mode === "create"
                    ? getI18nText("common.add", settings.language)
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
