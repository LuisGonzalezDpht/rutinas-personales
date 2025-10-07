import { Avatar, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";

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
}: AvatarProps) {
  const username = name ? (
    <div className="flex flex-col">
      {name && name !== "" && <b className="text-[0.80rem]">{name}</b>}{" "}
      {email && email !== "" && (
        <span className="text-neutral-400 text-[0.70rem]">{email}</span>
      )}
    </div>
  ) : null;

  return (
    <Popover placement="top" size="sm" backdrop="opaque">
      <PopoverTrigger>
        <div className="flex gap-x-2 items-center justify-center px-0.5 py-3 rounded-lg hover:bg-neutral-900/50 cursor-pointer">
          <Avatar
            src={src}
            alt={alt}
            name={name}
            className="h-8 w-8 rounded-full object-cover bg-neutral-800"
          />
          <span className="w-36 md:block hidden">{!noName && username}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-1">{username}</PopoverContent>
    </Popover>
  );
}
