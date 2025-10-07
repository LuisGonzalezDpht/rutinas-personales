"use client";

import { Button } from "@heroui/react";
import { Calendar, Dumbbell, House, Settings, TrendingUp } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import UserInfo from "@/components/UserInfo";
import useAuth from "@/store/auth";
import Login from "@/components/Login";
import SignUp from "./SignUp";

export default function SideBar() {
  const auth = useAuth();
  const router = useRouter();

  const pathname = usePathname();

  const items = [
    {
      icon: House,
      label: "Home",
      to: "/",
    },
    {
      icon: Calendar,
      label: "Routines",
      to: "/routines",
    },
    {
      icon: Dumbbell,
      label: "Exercises",
      to: "/exercises",
    },
    {
      icon: TrendingUp,
      label: "Progress",
      to: "/progress",
    },
    {
      icon: Settings,
      label: "Settings",
      to: "/settings",
    },
  ];

  function goto(to: string) {
    router.push(to);
  }

  return (
    <nav className="max-w-52 border-r border-r-neutral-700 min-h-screen flex flex-col justify-between">
      <div className="py-3 px-2 border-b border-b-neutral-700 w-full">
        <h1 className="text-lg font-bold flex md:justify-between justify-center items-center w-full gap-x-3">
          <Dumbbell className="h-8 w-auto bg-primary text-black rounded-lg p-0.5" />
          <span className="w-36 md:block hidden">Tracker</span>
        </h1>
      </div>
      <ul className="h-full space-y-0.5 py-1 px-0.5">
        {items.map((item) => (
          <li key={item.label}>
            <Button
              variant={item.to === pathname ? "flat" : "light"}
              size="sm"
              className={
                item.to === pathname
                  ? "w-full md:justify-start"
                  : "w-full md:justify-start text-neutral-500"
              }
              onPress={() => goto(item.to)}
            >
              <item.icon className="h-4 w-4" />{" "}
              <span className="md:block hidden">{item.label}</span>
            </Button>
          </li>
        ))}
      </ul>
      <div className="border-t border-t-neutral-700 w-full max-h-[4.7rem] h-full flex flex-col justify-center items-center">
        {auth.isAuthenticated ? (
          <UserInfo
            src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyZmlsfGVufDB8fDB8fHww"
            name="Luis"
            email="luis@example.com"
            alt="Luis"
          />
        ) : (
          <div className="flex flex-col justify-center items-center gap-y-0.5 w-full px-0.5">
            <Login />
            <SignUp />
          </div>
        )}
      </div>
    </nav>
  );
}
