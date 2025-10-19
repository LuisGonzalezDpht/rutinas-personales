"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";
import {
  Calendar,
  Dumbbell,
  House,
  PanelLeftClose,
  PanelRightClose,
  Settings,
  TrendingUp,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import UserInfo from "@/components/UserInfo";
import useAuth from "@/store/auth";
import { getI18nText } from "@/utils/i18n";
import useSettings from "@/store/settings";

export default function SideBar() {
  const auth = useAuth();
  const router = useRouter();
  const settings = useSettings();
  const pathname = usePathname();

  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 1024);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // Controla el delay del cambio de posición
  useEffect(() => {
    if (!isMobile) return;

    if (settings.sidebarExpand) {
      setIsAnimating(true);
    } else {
      // Espera 300ms (igual a duration-300 del Tailwind)
      const timeout = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [settings.sidebarExpand, isMobile]);

  const items = useMemo(
    () => [
      {
        icon: House,
        label: getI18nText("sideBar.home", settings.language),
        to: "/user/home",
      },
      {
        icon: Calendar,
        label: getI18nText("sideBar.routines", settings.language),
        to: "/user/routines",
      },
      {
        icon: Dumbbell,
        label: getI18nText("sideBar.exercises", settings.language),
        to: "/user/exercises",
      },
      {
        icon: TrendingUp,
        label: getI18nText("sideBar.progress", settings.language),
        to: "/user/progress",
      },
      {
        icon: Settings,
        label: getI18nText("sideBar.settings", settings.language),
        to: "/user/settings",
      },
    ],
    [settings.language]
  );

  const goto = (to: string) => {
    router.push(to);
    if (isMobile && settings.sidebarExpand) {
      settings.setSidebarExpand(false);
    }
  };

  if (!auth.isAuthenticated) return null;

  /** 💡 Ahora solo se aplica fixed mientras se está animando o expandido */
  const containerClass = `
    ${
      isMobile && (settings.sidebarExpand || isAnimating)
        ? "fixed inset-0 z-40 bg-black/70"
        : "relative"
    }
    flex transition-all duration-300 ease-in-out
  `;

  const sidebarClass = `
    ${settings.sidebarExpand ? (isMobile ? "w-full" : "w-64") : "w-16"}
    bg-neutral-900 border-r border-r-neutral-700 h-screen flex flex-col justify-between
    transition-[width] duration-300 ease-in-out
  `;

  return (
    <div className={containerClass}>
      <nav className={sidebarClass}>
        {/* Header */}
        <div className="py-3 px-2 border-b border-b-neutral-700 w-full">
          <h1
            onClick={() => settings.setSidebarExpand(!settings.sidebarExpand)}
            className="text-lg font-bold flex justify-center items-center w-full gap-x-3 bg-warning hover:bg-warning-300 cursor-pointer text-black rounded-lg p-0.5 transition-all duration-200 ease-in-out"
          >
            {settings.sidebarExpand ? (
              <>
                <PanelLeftClose className="h-7 w-auto" />
                <span className="text-lg font-medium text-nowrap">
                  {getI18nText("sideBar.brand", settings.language)}
                </span>
              </>
            ) : (
              <PanelRightClose className="h-7 w-auto" />
            )}
          </h1>
        </div>

        {/* Items */}
        <ul className="h-full space-y-2 p-1 overflow-y-auto">
          {items.map((item) => (
            <li key={item.label}>
              <Button
                className={`w-full transition-all duration-200 ${
                  settings.sidebarExpand ? "justify-start" : "justify-center"
                }`}
                color={item.to === pathname ? "warning" : "default"}
                variant="faded"
                size="sm"
                isIconOnly={!settings.sidebarExpand}
                onPress={() => goto(item.to)}
              >
                <item.icon className="h-4 w-auto" />
                {settings.sidebarExpand && (
                  <span className="text-lg font-medium">{item.label}</span>
                )}
              </Button>
            </li>
          ))}
        </ul>

        {/* User info */}
        <div className="border-t border-t-neutral-700 w-full max-h-[4.7rem] h-full flex flex-col justify-center items-center">
          <UserInfo
            src=""
            name={auth.sessionData?.user?.username || ""}
            email={auth.sessionData?.user?.email || ""}
            alt={auth.sessionData?.user?.username || ""}
            isExpand={settings.sidebarExpand}
          />
        </div>
      </nav>
    </div>
  );
}
