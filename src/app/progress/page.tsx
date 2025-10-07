import HeaderPage from "@/components/HeaderPage";
import NoAuth from "@/components/NoAuth";

export default function Progress() {
  return (
    <div>
      <HeaderPage title="Progress" subtitle="Track your progress" />
      <div className="p-2">
        <NoAuth>
          <div>estas logueado</div>
        </NoAuth>
      </div>
    </div>
  );
}
