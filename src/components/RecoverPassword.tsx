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
import React from "react";

export default function RecoverPassword() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [email, setEmail] = React.useState("");

  const onSubmit = async () => {
    if (!email) {
      return;
    }
    if (!emailValidator(email)) {
      return;
    }
    await ApiRecoverPassword(email);

    onOpen();
    setEmail("");
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
                  onChange={(e) => setEmail(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onSubmit}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
