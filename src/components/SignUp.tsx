"use client";

import useSettings from "@/store/settings";
import { UsersSignUp } from "@/utils/entities/usersModel";
import { getI18nText } from "@/utils/i18n";
import { ApiSignUp } from "@/utils/supabase/api/auth";
import {
  Button,
  Form,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import React from "react";

type SignUpErrors = {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
};

export default function SignUp() {
  const settings = useSettings();

  const [password, setPassword] = React.useState("");
  const [submitted, setSubmitted] = React.useState(null as SignUpErrors | null);
  const [errors, setErrors] = React.useState<SignUpErrors>({});

  const getPasswordError = (value: string) => {
    if (value.length < 4) {
      return getI18nText("signUp.error.length", settings.language);
    }
    // if ((value.match(/[A-Z]/g) || []).length < 1) {
    //   return getI18nText("signUp.error.uppercase", settings.language);
    // }
    // if ((value.match(/[^a-z]/gi) || []).length < 1) {
    //   return getI18nText("signUp.error.symbol", settings.language);
    // }

    return null;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    // Custom validation checks
    const newErrors: SignUpErrors = {};

    // Password validation
    const passwordError = getPasswordError(data.password as string);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Username validation
    if (data.username === "admin") {
      newErrors.username = "Username 'admin' is not allowed";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and submit
    setErrors({});

    try {
      const payload: UsersSignUp = {
        username: data.username as string,
        email: data.email as string,
        phone: data.phone as string,
        password: data.password as string,
      };

      await ApiSignUp(payload);
      setSubmitted(payload);
    } catch (err: any) {
      setErrors({ email: err.message ?? "Error al registrarse" });
    }
  };

  return (
    <Popover placement="top" size="sm" backdrop="opaque">
      <PopoverTrigger>
        <Button size="sm" color="default" className="w-full" variant="flat">
          {getI18nText("signUp.signUp", settings.language)}{" "}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2.5">
        <h3 className="text-left w-full pb-4 text-lg font-bold text-white">
          {getI18nText("signUp.signUp", settings.language)}
        </h3>
        <Form
          validationErrors={errors}
          onSubmit={onSubmit}
          onReset={() => setSubmitted(null)}
        >
          <div className="flex flex-col gap-y-3 max-w-md">
            <Input
              isRequired
              errorMessage={({ validationDetails }) => {
                if (validationDetails.valueMissing) {
                  return getI18nText("signUp.error.name", settings.language);
                }

                return (
                  errors.username ||
                  getI18nText("signUp.error.name", settings.language)
                );
              }}
              label={getI18nText("signUp.name", settings.language)}
              placeholder={getI18nText(
                "signUp.placeholder.name",
                settings.language
              )}
              labelPlacement="outside"
              name="username"
              size="sm"
              type="text"
            />
            <Input
              isRequired
              errorMessage={({ validationDetails }) => {
                if (validationDetails.valueMissing) {
                  return getI18nText("signUp.error.email", settings.language);
                }

                return (
                  errors.email ||
                  getI18nText("signUp.error.email", settings.language)
                );
              }}
              label={getI18nText("signUp.email", settings.language)}
              placeholder={getI18nText(
                "signUp.placeholder.email",
                settings.language
              )}
              labelPlacement="outside"
              name="email"
              size="sm"
              type="email"
            />
            <Input
              isRequired
              errorMessage={({ validationDetails }) => {
                if (validationDetails.valueMissing) {
                  return getI18nText("signUp.error.phone", settings.language);
                }

                return (
                  errors.phone ||
                  getI18nText("signUp.error.phone", settings.language)
                );
              }}
              label={getI18nText("signUp.phone", settings.language)}
              placeholder={getI18nText(
                "signUp.placeholder.phone",
                settings.language
              )}
              labelPlacement="outside"
              name="phone"
              size="sm"
              type="text"
            />
            <Input
              isRequired
              errorMessage={getPasswordError(password)}
              isInvalid={!!getPasswordError(password)}
              label={getI18nText("signUp.password", settings.language)}
              placeholder={getI18nText(
                "signUp.placeholder.password",
                settings.language
              )}
              labelPlacement="outside"
              name="password"
              size="sm"
              value={password}
              onValueChange={setPassword}
              type="password"
            />
            <Button size="sm" className="w-full" color="success" type="submit">
              {getI18nText("signUp.signUp", settings.language)}
            </Button>
          </div>

          {submitted && (
            <div className="text-green-400 font-bold text-center w-full text-xs">
              {getI18nText("signUp.success", settings.language)}
            </div>
          )}
        </Form>
      </PopoverContent>
    </Popover>
  );
}
