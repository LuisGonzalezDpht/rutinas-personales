"use client";

import React from "react";
import {
  Avatar,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from "@heroui/react";
import { LogOutIcon } from "lucide-react";
import useAuth from "@/store/auth";
import useSettings from "@/store/settings";
import { getI18nText } from "@/utils/i18n";
import { ApiLogOut } from "@/utils/supabase/api/auth";

interface UserInfoProps {
  src: string;
  name?: string;
  email?: string;
  noName?: boolean;
  alt?: string;
  isExpand?: boolean;
}

export default function UserInfo({
  src,
  name = "",
  email = "",
  noName = false,
  alt,
  isExpand = false,
}: UserInfoProps) {
  const auth = useAuth();
  const settings = useSettings();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = React.useCallback(async () => {
    try {
      setIsLoading(true);
      await ApiLogOut();
      auth.logout();
    } finally {
      setIsLoading(false);
    }
  }, [auth]);

  const handleLanguageToggle = React.useCallback(() => {
    const newLang = settings.language === "en" ? "es" : "en";
    settings.setLanguage(newLang);
  }, [settings]);

  const usernameBlock = React.useMemo(() => {
    if (noName || (!name && !email)) return null;
    return (
      <div className="flex flex-col">
        {name && <b className="text-[0.80rem] truncate">{name}</b>}
        {email && (
          <span className="text-neutral-400 text-[0.70rem] truncate">
            {email.split("@")[0]}
          </span>
        )}
      </div>
    );
  }, [name, email, noName]);

  return (
    <Popover placement="top" size="sm" backdrop="opaque">
      <PopoverTrigger>
        <div className="flex gap-x-2 items-center justify-center px-2 py-3 rounded-lg hover:bg-neutral-800/60 active:bg-neutral-800 cursor-pointer transition-colors w-11/12">
          <Avatar
            src={src}
            alt={alt}
            name={name}
            className="h-8 w-8 rounded-full object-cover bg-neutral-800"
          />
          {isExpand && <div className="flex-1">{usernameBlock}</div>}
        </div>
      </PopoverTrigger>

      <PopoverContent className="p-3 space-y-3 max-w-md w-full">
        {/* Language toggle */}
        <div className="flex justify-center items-center gap-x-3 text-sm">
          <span>En</span>
          <Switch
            size="sm"
            isSelected={settings.language === "es"}
            onValueChange={handleLanguageToggle}
            aria-label="Toggle language"
          />
          <span>Es</span>
        </div>

        {/* Logout */}
        <Button
          size="sm"
          color="danger"
          onPress={handleLogout}
          isLoading={isLoading}
          className="flex items-center gap-x-2 justify-center w-full"
        >
          {getI18nText("userInfo.logOut", settings.language)}
          <LogOutIcon className="w-auto h-4" />
        </Button>
      </PopoverContent>
    </Popover>
  );
}
