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
import useSettings from "@/store/settings";
import { getI18nText } from "@/utils/i18n";

export default function RecoverPassword() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const settings = useSettings();
  const t = (key: string) => getI18nText(key, settings.language);

  const onSubmit = async () => {
    if (!email) {
      toast.error(t("recoverPassword.validation.emailRequired"));
      return;
    }

    if (!emailValidator(email)) {
      toast.error(t("recoverPassword.validation.emailInvalid"));
      return;
    }

    try {
      setLoading(true);
      await ApiRecoverPassword(email);
      toast.success(t("recoverPassword.success"));
      setEmail("");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(t("recoverPassword.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Link size="sm" underline="hover" onPress={onOpen}>
        {t("recoverPassword.link")}
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
          {() => (
            <>
              <ModalHeader>{t("recoverPassword.title")}</ModalHeader>
              <ModalBody>
                <p>{t("recoverPassword.enterEmail")}</p>
                <Input
                  placeholder={t("recoverPassword.emailPlaceholder")}
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
                  {t("recoverPassword.action")} {""}
                  <Send className="inline-block w-4 h-4 ml-2" />
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
