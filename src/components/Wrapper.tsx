export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-row [&>div]:flex [&>div]:flex-col [&>div]:min-h-screen [&>div]:justify-between [&>div]:flex-1 justify-between min-h-screen w-full text-xs tracking-[0.20px] dark:bg-neutral-950">
      {children}
    </main>
  );
}
