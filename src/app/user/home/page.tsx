import HeaderPage from "@/components/HeaderPage";
import NoAuth from "@/components/NoAuth";
import { ApiValidateLogin } from "@/utils/supabase/api/auth";

export default async function Home() {
  await ApiValidateLogin();

  return (
    <div>
      <HeaderPage title="Home" subtitle="Welcome to the Tracker" />
      <div className="p-2">
        <NoAuth>
          <div>estas logueado</div>
        </NoAuth>
      </div>
    </div>
  );
}
