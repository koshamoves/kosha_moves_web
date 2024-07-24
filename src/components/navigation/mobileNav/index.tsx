"use client";
import { Routes } from "@/core/routing";
import { useActiveRoute } from "@/hooks/useActiveRoute";
import { usePathname } from "next/navigation";
import { Calendar, Chat, Home, User } from "@/components/Icons";
import { FC, ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTrigger,
} from "@/components/dialog";
import { Column } from "@/components/layout";
import { NavItem } from "..";
import { Picture } from "@/components/atoms";

interface Props {
  trigger: ReactNode;
}
export const MobileNav: FC<Props> = ({ trigger }) => {
  const { isActiveRoute } = useActiveRoute();
  const path = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const sizes = {
    width: 22,
    height: 22,
  };
  const sequenceRoutes = Object.values(Routes.sequence);
  const messagesRouteMatch = path.match(/^\/messages\/([^/]+)$/);

  const SIDE_NAV_MENU_DATA = [
    {
      title: "Dashboard",
      icon: (
        <Home
          {...sizes}
          invertcolor={
            isActiveRoute(Routes.root) || sequenceRoutes.includes(path)
          }
        />
      ),
      route: Routes.root,
    },
    {
      title: "Bookings",
      icon: (
        <Calendar {...sizes} invertcolor={isActiveRoute(Routes.bookings)} />
      ),
      route: Routes.bookings,
    },
    {
      title: "Messages",
      icon: (
        <Chat
          {...sizes}
          invertcolor={isActiveRoute(Routes.messages) || !!messagesRouteMatch}
        />
      ),
      route: Routes.messages,
    },
    {
      title: "Profile",
      icon: <User {...sizes} invertcolor={isActiveRoute(Routes.profile)} />,
      route: Routes.profile,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="lg:hidden left-0 translate-x-0 max-w-[280px] h-full bg-primary border-0 border-transparent shadow-transparent p-0 flex flex-col justify-start rounded-0">
        <DialogHeader>
          <div className="px-4 pt-8 pb-12">
            <Picture
              container={{
                className: "w-full max-w-[130px] h-[34px]",
              }}
              image={{
                alt: "",
                src: "/images/Logo.png",
              }}
            />
          </div>
        </DialogHeader>
        <Column className="py-6 gap-6">
          {SIDE_NAV_MENU_DATA.map((item, indx) => (
            <NavItem
              key={item.title + indx}
              data={{
                ...item,
                onClick: () => setIsOpen(false),
                isActive:
                  isActiveRoute(item.route) ||
                  (item.route === Routes.root &&
                    sequenceRoutes.includes(path)) ||
                  (item.route === Routes.messages && !!messagesRouteMatch),
              }}
            />
          ))}
        </Column>
      </DialogContent>
    </Dialog>
  );
};

