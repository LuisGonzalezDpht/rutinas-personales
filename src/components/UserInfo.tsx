"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
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
  const [isLoading, setIsLoading] = useState(false);

  const usernameBlock = useMemo(() => {
    if (noName) return null;
    if (!name && !email) return null;

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

  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      await ApiLogOut();
      auth.logout();
    } finally {
      setIsLoading(false);
    }
  }, [auth]);

  return (
    <Popover
      placement="top"
      size="sm"
      backdrop="opaque"
      classNames={{ content: "p-2" }}
    >
      <PopoverTrigger>
        <div className="flex gap-x-2 items-center justify-center px-2 py-3 rounded-lg hover:bg-neutral-800/60 active:bg-neutral-800 cursor-pointer transition-colors w-11/12">
          <Avatar
            src={src}
            alt={alt}
            name={name}
            className="h-8 w-8 rounded-full object-cover bg-neutral-800"
          />
          {isExpand && (
            <span className="w-full text-left">{usernameBlock}</span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="p-2 w-full">
        <Button
          size="sm"
          color="danger"
          onPress={handleLogout}
          isLoading={isLoading}
          className="flex items-center gap-x-2 justify-center"
        >
          {getI18nText("userInfo.logOut", settings.language)}
          <LogOutIcon className="w-auto h-4" />
        </Button>
      </PopoverContent>
    </Popover>
  );
}
