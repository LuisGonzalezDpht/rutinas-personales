import { UserLoginResponse } from "@/utils/entities/usersModel";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  isAuthenticated: boolean;
  sessionData: UserLoginResponse | null;
  login: (data: UserLoginResponse) => void;
  logout: () => void;
};

const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      sessionData: null,
      login: (data: UserLoginResponse) =>
        set({
          isAuthenticated: true,
          sessionData: data,
        }),
      logout: () => set({ isAuthenticated: false, sessionData: null }),
    }),
    {
      name: "user-auth",
      storage:
        typeof globalThis !== "undefined"
          ? createJSONStorage(() => {
              const remember = globalThis.localStorage.getItem("remember_me");
              return remember === "1"
                ? globalThis.localStorage
                : globalThis.sessionStorage;
            })
          : undefined,
    }
  )
);

export default useAuth;
