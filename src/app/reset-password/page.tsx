import { TornEdge } from "@/components/torn-edge";
import { CornerTag } from "@/components/corner-tag";
import { MetalClip } from "@/components/metal-clip";
import { ResetPasswordForm } from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-carbon-backdrop px-6 py-12">
      <div className="relative w-full max-w-sm">
        <MetalClip className="absolute -top-4 left-1/2 z-10 h-9 w-14 -translate-x-1/2" />
        <TornEdge className="h-3.5 w-full text-paper" />

        <div className="carbon-texture relative bg-paper px-7 pb-9 pt-6 shadow-[0_1px_0_var(--paper-line),0_18px_36px_-24px_rgb(34_32_28_/_45%)]">
          <CornerTag>Correção</CornerTag>
          <header className="mb-6 border-b border-dashed border-paper-line pb-5">
            <h1 className="ink-title font-ticket text-3xl font-bold tracking-tight text-ink">
              Nova senha
            </h1>
          </header>

          <ResetPasswordForm />
        </div>

        <TornEdge flip className="h-3.5 w-full text-paper" />
      </div>
    </main>
  );
}
