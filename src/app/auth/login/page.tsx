"use client";

import RecoverPassword from "@/components/RecoverPassword";
import SignUp from "@/components/SignUp";
import useAuth from "@/store/auth";
import useSettings from "@/store/settings";
import { UsersLogin } from "@/utils/entities/usersModel";
import { getI18nText } from "@/utils/i18n";
import { ApiLogIn } from "@/utils/supabase/api/auth";
import { Button, Checkbox, Input, Spinner } from "@heroui/react";
import { LogInIcon } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const settings = useSettings();
  const auth = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(
    typeof window !== "undefined" &&
      window.localStorage.getItem("remember_me") === "1"
  );

  React.useEffect(() => {
    if (auth.isAuthenticated) {
      router.replace("/user/home");
    }
  }, [auth.isAuthenticated, router]);

  const t = (key: string) => getI18nText(key, settings.language);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!email) {
      toast.error(t("signUp.error.email"));
      return;
    }
    if (!password) {
      toast.error(t("signUp.error.password"));
      return;
    }

    try {
      setIsLoading(true);

      const payload: UsersLogin = { email, password };
      const response = await ApiLogIn(payload, rememberMe);

      auth.login(response);
      toast.success(t("login.success"));
      router.replace("/user/home");
    } catch (err) {
      console.error(err);
      toast.error(t("login.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRememberChange = (value: boolean) => {
    setRememberMe(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("remember_me", value ? "1" : "0");
    }
  };

  if (auth.isAuthenticated) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="max-w-xs w-full flex flex-col justify-center items-center bg-neutral-900 p-5 rounded-lg">
          <Spinner size="md" color="primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="max-w-xs w-full flex flex-col justify-center items-center bg-neutral-900 p-5 rounded-lg">
        <h3 className="text-left pb-4 text-lg font-bold text-white w-full">
          {t("login.login")}
        </h3>
        <form onSubmit={onSubmit} className="w-full flex flex-col gap-y-3">
          <Input
            isRequired
            label={t("signUp.email")}
            placeholder={t("signUp.placeholder.email")}
            labelPlacement="outside"
            size="sm"
            name="email"
            type="email"
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
          />
          <Checkbox
            size="sm"
            isSelected={rememberMe}
            onValueChange={handleRememberChange}
          >
            {t("login.rememberMe")}
          </Checkbox>

          <RecoverPassword />

          <Button
            size="sm"
            className="w-full"
            color="primary"
            type="submit"
            isLoading={isLoading}
          >
            {t("login.login")} <LogInIcon className="w-auto h-4" />
          </Button>

          <SignUp />
        </form>
      </div>
    </div>
  );
}
