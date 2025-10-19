"use client";

import { Button, Input } from "@heroui/react";
import { Lock } from "lucide-react";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ApiResetPassword } from "@/utils/supabase/api/auth";

export default function Recover() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const email = params.get("email");
  const code = params.get("token") || params.get("code");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!email || !code) {
      toast.error("Invalid recovery link");
      return;
    }

    try {
      setLoading(true);
      const result = await ApiResetPassword(code, email, password);

      if (result.success) {
        toast.success("Password reset successfully");
        router.replace("/auth/login");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Error resetting password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="max-w-xs w-full flex flex-col justify-center items-center bg-neutral-900 p-5 rounded-lg">
        <h3 className="text-left pb-4 text-lg font-bold text-white w-full">
          Reset Password
        </h3>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-3">
          <Input
            isRequired
            label="New Password"
            placeholder="Enter new password"
            labelPlacement="outside"
            size="sm"
            type="password"
            value={password}
            onValueChange={setPassword}
          />
          <Input
            isRequired
            label="Confirm Password"
            placeholder="Re-enter password"
            labelPlacement="outside"
            size="sm"
            type="password"
            value={confirmPassword}
            onValueChange={setConfirmPassword}
          />

          <Button
            size="sm"
            className="w-full mt-2"
            color="primary"
            type="submit"
            isLoading={loading}
          >
            Reset Password <Lock className="w-auto h-4 ml-1" />
          </Button>
        </form>
      </div>
    </div>
  );
}
