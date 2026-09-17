"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/business/settings/profile");
  }, [router]);

  return null;
}
