"use client";

import { ApiRecoverPassword } from "@/utils/supabase/api/auth";
import emailValidator from "@/utils/validators/emailValidator";
import {
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Send } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function RecoverPassword() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!emailValidator(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      await ApiRecoverPassword(email);
      toast.success("Recovery email sent successfully");
      setEmail("");
      onClose(); // ✅ cerrar modal tras envío exitoso
    } catch (err) {
      console.error(err);
      toast.error("Error sending recovery email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Link size="sm" underline="hover" onPress={onOpen}>
        Recover password
      </Link>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="sm"
        classNames={{
          wrapper: "z-[1000]",
          base: "z-[1000]",
          backdrop: "z-[900]",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Recover password</ModalHeader>
              <ModalBody>
                <p>Enter your email to recover your password</p>
                <Input
                  placeholder="Email"
                  value={email}
                  onValueChange={setEmail}
                  type="email"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={onSubmit}
                  isLoading={loading}
                  className="w-full"
                >
                  Send <Send className="inline-block w-4 h-4 ml-2" />
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
