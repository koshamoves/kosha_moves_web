"use client";
import {
  FC,
  HTMLAttributes,
  PropsWithChildren,
  useEffect,
  useState,
  useRef,
} from "react";
import { Footer, NavHeader, SideNav } from "../navigation";
import { useValidRoute } from "@/hooks/useValidRoute";
import { Routes } from "@/core/routing";
import { cn } from "@/lib/utils";
import { auth } from "@/firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { Loader } from "lucide-react";
import { User, deleteUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firestore";
import useUserStore from "@/stores/user.store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const layoutMainWrapperRef = useRef<HTMLDivElement | null>(null);
  const updateUser = useUserStore((state) => state.update);
  const { isValidRoute } = useValidRoute([
    Routes.signIn,
    Routes.signUp,
    Routes.forgotPassword,
    Routes.root,
    ...Object.values(Routes.sequence),
  ]);
  const { isValidRoute: isNonAuthRoute } = useValidRoute([
    Routes.root,
    ...Object.values(Routes.sequence),
    Routes.bookMoveQuotes,
    Routes.bookMoveQuoteDetails,
    Routes.hireLabourQuotes,
    Routes.hireLabourQuoteDetails,
  ]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
    layoutMainWrapperRef.current?.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUser(user);
            updateUser({ ...user, ...userDoc.data() });
          } else {
            await deleteUser(user);
            router.replace(Routes.signIn);
          }
        } catch (err) {
          router.replace(Routes.signIn);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [updateUser, router]);

  useEffect(() => {
    if (!isLoading && !user && !isValidRoute && !isNonAuthRoute) {
      router.replace(Routes.signIn);
    }
  }, [isLoading, user, isValidRoute, router, isNonAuthRoute]);

  if (isLoading || (!user && !isValidRoute && !isNonAuthRoute)) {
    return (
      <div className="min-h-screen h-screen flex items-center justify-center">
        <Loader className="animate-spin w-[40px] h-[40px] text-primary" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen h-screen overflow-x-hidden flex">
        {((!isValidRoute && user) || isNonAuthRoute) && (
          <div className="flex-1 max-w-[250px] hidden lg:block">
            <SideNav nonAuth={!user && isNonAuthRoute} />
          </div>
        )}
        <div
          className={cn(
            "flex-1 h-full flex items-center justify-center bg-white-200",
            {
              "bg-white-100": isValidRoute,
            }
          )}
        >
          <div
            ref={layoutMainWrapperRef}
            id="layoutMainWrapper"
            className={cn(
              "max-w-[1300px] xl:max-w-[1400px] overflow-x-hidden overflow-y-auto w-full h-full flex-1 flex flex-col gap-4 items-center justify-between p-4 sm:p-6"
            )}
          >
            {((!isValidRoute && user) || isNonAuthRoute) && (
              <NavHeader nonAuth={!user && isNonAuthRoute} />
            )}
            <main className="w-full flex-1">{isLoading ? null : children}</main>
            <Footer />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export const Row: FC<HTMLAttributes<HTMLDivElement>> = ({ ...rest }) => (
  <div {...rest} className={cn("flex gap-2", rest.className)} />
);
export const Column: FC<HTMLAttributes<HTMLDivElement>> = ({ ...rest }) => (
  <div {...rest} className={cn("flex flex-col gap-2", rest.className)} />
);
