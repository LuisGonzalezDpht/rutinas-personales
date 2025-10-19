"use client";

import { Button, Input } from "@heroui/react";
import { Lock } from "lucide-react";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ApiResetPassword } from "@/utils/supabase/api/auth";
import useSettings from "@/store/settings";
import { getI18nText } from "@/utils/i18n";

export default function Recover() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const settings = useSettings();
  const t = (key: string) => getI18nText(key, settings.language);

  const email = params.get("email");
  const code = params.get("token") || params.get("code");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error(t("resetPassword.validation.fillAllFields"));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("resetPassword.validation.passwordMismatch"));
      return;
    }

    if (!email || !code) {
      toast.error(t("resetPassword.validation.invalidLink"));
      return;
    }

    try {
      setLoading(true);
      const result = await ApiResetPassword(code, email, password);

      if (result.success) {
        toast.success(t("resetPassword.success"));
        router.replace("/auth/login");
      } else {
        toast.error(result.message || t("resetPassword.error"));
      }
    } catch (err) {
      toast.error(t("resetPassword.error"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="max-w-xs w-full flex flex-col justify-center items-center bg-neutral-900 p-5 rounded-lg">
        <h3 className="text-left pb-4 text-lg font-bold text-white w-full">
          {t("resetPassword.title")}
        </h3>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-3">
          <Input
            isRequired
            label={t("resetPassword.newPassword")}
            placeholder={t("resetPassword.placeholder.newPassword")}
            labelPlacement="outside"
            size="sm"
            type="password"
            value={password}
            onValueChange={setPassword}
          />
          <Input
            isRequired
            label={t("resetPassword.confirmPassword")}
            placeholder={t("resetPassword.placeholder.confirmPassword")}
            labelPlacement="outside"
            size="sm"
            type="password"
            value={confirmPassword}
            onValueChange={setConfirmPassword}
          />

          <Button
            size="sm"
            className="w-full mt-2"
            color="primary"
            type="submit"
            isLoading={loading}
          >
            {t("resetPassword.action")} <Lock className="w-auto h-4 ml-1" />
          </Button>
        </form>
      </div>
    </div>
  );
}
