"use client";

import { ApiSetTrackedRoutine } from "@/utils/supabase/api/routines";
import {
  Button,
  Form,
  NumberInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@heroui/react";
import { Check, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function TrackExercise({ id_routine }: { id_routine: string }) {
  const [sets, setSets] = useState<number>(1);
  const [reps, setReps] = useState<number>(1);
  const [weight, setWeight] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validaciones locales
    if (!sets || !reps || !weight) {
      toast.error("Please fill all fields before tracking");
      return;
    }

    if (sets <= 1 || reps <= 1 || weight < 0) {
      toast.error("Values must be greater than 0");
      return;
    }

    try {
      setIsLoading(true);
      const res = await ApiSetTrackedRoutine(id_routine, sets, reps, weight);

      if (res?.code === 200) {
        toast.success("Exercise tracked successfully");
        setSets(1);
        setReps(1);
        setWeight(0);
        onClose(); // Cierra el popover
      } else {
        toast.error(res?.message || "Error tracking exercise");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error sending data");
    } finally {
      setIsLoading(false);
    }
  }

  const isFormValid = sets && reps && weight && sets > 0 && reps > 0;

  return (
    <Popover
      placement="right"
      backdrop="opaque"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <PopoverTrigger>
        <Button variant="flat" color="primary" isIconOnly onPress={onOpen}>
          <Pencil className="w-auto h-3" />
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <div className="p-3 min-w-[200px]">
          <Form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-y-3">
              <NumberInput
                size="sm"
                placeholder="e.g., 3"
                label="Sets"
                labelPlacement="outside"
                value={sets}
                onValueChange={setSets}
                minValue={1}
              />
              <NumberInput
                size="sm"
                placeholder="e.g., 10"
                label="Repetitions"
                labelPlacement="outside"
                value={reps}
                onValueChange={setReps}
                minValue={1}
              />
              <NumberInput
                size="sm"
                placeholder="e.g., 60"
                label="Weight (kg)"
                labelPlacement="outside"
                value={weight}
                onValueChange={setWeight}
                minValue={0}
              />

              <Button
                size="sm"
                className="w-full"
                variant="flat"
                color="success"
                type="submit"
                isLoading={isLoading}
                isDisabled={!isFormValid}
              >
                Track
                <Check className="w-auto h-3 ml-2" />
              </Button>
            </div>
          </Form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
