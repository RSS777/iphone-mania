import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NBTabBar } from "@/components/nb/tab-bar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[var(--nb-bg)] pb-24">
      {children}
      <NBTabBar />
    </div>
  );
}
