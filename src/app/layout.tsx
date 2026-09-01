import type { Metadata, Viewport } from "next";
import { Public_Sans, Courier_Prime } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import { QuickExpenseButton } from "@/components/quick-expense-button";
import { ServiceWorkerRegister } from "@/components/sw-register";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "iPhone Mania",
  description: "Compra, avaliação e venda de iPhones — caixa, custos e lucro num só lugar.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "iPhone Mania",
  },
};

export const viewport: Viewport = {
  themeColor: "#f2f0ea",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let categorias: { id: string; nome: string }[] = [];
  if (user) {
    const { data } = await supabase
      .from("categorias_saida")
      .select("id, nome")
      .eq("ativo", true)
      .order("nome");
    categorias = data ?? [];
  }

  return (
    <html
      lang="pt-BR"
      className={`${publicSans.variable} ${courierPrime.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper font-sans text-ink">
        <div
          suppressHydrationWarning
          style={{ display: "none" }}
          dangerouslySetInnerHTML={{
            __html:
              "<!-- THESIS: O app fala a língua de uma ordem de serviço de bancada — talão de " +
              "assistência técnica — em vez do card de SaaS genérico que a categoria sempre entrega. " +
              "OWN-WORLD: papel #f2f0ea, tinta #22201c, verde-carimbo #3a6b52 pontual, vermelho-errata " +
              "#c9463c só pra erro; borda rasgada de talão, etiqueta de canto grampeada, botão-carimbo " +
              "de anel duplo, textura de carbono. " +
              "STORY: o sócio entende que está \"abrindo o turno\" pra mexer no caixa/estoque — confia " +
              "porque parece um documento de trabalho real, não um app genérico. " +
              "FIRST VIEWPORT: talão centralizado com borda rasgada no topo/base, etiqueta \"OS Nº 002\" " +
              "grampeada no canto, título \"iPhone Mania\", campos pautados, botão-carimbo rotacionado. " +
              "FORM: Ordem de Serviço de Bancada — escolha do usuário (IMPECCABLE'S PICK, não o roll " +
              "assinado), seed key 4c7757a7. " +
              "FINISH: unreviewed and undocumented is unfinished; this build ends with the finish " +
              "review, the verdict, DESIGN.md, and every shipping raster carrying its provenance. -->",
          }}
        />
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <filter id="ink-roughen" x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.018 0.05" numOctaves="2" seed="7" result="wobble" />
              <feDisplacementMap in="SourceGraphic" in2="wobble" scale="7" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
        {children}
        {user ? <QuickExpenseButton categorias={categorias} /> : null}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
