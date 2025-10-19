"use client";

import { Button } from "@heroui/react";
import {
  Calendar,
  Dumbbell,
  House,
  PanelLeftClose,
  Settings,
  TrendingUp,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import UserInfo from "@/components/UserInfo";
import useAuth from "@/store/auth";
import { getI18nText } from "@/utils/i18n";
import useSettings from "@/store/settings";
import React from "react";

export default function SideBar() {
  const auth = useAuth();
  const router = useRouter();
  const settings = useSettings();

  const pathname = usePathname();

  const items = [
    {
      icon: House,
      label: getI18nText("sideBar.home", settings.language),
      to: "/user/home",
      auth: true,
    },
    {
      icon: Calendar,
      label: getI18nText("sideBar.routines", settings.language),
      to: "/user/routines",
      auth: true,
    },
    {
      icon: Dumbbell,
      label: getI18nText("sideBar.exercises", settings.language),
      to: "/user/exercises",
      auth: true,
    },
    {
      icon: TrendingUp,
      label: getI18nText("sideBar.progress", settings.language),
      to: "/user/progress",
      auth: true,
    },
    {
      icon: Settings,
      label: getI18nText("sideBar.settings", settings.language),
      to: "/user/settings",
      auth: true,
    },
  ];

  function goto(to: string) {
    router.push(to);
  }

  const navClass =
    "w-full border-r border-r-neutral-700 min-h-screen flex flex-col justify-between transition-all duration-200 ease-in-out";

  return (
    auth.isAuthenticated && (
      <nav
        className={`${
          settings.sidebarExpand ? "max-w-64" : "max-w-15"
        } ${navClass}`}
      >
        <div className="py-3 px-2 border-b border-b-neutral-700 w-full">
          <h1 className="text-lg font-bold flex justify-center items-center w-full gap-x-3">
            <PanelLeftClose
              className="h-8 w-full bg-secondary hover:bg-secondary-300 cursor-pointer text-black rounded-lg p-0.5"
              onClick={() => settings.setSidebarExpand(!settings.sidebarExpand)}
            />
          </h1>
        </div>
        <ul className="h-full space-y-0.5 ">
          {items.map(
            (item) =>
              auth.isAuthenticated === item.auth && (
                <li key={item.label}>
                  <div
                    className={`w-full flex items-center gap-x-2 px-2 py-3  hover:bg-neutral-900 cursor-pointer transition-all duration-200 ease-in-out ${
                      item.to === pathname
                        ? "text-neutral-500 bg-neutral-900 font-bold"
                        : ""
                    } ${
                      settings.sidebarExpand
                        ? "max-w-64"
                        : "max-w-15 justify-center"
                    }`}
                    onClick={() => goto(item.to)}
                  >
                    <item.icon className="h-6 w-auto" />{" "}
                    {settings.sidebarExpand && (
                      <span className="text-lg font-medium">{item.label}</span>
                    )}
                  </div>
                </li>
              )
          )}
        </ul>
        {auth.isAuthenticated && (
          <div className="border-t border-t-neutral-700 w-full max-h-[4.7rem] h-full flex flex-col justify-center items-center">
            <UserInfo
              src=""
              name={auth.sessionData?.user?.username || ""}
              email={auth.sessionData?.user?.email || ""}
              alt={auth.sessionData?.user?.username || ""}
              isExpand={settings.sidebarExpand}
            />
          </div>
        )}
      </nav>
    )
  );
}
