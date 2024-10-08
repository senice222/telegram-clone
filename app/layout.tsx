import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { cn } from "@/lib/utils";
import ModalProvider from "@/providers/modal-provider";
import { SocketProvider } from "@/providers/socket-provider";
import { currentProfile } from "@/lib/currentProfile";
import { QueryProvider } from "@/providers/query-provider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["500", "400"]
});
// const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "chat application",
  description: "",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await currentProfile()

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            // openSans.className,
            roboto.className,
            "bg-[#313338] dark"
          )}
        >
          <SocketProvider id={profile ? profile.id : ""}>
            <QueryProvider>
              <ModalProvider />
              {children}
            </QueryProvider>
          </SocketProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
