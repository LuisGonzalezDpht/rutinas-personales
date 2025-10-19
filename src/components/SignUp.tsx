"use client";

import useSettings from "@/store/settings";
import { UsersSignUp } from "@/utils/entities/usersModel";
import { getI18nText } from "@/utils/i18n";
import { ApiSignUp } from "@/utils/supabase/api/auth";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import React from "react";
import { toast } from "sonner";

export default function SignUp() {
  const settings = useSettings();
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const t = (key: string) => getI18nText(key, settings.language);

  const getPasswordError = (value: string) => {
    if (value.length < 4) return t("signUp.error.length");
    return null;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<
      string,
      string
    >;

    // Validaciones
    if (!data.username || data.username === "admin") {
      toast.error(t("signUp.error.name"));
      return;
    }
    if (!data.email) {
      toast.error(t("signUp.error.email"));
      return;
    }
    if (!data.phone) {
      toast.error(t("signUp.error.phone"));
      return;
    }
    const passwordError = getPasswordError(data.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    // Registro
    try {
      setLoading(true);
      const payload: UsersSignUp = {
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
      };

      await ApiSignUp(payload);

      toast.success(t("signUp.success"));
      e.currentTarget.reset();
      setPassword("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("signUp.error.general");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover placement="top" size="sm" backdrop="opaque">
      <PopoverTrigger>
        <Button size="sm" color="default" className="w-full" variant="flat">
          {t("signUp.signUp")}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-3 w-[280px]">
        <h3 className="text-left pb-3 text-lg font-bold text-white">
          {t("signUp.signUp")}
        </h3>

        <form onSubmit={onSubmit} className="flex flex-col gap-y-3">
          <Input
            isRequired
            label={t("signUp.name")}
            placeholder={t("signUp.placeholder.name")}
            labelPlacement="outside"
            name="username"
            size="sm"
          />
          <Input
            isRequired
            label={t("signUp.email")}
            placeholder={t("signUp.placeholder.email")}
            labelPlacement="outside"
            name="email"
            size="sm"
            type="email"
          />
          <Input
            isRequired
            label={t("signUp.phone")}
            placeholder={t("signUp.placeholder.phone")}
            labelPlacement="outside"
            name="phone"
            size="sm"
            type="text"
          />
          <Input
            isRequired
            label={t("signUp.password")}
            placeholder={t("signUp.placeholder.password")}
            labelPlacement="outside"
            name="password"
            size="sm"
            type="password"
            value={password}
            onValueChange={setPassword}
            isInvalid={!!getPasswordError(password)}
            errorMessage={getPasswordError(password) || ""}
          />

          <Button
            size="sm"
            className="w-full mt-2"
            color="success"
            type="submit"
            isLoading={loading}
          >
            {t("signUp.signUp")}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
