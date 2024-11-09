import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "./Navbar";
import MenuBar from "@/components/MenuBar";
import { SessionContextProvider } from "./SessionProvider";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();

  if (!session.user) {
    return redirect("/login");
  }

  return (
    <SessionContextProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          <MenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-secondary px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
          {children}
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-secondary p-3 sm:hidden" />
      </div>
    </SessionContextProvider>
  );
}
