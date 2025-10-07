type propType = {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
};

export default function HeaderPage({ title, subtitle, children }: propType) {
  return (
    <div className="py-8 px-5 border-b border-b-neutral-700 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-neutral-400">{subtitle}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}
