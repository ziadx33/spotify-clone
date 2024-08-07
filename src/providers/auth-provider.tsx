"use client";

import Loading from "@/components/ui/loading";
import { AUTH_ROUTES } from "@/constants";
import { useSession } from "@/hooks/use-session";
import { SessionProvider } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

type AuthProviderProps = Readonly<{
  children: ReactNode;
}>;

function Provider({ children }: AuthProviderProps) {
  const { status, data } = useSession();
  const doneSessionLoading = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const isCurrentPathnameIsAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  useEffect(() => {
    if (status === "loading") return;
    if (!data?.user && !isCurrentPathnameIsAuthRoute) router.push("/login");
    else if (data?.user && isCurrentPathnameIsAuthRoute) {
      location.pathname = "/";
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isCurrentPathnameIsAuthRoute]);

  if (status === "loading" && !doneSessionLoading) return <Loading />;
  else doneSessionLoading.current = true;
  return children;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => (
  <SessionProvider>
    <Provider>{children}</Provider>
  </SessionProvider>
);
