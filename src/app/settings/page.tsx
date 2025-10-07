import HeaderPage from "@/components/HeaderPage";
import NoAuth from "@/components/NoAuth";

export default function Settings() {
  return (
    <div>
      <HeaderPage title="Settings" subtitle="Manage your account settings" />
      <div className="p-2">
        <NoAuth>
          <div>estas logueado</div>
        </NoAuth>
      </div>
    </div>
  );
}
