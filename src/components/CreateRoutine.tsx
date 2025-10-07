"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Plus } from "lucide-react";

export default function CreateRoutine() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  function helloWorld() {
    console.log("Hello World!");
    onClose();
  }

  return (
    <>
      <Button
        onPress={onOpen}
        size="sm"
        color="primary"
        className="w-full md:justify-start"
      >
        <Plus className="h-4 w-4" /> Create new routine
      </Button>
      <Modal isOpen={isOpen} size="sm" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex flex-col items-start">
                  <h1 className="text-lg font-bold">Create Routine</h1>
                  <p className="text-xs font-normal text-neutral-400">
                    Set up a new workout routine with exercises.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody></ModalBody>
              <ModalFooter>
                <Button size="sm" onPress={onClose}>
                  Close
                </Button>
                <Button size="sm" onPress={helloWorld} color="primary">
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
