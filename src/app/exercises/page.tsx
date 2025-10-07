import HeaderPage from "@/components/HeaderPage";
import NoAuth from "@/components/NoAuth";

export default function Exercises() {
  return (
    <div>
      <HeaderPage title="Exercises" subtitle="Manage your exercises" />
      <div className="p-2">
        <NoAuth>
          <div>estas logueado</div>
        </NoAuth>
      </div>
    </div>
  );
}
