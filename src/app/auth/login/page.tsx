"use client";

import RecoverPassword from "@/components/RecoverPassword";
import SignUp from "@/components/SignUp";
import useAuth from "@/store/auth";
import useSettings from "@/store/settings";
import { UsersLogin } from "@/utils/entities/usersModel";
import { getI18nText } from "@/utils/i18n";
import { ApiLogIn } from "@/utils/supabase/api/auth";
import { Button, Checkbox, Form, Input, Spinner } from "@heroui/react";
import { LogInIcon } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

type LoginErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const settings = useSettings();
  const auth = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (auth.isAuthenticated) {
      router.replace("/user/home");
    }
  }, [auth.isAuthenticated, router]);

  const [isLoading, setIsLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [submitted, setSubmitted] = React.useState(null as LoginErrors | null);
  const [errors, setErrors] = React.useState<LoginErrors>({});
  const [rememberMe, setRememberMe] = React.useState<boolean>(
    typeof globalThis !== "undefined" && globalThis.localStorage
      ? globalThis.localStorage.getItem("remember_me") === "1"
      : false
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    setErrors({});

    try {
      const payload: UsersLogin = {
        email: data.email as string,
        password: data.password as string,
      };

      const response = await ApiLogIn(payload, rememberMe);

      auth.login(response);
      setIsLoading(false);
      setSubmitted(payload);

      if (globalThis) {
        globalThis.location.href = "/user/home";
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setErrors({
        email: getI18nText("signUp.error.email", settings.language),
        password: getI18nText("signUp.error.password", settings.language),
      });
    }
  };

  const login = (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="max-w-xs w-full flex flex-col justify-center items-center bg-neutral-900 p-5 rounded-lg">
        <h3 className="text-left pb-4 text-lg font-bold text-white w-full">
          {getI18nText("login.login", settings.language)}
        </h3>
        <Form
          validationErrors={errors}
          onSubmit={onSubmit}
          onReset={() => setSubmitted(null)}
          className="w-full"
        >
          <div className="flex flex-col gap-y-3 w-full">
            <Input
              isRequired
              label={getI18nText("signUp.placeholder.email", settings.language)}
              placeholder={getI18nText(
                "signUp.placeholder.email",
                settings.language
              )}
              labelPlacement="outside"
              size="sm"
              name="email"
              type="email"
            />
            <Input
              isRequired
              label={getI18nText("signUp.password", settings.language)}
              placeholder={getI18nText(
                "signUp.placeholder.password",
                settings.language
              )}
              errorMessage={({ validationDetails }) => {
                if (validationDetails.valueMissing) {
                  return getI18nText(
                    "signUp.error.password",
                    settings.language
                  );
                }

                return (
                  errors.password ||
                  getI18nText("signUp.error.password", settings.language)
                );
              }}
              labelPlacement="outside"
              name="password"
              size="sm"
              value={password}
              onValueChange={setPassword}
              type="password"
            />
            <Checkbox
              size="sm"
              isSelected={rememberMe}
              onValueChange={setRememberMe}
            >
              {getI18nText("login.rememberMe", settings.language)}
            </Checkbox>
            <RecoverPassword></RecoverPassword>
            <Button
              size="sm"
              className="w-full"
              color="primary"
              type="submit"
              isLoading={isLoading}
            >
              {getI18nText("login.login", settings.language)}{" "}
              <LogInIcon className="w-auto h-4" />
            </Button>
            <SignUp />
          </div>
          {submitted && (
            <div className="text-green-400 font-bold text-center w-full text-xs">
              {getI18nText("signUp.success", settings.language)}
            </div>
          )}
        </Form>
      </div>
    </div>
  );

  const loginAuthenticated = (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="max-w-xs w-full flex flex-col justify-center items-center bg-neutral-900 p-5 rounded-lg">
        <Spinner size="md" color="primary"></Spinner>
      </div>
    </div>
  );

  return auth.isAuthenticated ? loginAuthenticated : login;
}
