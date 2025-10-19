import useAuth from "@/store/auth";
import useSettings from "@/store/settings";
import { getI18nText } from "@/utils/i18n";
import { ApiLogOut } from "@/utils/supabase/api/auth";
import { Avatar, Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { LogOutIcon } from "lucide-react";
import React from "react";

type AvatarProps = {
  src: string;
  name?: string;
  email?: string;
  noName?: boolean;
  alt?: string;
};

export default function UserInfo({
  src,
  name,
  email,
  noName = false,
  alt,
  isExpand,
}: AvatarProps & { isExpand?: boolean }) {
  const settings = useSettings();

  const auth = useAuth();

  const [isLoading, setIsLoading] = React.useState(false);

  async function SubmitLogout() {
    setIsLoading(true);
    await ApiLogOut();

    auth.logout();
    setIsLoading(false);
  }

  const username = name ? (
    <div className="flex flex-col">
      {name && name !== "" && <b className="text-[0.80rem]">{name}</b>}{" "}
      {email && email !== "" && (
        <span className="text-neutral-400 text-[0.70rem]">
          {email.split("@")[0]}
        </span>
      )}
    </div>
  ) : null;

  return (
    <Popover placement="top" size="sm" backdrop="opaque">
      <PopoverTrigger>
        <div className="flex gap-x-2 items-center justify-center px-2 py-3 rounded-lg hover:bg-neutral-900/50 cursor-pointer ">
          <Avatar
            src={src}
            alt={alt}
            name={name}
            className="h-8 w-8 rounded-full object-cover bg-neutral-800"
          />
          {isExpand && (
            <span className="w-40 md:block hidden">{!noName && username}</span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-1 w-full">
        <div className="flex flex-col gap-y-3 w-full">
          <Button
            size="sm"
            color="danger"
            onPress={SubmitLogout}
            isLoading={isLoading}
          >
            {getI18nText("userInfo.logOut", settings.language)}
            <LogOutIcon className="w-auto h-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
