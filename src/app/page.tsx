"use client";

import { Spinner } from "@heroui/react";

export default function NotFound() {
  return (
    <>
      <div className="h-full w-full flex justify-center items-center">
        <Spinner></Spinner>
      </div>
    </>
  );
}
