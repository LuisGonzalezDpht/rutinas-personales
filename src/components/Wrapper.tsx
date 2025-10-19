import { usePathname } from "next/navigation";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Layout de login / recover
  if (pathname === "/auth/recover" || pathname === "/auth/login") {
    return (
      <main
        className={`${
          pathname === "/auth/recover" ? "background-2" : "background"
        } min-h-screen w-full flex items-center justify-center `}
      >
        {children}
      </main>
    );
  }

  // Layout principal con sidebar + contenido
  return (
    <main className="relative flex flex-row max-h-screen h-full w-full dark:bg-neutral-950 text-xs tracking-[0.20px] overflow-hidden">
      {children}
    </main>
  );
}
