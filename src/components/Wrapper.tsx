import { usePathname } from "next/navigation";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/recover" || pathname === "/auth/login") {
    return (
      <main className="min-h-screen w-full flex items-center justify-center background">
        {children}
      </main>
    );
  }

  return (
    <main className="max-h-screen h-full w-full dark:bg-neutral-950 text-xs tracking-[0.20px] flex flex-row overflow-hidden [&>div]:flex [&>div]:flex-col [&>div]:min-h-screen [&>div]:justify-between [&>div]:flex-1">
      {children}
    </main>
  );
}
